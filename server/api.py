from fastapi import FastAPI
from typing import List, Dict
from embedding import embed_query
from vector_store import search


app = FastAPI()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/q", response_model=List[Dict[str, str]])
def query(k: str) -> List[Dict[str, str]]:
    print(f"[INFO] search: {k}")
    response =  search(embed_query(k), top_k=10)
    response = [
        {
            "title": r["title"],
            "description": r["description"],
            "published_at": r["published_at"],
            "url": r["url"],
        } for r in response
    ]
    response = deduplicate(response)
    return response


def deduplicate(items: list[dict[str, str]]) -> list[dict[str, str]]:
    seen = set()
    unique = []
    for item in items:
        id = item['url']
        if id not in seen:
            unique.append(item)
            seen.add(id)
    
    return unique