import os
import re
import json
from datetime import date, datetime, timedelta
from email.utils import parsedate_to_datetime

import feedparser
from trafilatura import fetch_url, extract
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate

load_dotenv()

MAX_ENTRIES_PER_RUN = 20
DAYS_TO_LOOK_BACK = 7
OUTPUT_DIR = "src/content/ainews"


def create_llm():
    return ChatOpenAI(
        model=os.getenv("OPENAI_MODEL"),
        temperature=0.5,
        max_retries=2,
        api_key=os.getenv("OPENAI_API_KEY"),
        base_url=os.getenv("OPENAI_API_BASE"),
        default_headers={
            "User-Agent": "ai-news/1.0",
            "HTTP-Referer": "https://earezki.com",
            "X-Title": "ai-news",
            "x-stainless-app-name": "ai-news"
        }
    )


def create_prompt():
    return PromptTemplate.from_template(
        """
        Create a detailed, well-structured summary from the provided context. Synthesize and explain comprehensively for complete understanding.

        ### Guidelines

        **Structure:**
        1. Begin with 1-2 sentences capturing the essence
        2. Provide thorough explanation with:
        - Headings/subsections for major themes
        - Bullet points for multiple items
        - Specific details: dates, percentages, metrics, identifiers
        - Explain nature, purpose, and impact of each point
        - Add the url as a reference link at the end

        **Special Instructions for Code Content:**
        If the context contains code examples or technical implementations:
        - Explain what the main code does and why it's important
        - Provide a complete working example that demonstrates the concept
        - Include practical recommendations and best practices when applicable
        - Show how to apply the technique in real-world scenarios
        - Highlight potential pitfalls or common mistakes to avoid

        **Format:**

        ```
        ---
        title: "Your Generated Title"
        pubDate: YYYY-MM-DD
        description: "Concise description of the content"
        categories: ["AI News", "Topic1", "Topic2"]
        ---

        ## Main Heading

        Content with proper Markdown formatting...

        ## Working Example (if code-related)

        ```language
        // Complete, runnable code example
        ```

        ## Recommendations (if code-related)

        - Practical tips and best practices
        - When to use this approach
        - What to watch out for
        ```

        **IMPORTANT YAML Rules:**
        - ALWAYS wrap title in double quotes (required for YAML)
        - ALWAYS wrap description in double quotes (required for YAML)
        - Use single quotes inside double-quoted strings if needed
        - pubDate must be in YYYY-MM-DD format (not quoted)
        - Extract pubDate from the article's published date in the context
        - If title or description contains colons (:), quotes are MANDATORY
        - Categories must be a JSON array format

        **Content Rules:**
        - Use only provided context
        - Ignore irrelevant content
        - Professional, neutral tone
        - Generate title and description from content
        - Include 'AI News' in categories

        <CONTEXT>
        {context}
        </CONTEXT>

        **Your Answer:**
        """
    )

def sync_git():
    """Sync with remote to avoid conflicts before processing"""
    result = os.system("git pull")
    if result != 0:
        raise RuntimeError("Git pull failed")


def fetch_feeds(feed_urls, cutoff_date):
    """Fetch and filter feed entries published after cutoff_date"""
    all_entries = []
    
    for feed_url in feed_urls:
        try:
            print(f"Fetching feed: {feed_url}")
            feed = feedparser.parse(feed_url)
            print(f"Found {len(feed.entries)} entries")

            entries = [
                {
                    'title': entry.title,
                    'link': entry.link,
                    'published': str(parsedate_to_datetime(entry.published).date())
                } 
                for entry in feed.entries 
                if hasattr(entry, 'published') and 
                   parsedate_to_datetime(entry.published).date() >= cutoff_date
            ]
            
            all_entries.extend(entries)
        except Exception as e:
            print(f"Error fetching {feed_url}: {e}")
            
    return all_entries


def deduplicate_feeds(feeds):
    """Remove duplicate entries by link"""
    return [dict(t) for t in {tuple(d.items()) for d in feeds}]


def generate_filename(entry):
    """Create a clean filename from entry metadata"""
    base_name = f"{entry['published']}-{entry['title']}"
    filename = base_name.lower().replace(' ', '-').replace('/', '-')
    filename = re.sub(r'[^a-z0-9-]', '', filename)
    filename = re.sub(r'-+', '-', filename)
    return f"{OUTPUT_DIR}/{filename}.md"


def clean_llm_response(response):
    """Remove markdown code fences if present"""
    content = response.content.strip()
    if content.startswith("```") and content.endswith("```"):
        return "\n".join(content.split("\n")[1:-1]).strip()
    return content


def process_entry(entry, chain):
    """Download, extract, summarize, and save an article"""
    print(f"Processing: {entry['title']}")
    
    filename = generate_filename(entry)
    
    if os.path.exists(filename):
        print("Already processed, skipping")
        return False

    downloaded = fetch_url(entry['link'])
    if not downloaded:
        print(f"Failed to download: {entry['link']}")
        return False

    content = extract(downloaded, output_format="markdown", with_metadata=True)
    if not content:
        print("Failed to extract content")
        return False

    response = chain.invoke({'context': content})
    cleaned_content = clean_llm_response(response)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(cleaned_content)
    
    print(f"Saved: {filename}")
    return True


def deploy_changes():
    """Commit and push changes to git"""
    print("Deploying changes...")
    os.system("git add .")
    os.system(f'git commit -m "chore: update AI articles ({date.today().isoformat()})"')
    os.system("git push origin master")
    print("Deployed successfully")


def main():
    print(f"=== AI Articles Script: {datetime.now().isoformat()} ===")

    sync_git()
    
    llm = create_llm()
    prompt = create_prompt()
    chain = prompt | llm

    feed_urls = os.getenv("FEED_LIST", "").split(",")
    cutoff_date = date.today() - timedelta(days=DAYS_TO_LOOK_BACK)
    
    feeds = fetch_feeds(feed_urls, cutoff_date)
    feeds = deduplicate_feeds(feeds)
    
    print(f"Total entries found: {len(feeds)}")
    print(f"Entries: {json.dumps(feeds, indent=2)}")

    if not feeds:
        print("No new entries found")
        return

    processed_count = 0
    for entry in feeds:
        try:
            if process_entry(entry, chain):
                processed_count += 1
                if processed_count >= MAX_ENTRIES_PER_RUN:
                    print(f"Reached maximum of {MAX_ENTRIES_PER_RUN} entries")
                    break
        except Exception as e:
            print(f"Error processing {entry['title']}: {e}")

    if processed_count > 0:
        deploy_changes()

    print(f"=== Completed: {datetime.now().isoformat()} ===")


if __name__ == "__main__":
    main()