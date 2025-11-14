from dotenv import load_dotenv

load_dotenv()

import os
import time
import random
from datetime import datetime

from trafilatura import fetch_url, extract
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate

from tickers import get_tickers
from financials import get_financials

from ddgs import DDGS

OUTPUT_DIR = "src/content/aifinnews"

def create_llm(model):
    print(f"[INFO] Using LLM model: {model}")
    return ChatOpenAI(
        model=model,
        temperature=0.5,
        max_retries=2,
        api_key=os.getenv("OPENAI_API_KEY"),
        base_url=os.getenv("OPENAI_API_BASE"),
        default_headers={
            "User-Agent": "ai-financial-news/1.0",
            "HTTP-Referer": "https://earezki.com/ai-financial-news/",
            "X-Title": "ai-financial-news",
            "x-stainless-app-name": "ai-financial-news"
        }
    )

def search_engine(ticker, name, max_results=5) -> list[dict]:
    query = f"{ticker} - {name} financial news"

    try:
        results = DDGS(timeout=30).news(query, safesearch="off", max_results=max_results)    
    except Exception as e:
        print(f"[ERROR] Search engine error: {e}")
        return []

    return [
        {
            "url": r['url'] if 'url' in r else ( r['href'] if 'href' in r else None ),
            "title": r['title'] if 'title' in r else None
        } for r in results
    ]

def get_news(ticker, llm) -> str:
    print(f"[INFO] Searching news for {ticker['ticker']} - {ticker['name']}")
    results = search_engine(ticker['ticker'], ticker['name'])
    
    news = []
    for r in results:
        url = r['url'] if 'url' in r else None
        if url is None:
            continue

        print(f"[INFO] For {ticker['ticker']} found article: {r['title']} - {url}")

        downloaded = fetch_url(url)
        if not downloaded:
            print(f"[WARNING] Failed to download: {url}")
            continue

        content = extract(downloaded, output_format="markdown", with_metadata=True)
        if not content:
            print("[WARNING] Failed to extract content")
            continue
        news.append(content)
    
    news = "\n\n---\n\n".join(news)

    prompt = PromptTemplate.from_template("""
    You are a financial analyst specializing in stock market analysis. Your task is to distill raw news articles into concise, financially relevant information for stock price prediction.

    **Input:** Raw scraped news articles about {ticker} (separated by ---)

    **Task:** Extract and summarize ONLY information that could impact stock price. Focus on:
    - Financial results (revenue, earnings, guidance)
    - Business developments (contracts, partnerships, expansions)
    - Regulatory news (approvals, lawsuits, investigations)
    - Management changes (CEO, key executives)
    - Market sentiment (analyst ratings, price targets)
    - Competitive landscape (new competitors, market share changes)
    - Industry trends affecting the company

    **EXCLUDE:**
    - General market news not specific to this company
    - Historical information older than 1 year
    - Irrelevant company operations
    - Personal news about executives
    - Generic industry commentary

    **Output Format:**
    - Use bullet points for each distinct piece of information
    - Include sources URLs when available
    - Keep each point to 1-2 sentences maximum
    - Prioritize recency and market impact
    - If no relevant information found, output "NO_RELEVANT_NEWS"

    **Raw News Articles:**
    {news}

    **Distilled Financial Information:**
    """)

    chain = prompt | llm
    response = chain.invoke({
        "news": news,
        "ticker": ticker['ticker']
    })

    news = response.content.strip()
    if not news or news == "NO_RELEVANT_NEWS":
        print(f"[WARNING] No relevant financial news found for {ticker['ticker']}")
        return ""

    print(f"[INFO] Distilled news for {ticker['ticker']}: {len(news.split('•'))} key points")
    return news

