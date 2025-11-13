import pandas as pd
import requests
import time
import random
from io import StringIO

from tenacity import retry, stop_after_attempt, wait_exponential

from fake_useragent import UserAgent

ua = UserAgent()

@retry(stop=stop_after_attempt(10), wait=wait_exponential(min=2, max=10))
def _scrape_market_movers():
    headers = {
        'User-Agent': ua.random
    }
    
    session = requests.Session()
    session.headers.update(headers)

    print("[INFO] Scraping Yahoo Finance for market movers...")

    gainers_url = "https://finance.yahoo.com/gainers"
    response_gainers = session.get(gainers_url)
    response_gainers.raise_for_status()
    gainers_df = pd.read_html(StringIO(response_gainers.text))[0]

    print("[INFO] Successfully scraped raw gainer data.")

    # add a delay to avoid being blocked
    time.sleep(random.uniform(1, 3))

    losers_url = "https://finance.yahoo.com/losers"
    response_losers = session.get(losers_url)
    response_losers.raise_for_status()
    losers_df = pd.read_html(StringIO(response_losers.text))[0]
    print("[INFO] Successfully scraped raw loser data.")

    return gainers_df, losers_df

def get_tickers(top_n: int = 10):
    """
    Fetches and formats market movers into a dictionary object with ticker and name.
    Returns cached result if available.
    """

    print("[INFO] Fetching new market movers data.")

    try:
        gainers_df, losers_df = _scrape_market_movers()
    except Exception as e:
        print(f"[ERROR] Failed to scrape market data: {e}")
        gainers_df, losers_df = None, None

    if gainers_df is None or losers_df is None:
        return None

    if 'Symbol' in gainers_df.columns and 'Name' in gainers_df.columns:
        gainers_df.dropna(subset=['Symbol', 'Name'], inplace=True)
        gainers_subset = gainers_df[['Symbol', 'Name']].rename(
            columns={'Symbol': 'ticker', 'Name': 'name'}
        )
        gainers_list = gainers_subset.to_dict('records')
    else:
        print("[ERROR] Could not find 'Symbol' or 'Name' columns in gainers data.")
        gainers_list = []

    if 'Symbol' in losers_df.columns and 'Name' in losers_df.columns:
        losers_df.dropna(subset=['Symbol', 'Name'], inplace=True)
        losers_subset = losers_df[['Symbol', 'Name']].rename(
            columns={'Symbol': 'ticker', 'Name': 'name'}
        )
        losers_list = losers_subset.to_dict('records')
    else:
        print("[ERROR] Could not find 'Symbol' or 'Name' columns in losers data.")
        losers_list = []

    top_n = top_n // 2
    return gainers_list[:top_n] + losers_list[:top_n]
