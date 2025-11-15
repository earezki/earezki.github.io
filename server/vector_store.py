import os
from dotenv import load_dotenv
load_dotenv()

import lancedb
from embedding import embed_query
import pyarrow as pa

from datetime import datetime

db_path = os.getenv("BASE_PATH") + "/vectors"
print(f"[INFO] Connecting to LanceDB at {db_path}")
db = lancedb.connect(db_path)

embedding_dim = len(embed_query("earezki.com"))
try:
    table: lancedb.Table = db.open_table("articles")
except Exception as e:
    table = db.create_table(
            "articles",
            schema=pa.schema([
                pa.field("text", pa.string()),
                pa.field("title", pa.string()),
                pa.field("description", pa.string()),
                pa.field("published_at", pa.string()),
                # pa.field("categories", pa.list_(pa.string())),
                pa.field("url", pa.string()),

                pa.field("vector", pa.list_(pa.float32(), embedding_dim)),
                
                # Enumeration during chunking (e.g., 1, 2, 3, ...)
                pa.field("chunk_id", pa.int32()),

                pa.field("total_chunks", pa.int32()),
                
                pa.field("filename", pa.string()),
                pa.field("folder", pa.string()),

                # Hash of the containing file to avoid duplicates
                pa.field("file_hash", pa.string()),

                # Modification time of the file from OS
                pa.field("mtime", pa.float64()),
                
                pa.field("indexed_at", pa.string()),
            ]),
        )
    # table.create_index("vector", method="IVF_FLAT", metric="L2")
    table.create_scalar_index("filename", replace=True)
    table.create_scalar_index("folder", replace=True)



def store(  text: str, title: str, description: str, published_at: str,
            categories: list[str], url: str, vector: list[float],
            chunk_id: int, total_chunks: int, filename: str,
            folder: str, file_hash: str, mtime: float) -> None:
    """
    Store a document and its metadata into the LanceDB table.
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
    
    record = {
        "text": text,
        "title": title,
        "description": description,
        "published_at": published_at,
        # "categories": categories,
        "url": url,
        "vector": vector,
        "chunk_id": chunk_id,
        "total_chunks": total_chunks,
        "filename": filename,
        "folder": folder,
        "file_hash": file_hash,
        "mtime": mtime,
        "indexed_at": datetime.now().isoformat(),
    }

    table.add([record])

def search(query_vector: list[float], top_k: int = 5) -> list[dict]:
    """
    Query the LanceDB table for the most similar documents to the given vector.
    Args:
        query_vector (list[float]): The embedding vector to query against.
        top_k (int): The number of top similar documents to retrieve.
    Returns:
        list[dict]: A list of the most similar documents and their metadata.
    """
    results = table.search(query_vector, "vector").limit(top_k).to_list()
    return results


def search_by_filename(filename: str) -> list[dict]:
    """
    Retrieve all chunks of a document based on its filename.
    Args:
        filename (str): The filename of the document to retrieve.
    Returns:
        list[dict]: A list of document chunks and their metadata.
    """
    results = table.search().where(f"filename = '{filename}'").to_list()
    return results


def delete_by_filename(filename: str) -> None:
    """
    Delete all chunks of a document based on its filename.
    Args:
        filename (str): The filename of the document to delete.
    Returns:
        None
    """
    table.delete().where(f"filename = '{filename}'").execute()