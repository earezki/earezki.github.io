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
from fuzzywuzzy import fuzz

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

        ## Your Generated Main Heading

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
        - Extract Main Heading from the content
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
    
    # Check for similar articles already in the directory (fuzzy matching)
    existing_files = [f for f in os.listdir(OUTPUT_DIR) if f.endswith('.md')]
    for existing_file in existing_files:
        existing_title = existing_file.replace('.md', '').split('-', 3)[-1]  # Extract title from filename
        similarity = fuzz.ratio(entry['title'].lower(), existing_title.lower())
        if similarity >= 75:  # Threshold for similarity
            print(f"Similar article already exists (similarity: {similarity}%): {existing_file}")
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

def recent_articles():
    import re

    date_re = re.compile(r'^(\d{4}-\d{2}-\d{2})')
    cutoff = date.today() - timedelta(days=7)
    recent_files = []
    for file in os.listdir(OUTPUT_DIR):
        if not file.endswith('.md'):
            continue
        m = date_re.match(file) 
        if not m:
            # skip files without a leading date in the expected format
            continue
        try:
            file_date = date.fromisoformat(m.group(1))
        except ValueError:
            # skip invalid dates
            continue
        if file_date >= cutoff:
            recent_files.append(file)

    return recent_files

def summarize_weekly_articles():
    """Create a consolidated weekly summary of all articles from the past week"""
    weekly_articles = recent_articles()
    
    if not weekly_articles:
        print("No articles found for this week")
        return
    
    # Parse all articles and extract metadata + content
    parsed_articles = []
    for article_file in weekly_articles:
        article_path = os.path.join(OUTPUT_DIR, article_file)
        with open(article_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Extract YAML frontmatter
            frontmatter_match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)$', content, re.DOTALL)
            if not frontmatter_match:
                print(f"Skipping {article_file}: no valid frontmatter")
                continue
            
            frontmatter_text = frontmatter_match.group(1)
            body = frontmatter_match.group(2).strip()
            
            # Parse frontmatter fields
            title_match = re.search(r'title:\s*["\']?(.*?)["\']?\s*$', frontmatter_text, re.MULTILINE)
            pubdate_match = re.search(r'pubDate:\s*(\d{4}-\d{2}-\d{2})', frontmatter_text)
            desc_match = re.search(r'description:\s*["\']?(.*?)["\']?\s*$', frontmatter_text, re.MULTILINE)
            
            title = title_match.group(1).strip('"\'') if title_match else article_file
            pubdate_str = pubdate_match.group(1) if pubdate_match else date.today().isoformat()
            description = desc_match.group(1).strip('"\'') if desc_match else ""
            
            # Get first 20 words of description for summary
            desc_words = description.split()[:20]
            short_desc = ' '.join(desc_words) + ('...' if len(description.split()) > 20 else '')
            
            parsed_articles.append({
                'title': title,
                'pubDate': datetime.strptime(pubdate_str, '%Y-%m-%d').date(),
                'description': description,
                'short_desc': short_desc,
                'body': body,
                'filename': article_file
            })
    
    if not parsed_articles:
        print("No valid articles to summarize")
        return
    
    parsed_articles.sort(key=lambda x: x['pubDate'], reverse=True)
    
    earliest_date = parsed_articles[-1]['pubDate']
    latest_date = parsed_articles[0]['pubDate']
    week_range = f"{earliest_date.strftime('%b %d')} - {latest_date.strftime('%b %d, %Y')}"
    
    all_short_descs = ' | '.join([art['short_desc'] for art in parsed_articles])
    
    summary_filename = f"{OUTPUT_DIR}/weekly-summary-{latest_date.isoformat()}.md"
    
    with open(summary_filename, 'w', encoding='utf-8') as f:
        # Headers
        f.write("---\n")
        f.write(f'title: "AI News Weekly Summary: {week_range}"\n')
        f.write(f"pubDate: {latest_date.isoformat()}\n")
        f.write(f'description: "{all_short_descs[:300]}..."\n')
        f.write('categories: ["AI News", "Weekly Summary"]\n')
        f.write("---\n\n")
        
        # Write introduction with article index
        f.write(f"## Weekly Summary: {week_range}\n\n")
        f.write(f"This week's highlights include {len(parsed_articles)} articles covering:\n\n")
        
        for i, article in enumerate(parsed_articles, 1):
            # Create anchor link from title
            anchor = article['title'].lower().replace(' ', '-').replace(':', '').replace(',', '')
            anchor = re.sub(r'[^a-z0-9-]', '', anchor)
            f.write(f"{i}. [{article['title']}](#{anchor})\n")
        
        f.write("\n---\n\n")
        
        # Write each article with its content
        for i, article in enumerate(parsed_articles, 1):
            anchor = article['title'].lower().replace(' ', '-').replace(':', '').replace(',', '')
            anchor = re.sub(r'[^a-z0-9-]', '', anchor)
            
            f.write(f'<a id="{anchor}"></a>\n\n')
            f.write(f"## {i}. {article['title']}\n\n")
            f.write(f"*Published: {article['pubDate'].strftime('%B %d, %Y')}*\n\n")
            
            f.write(article['body'])
            f.write("\n\n")
            
            # Add separator between articles (except for the last one)
            if i < len(parsed_articles):
                f.write("---\n\n")
        
        f.write("\n---\n\n")
        f.write("*End of Weekly Summary*\n\n")
        f.write("[↑ Back to top](#weekly-summary-" + week_range.lower().replace(' ', '-').replace(',', '') + ")\n")
    
    print(f"Weekly summary created: {summary_filename}")
    print(f" - {len(parsed_articles)} articles")
    print(f" - Date range: {week_range}")

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

    end_of_week = date.today().weekday() == 6  # Sunday
    if end_of_week:
        print("End of week detected, summarizing weekly articles!")
        summarize_weekly_articles()

    if processed_count > 0:
        deploy_changes()

    print(f"=== Completed: {datetime.now().isoformat()} ===")


if __name__ == "__main__":
    main()