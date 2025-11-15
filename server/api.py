from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from embedding import embed_query
from vector_store import search


app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4321",
        "http://localhost:3000",
        "http://127.0.0.1:4321",
        "http://127.0.0.1:3000",
        "https://earezki.com",
        "https://www.earezki.com",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/q", response_model=List[Dict[str, str]])
def query(k: str) -> List[Dict[str, str]]:
    print(f"[INFO] search: {k}")
    response =  search(embed_query(k), top_k=10)
    response = [
        {
            "title": r.get("title") or "",
            "description": r.get("description") or "",
            "published_at": r.get("published_at") or "",
            "url": r.get("url") or "",
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