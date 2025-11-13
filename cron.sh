#!/bin/bash

# get latest version
git pull


# create a new venv and install dependencies if it doesn't exist
if [ ! -d "./.venv" ]; then
    python3 -m venv ./.venv
    source ./.venv/bin/activate
    pip install -r requirements.txt
else
    source ./.venv/bin/activate
fi

# echo current python version & path
echo "Using Python version: $(python --version)"
echo "Using Python path: $(which python)"

LOG_DIR="./scripts/.output"

mkdir -p "$LOG_DIR"
AI_NEWS_LOG="$LOG_DIR/ai-news-$(date +'%Y%m%d').log"
echo "===== ai-news.py START $(date +'%Y-%m-%dT%H:%M:%S%z') =====" >> "$AI_NEWS_LOG"

python -u scripts/ai-news.py >> "$AI_NEWS_LOG" 2>&1
echo "===== ai-news.py END $(date +'%Y-%m-%dT%H:%M:%S%z') =====" >> "$AI_NEWS_LOG"

# run the script to generate AI financial news
AI_FIN_LOG="$LOG_DIR/ai-fin-news-$(date +'%Y%m%d').log"
echo "===== ai_fin_news.py START $(date +'%Y-%m-%dT%H:%M:%S%z') =====" >> "$AI_FIN_LOG"

python -u scripts/fin_news/ai_fin_news.py >> "$AI_FIN_LOG" 2>&1
echo "===== ai_fin_news.py END $(date +'%Y-%m-%dT%H:%M:%S%z') =====" >> "$AI_FIN_LOG"

push changes to the repository
git add .
git commit -m "Automated updates $(date +'%Y-%m-%d')"
git push origin master