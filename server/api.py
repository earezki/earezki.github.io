from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from embedding import embed_query
from vector_store import search
from subscription import subscribe, unsubscribe

from send_mail import send_welcome

import os

from cachetools import cached, TTLCache

DEBUG = os.getenv("DEBUG", "false").lower() == "true"
app = FastAPI(
    docs_url=None if not DEBUG else "/docs",
    redoc_url=None if not DEBUG else "/redoc",
    openapi_url=None if not DEBUG else "/openapi.json"
)

# CORS
origins = [
    "https://earezki.com",
    "https://www.earezki.com",
]

if DEBUG:
    origins += [
        "http://localhost:4321",
        "http://localhost:3000",
        "http://127.0.0.1:4321",
        "http://127.0.0.1:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)


class SubscribeRequest(BaseModel):
    name: str
    email: str


class UnsubscribeRequest(BaseModel):
    email: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/q", response_model=List[Dict[str, str]])
def query(k: str) -> List[Dict[str, str]]:
    if k:
        k = k.strip()
        return _query(k)
    
    return []

@cached(cache=TTLCache(maxsize=1024, ttl=1*60*60)) # cache for 1H
def _query(keyword: str) -> list[dict[str, str]]:
    print(f"{datetime.now()} - [INFO] search: {keyword}")
    response =  search(embed_query(keyword), top_k=10)
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


@app.post("/subscribe")
def api_subscribe(request: SubscribeRequest):
    reponse = subscribe(request.name, request.email)
    if reponse.get("success"):
        send_welcome(request.email, request.name)
    return reponse


@app.post("/unsubscribe")
def api_unsubscribe(request: UnsubscribeRequest):
    success = unsubscribe(request.email)
    return {"success": success}