def eval(news: str, financials: str, llm) -> str:
    prompt = PromptTemplate.from_template("""
    You are an expert quantitative market strategist and financial analyst. Evaluate the company using financial data and latest news to predict if the stock price will **increase** in the **upcoming days to weeks**.

    Current date: {current_date}

    **Input Data:**

    1. **Company Financial Data (Text):**
    {financial_data}

    2. **Latest Relevant News (Text):**
    {news_data}

    ---

    **MANDATORY STRUCTURE (DO NOT DEVIATE):**


    ---
    title: "Short, precise title: [Company] – [current date] - [Prediction] Confidence [Score]/10"
    pubDate: {current_date}
    description: "One sharp sentence: financial signal + news catalyst + prediction."
    categories: ["Stock Weather AI", "Topic1", "Topic2"]
    ---

    ## [Company Ticker] – [Prediction] in Days/Weeks

    [2-sentence hook: one hard financial fact + one news trigger.]

    ### Why This Matters
    [1 paragraph. Connect financial trend to market reality. Explain why this matters *now*.]

    ### Key Insights
    - **[Metric/Fact]**: [e.g., "Revenue +23% YoY, Q3 2025"]
    - **[News Impact]**: [e.g., "FDA approval for lead drug → 30% upside modeled"]
    - **[Risk/Offset]**: [e.g., "High debt/equity = 1.8 → rate sensitivity"]

    ### Practical Implications
    - **Bull Case**: [Trigger + expected move]
    - **Bear Case**: [Counter-risk + potential drop]
    - **Confidence**: **{{confidence}}/10** – [1-line justification]

    **Prediction:** **{{prediction}}**

    **Reference:**
    - [Primary news source URLs]


    ---

    **RULES (STRICT):**
    - Replace **{{prediction}}** with: `increase` or `decrease` (lowercase)
    - Replace **{{confidence}}** with: integer 1–10
    - **title** and **description** in **double quotes**
    - **pubDate**: unquoted, ISO format (e.g., 2025-11-12)
    - **categories**: valid JSON array, max 3
    - **No placeholders** — all fields must be filled
    - **No code blocks**, no JSON, no markdown beyond structure
    **CRITICAL:
    - Never output placeholder text like "[2-sentence hook]". Always replace with real content.**
    - YAML frontmatter for title, pubDate, description and categories must be exact and respected, no deviations.
    - Always write in English.

    """)

    iso_current_date = datetime.now().date().isoformat()

    chain = prompt | llm
    response = chain.invoke({
        "current_date": iso_current_date,
        "financial_data": financials,
        "news_data": news
    })

    return response.content

def main():
    query_llm = create_llm(model = os.getenv("QUERY_MODEL"))
    financial_llm = create_llm(model = os.getenv("FINANCIAL_MODEL"))

    watch_list = [
        {"ticker": "ORCL", "name": "Oracle Corporation"},
        {"ticker": "MSFT", "name": "Microsoft Corporation"},
        {"ticker": "GOOGL", "name": "Alphabet Inc."},
        {"ticker": "AMZN", "name": "Amazon.com, Inc."},
        {"ticker": "NVDA", "name": "NVIDIA Corporation"},
    ]

    tickers = get_tickers() + watch_list
    if tickers is None:
        print("[ERROR] Could not retrieve tickers. Exiting.")
        return
    
    print(f"[INFO] Retrieved {tickers} tickers.")

    for ticker in tickers:
        current_date = datetime.now().date().isoformat()
        filename = f"{OUTPUT_DIR}/{current_date}-{ticker['ticker']}.md"
        if os.path.exists(filename):
            print(f"[INFO] Evaluation for {ticker['ticker']} already exists. Skipping.")
            continue

        # sleep to avoid rate limits
        time.sleep(random.uniform(3, 6))

        news = get_news(ticker, query_llm)
        if not news:
            print(f"[WARNING] No news found for {ticker['ticker']}. Skipping.")
            continue

        print(f"[INFO] News for {ticker['ticker']}")
        print(news)
        
        financials = get_financials(ticker['ticker'], financial_llm)
        if not financials:
            print(f"[WARNING] No financial data found for {ticker['ticker']}. Skipping.")
            continue
        
        evaluation = eval(news, financials, financial_llm)
        with open(filename, "w") as f:
            f.write(evaluation)

        

if __name__ == "__main__":
    main()