import os
from dotenv import load_dotenv
load_dotenv()

from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate

from datetime import date, datetime, time

import feedparser
from trafilatura import fetch_url, extract

import json
from email.utils import parsedate_to_datetime

def main():
    print(f"=== AI News Script: {datetime.now().isoformat()} ===")
    
    llm = ChatOpenAI(
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

    prompt = PromptTemplate.from_template(
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
    - add the url as a reference link at the end

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
    ```

    **Rules:**
    - Use only provided context
    - Ignore irrelevant content
    - Professional, neutral tone
    - Generate title and description from content
    - Extract pubDate from context
    - Include 'AI News' in categories

    <CONTEXT>
    {context}
    </CONTEXT>

    **Your Answer:**
    """
    )

    chain = prompt | llm

    feed_list = os.getenv("FEED_LIST", "").split(",")
    
    feeds = []
    for feed_url in feed_list:
        try:
            print("Fetching feed:", feed_url)
            d = feedparser.parse(feed_url)
            print(f"Found {len(d.entries)} entries in feed.")

            feeds += [
                {
                    'title': e.title,
                    'link': e.link,
                    'published': str(parsedate_to_datetime(e.published).date() if hasattr(e, 'published') else None)
                } 
                for e in d.entries 
                if hasattr(e, 'published') and parsedate_to_datetime(e.published).date() == date.today()
            ]
        except Exception as e:
            print(f"Error fetching feed {feed_url}: {e}")
            continue


    print(f"Total new entries for today ({date.today().isoformat()}): {len(feeds)}")

    # Remove duplicates feeds by link
    feeds = [dict(t) for t in {tuple(d.items()) for d in feeds}]

    feeds = feeds[:3]  # Limit to first x entries

    print(f"Today's feeds: {json.dumps(feeds, indent=2)}")

    if not feeds:
        print("No new entries found for today. Exiting.")
        return

    for entry in feeds:
        try:
            print(f"Processing entry: {entry['title']}")
            url = entry['link']

            # check if already processed
            filename = f"src/content/ainews/{entry['published']}-{entry['title'].replace(' ', '-').replace('/', '-')}.md"
            if os.path.exists(filename):
                print(f"Entry {entry['title']} already processed.")
                continue

            downloaded = fetch_url(url)
            if downloaded:
                content = extract(downloaded, output_format="markdown", with_metadata=True)
                if content:
                    response = chain.invoke({
                        'context': content
                    })

                    response = response.content.strip()
                    # remove leading and trailing ``` if present
                    if response.startswith("```") and response.endswith("```"):
                        response = "\n".join(response.split("\n")[1:-1]).strip()

                    
                    with open(filename, 'w', encoding='utf-8') as f:
                        f.write(response)

                    print(f"Saved article to {filename}")
                else:
                    print(f"Failed to extract content from {url}")
            else:
                print(f"Failed to download URL: {url}")
        except Exception as e:
            print(f"Error processing entry {entry['title']}: {e}")
            continue
    
    print("check building the site")
    # check if npm run build is successful
    # the script is run from scripts/ so we need to run it from parent directory

    result = os.system("npm run build")
    if result != 0:
        print("Error building the site.")
    else:
        print("Site built successfully.")
        print("Deploying the site...")
        # commit and push the changes
        os.system("git add .")
        os.system(f'git commit -m "chore: update AI news articles ({date.today().isoformat()})"')
        os.system("git push origin master")
        print("Site deployed successfully.")

    print(f"=== AI News Script Completed At: {datetime.now().isoformat()} ===")
    

if __name__ == "__main__":
    import schedule
    import time

    schedule.every().day.at("23:00").do(main)

    while True:
        schedule.run_pending()
        time.sleep(3600) # check every hour