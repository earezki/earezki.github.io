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
echo "Running AI news script..."
python -u scripts/ai-news.py

# run the script to generate AI financial news
echo "Running AI financial news script..."
python -u scripts/fin_news/ai_fin_news.py

# run the embeddings indexer - note if the deployment failed, then the response will contain articles not yet deployed.
echo "Running embeddings indexer..."
python -u server/markdown_embedding.py --path ./src/content/

# run the welcome email processor
echo "Running welcome email processor..."
python -u server/welcome.py

# restart/rebuild the api
echo "Rebuilding and restarting the server..."
docker compose -f server/docker-compose.yml up -d --build
docker system prune -f

# push changes to the repository
echo "Pushing & deploying changes to the repository..."
git add .
git commit -m "Automated updates $(date +'%Y-%m-%d')"
git push origin master
