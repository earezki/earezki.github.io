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

# install dependencies
pip install -r requirements.txt

# run the ai news script
python -u scripts/ai-news.py

# run the script to generate AI financial news
python -u scripts/fin_news/ai_fin_news.py

# run the embeddings indexer
python -u server/markdown_embedding.py --path ./src/content/

# push changes to the repository
git add .
git commit -m "Automated updates $(date +'%Y-%m-%d')"
git push origin master
