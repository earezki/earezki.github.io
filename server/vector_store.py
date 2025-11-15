import os
from dotenv import load_dotenv
load_dotenv()

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, FieldCondition, MatchValue, Filter
from embedding import embed_query
from datetime import datetime
import uuid

db_host = os.getenv("QDRANT_HOST")
print(f"[INFO] Connecting to Qdrant at {db_host}")
client = QdrantClient(host=db_host)

embedding_dim = len(embed_query("earezki.com"))

COLLECTION_NAME = "articles"

try:
    client.get_collection(COLLECTION_NAME)
    print(f"[INFO] Using existing Qdrant collection: {COLLECTION_NAME}")
except Exception:
    print(f"[INFO] Creating new Qdrant collection: {COLLECTION_NAME}")
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=embedding_dim, distance=Distance.COSINE),
    )



def store(  text: str, title: str, description: str, published_at: str,
            categories: list[str], url: str, vector: list[float],
            chunk_id: int, total_chunks: int, filename: str,
            folder: str, file_hash: str, mtime: float) -> None:
    """
    Store a document and its metadata into the Qdrant collection.
    Args:
        text (str): The text content of the document.
        title (str): The title of the document.
        description (str): The description of the document.
        published_at (str): The publication date of the document.
        categories (list[str]): The categories of the document.
        url (str): The URL of the document.
        vector (list[float]): The embedding vector of the document.
        chunk_id (int): The chunk ID if the document is part of a larger document.
        total_chunks (int): The total number of chunks for the larger document.
        filename (str): The name of the file containing the document.
        folder (str): The folder where the file is located.
        file_hash (str): The hash of the file to avoid duplicates.
        mtime (float): The modification time of the file.
    Returns:
        None
    """
    
    point = PointStruct(
        id=uuid.uuid4().int % (2**63), # Qdrant requires 64-bit integer IDs
        vector=vector,
        payload={
            "text": text,
            "title": title,
            "description": description,
            "published_at": published_at,
            "url": url,
            "chunk_id": chunk_id,
            "total_chunks": total_chunks,
            "filename": filename,
            "folder": folder,
            "file_hash": file_hash,
            "mtime": mtime,
            "indexed_at": datetime.now().isoformat(),
        }
    )
    
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[point],
    )

def search(query_vector: list[float], top_k: int = 5) -> list[dict]:
    """
    Query the Qdrant collection for the most similar documents to the given vector.
    Args:
        query_vector (list[float]): The embedding vector to query against.
        top_k (int): The number of top similar documents to retrieve.
    Returns:
        list[dict]: A list of the most similar documents and their metadata.
    """
    results = client.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_vector,
        limit=top_k,
    )
    
    return [
        {
            **result.payload,
            "score": result.score,
        }
        for result in results
    ]


def search_by_filename(filename: str) -> list[dict]:
    """
    Retrieve all chunks of a document based on its filename.
    Args:
        filename (str): The filename of the document to retrieve.
    Returns:
        list[dict]: A list of document chunks and their metadata.
    """
    results = client.scroll(
        collection_name=COLLECTION_NAME,
        limit=10000,
        scroll_filter=Filter(
            must=[
                FieldCondition(
                    key="filename",
                    match=MatchValue(value=filename),
                )
            ]
        ),
    )
    
    return [
        {
            **point.payload,
        }
        for point in results[0]
    ]


def delete_by_filename(filename: str) -> None:
    """
    Delete all chunks of a document based on its filename.
    Args:
        filename (str): The filename of the document to delete.
    Returns:
        None
    """
    client.delete(
        collection_name=COLLECTION_NAME,
        points_selector=Filter(
            must=[
                FieldCondition(
                    key="filename",
                    match=MatchValue(value=filename),
                )
            ]
        ),
    )