_threads = 1

import os
os.environ["OMP_NUM_THREADS"] = str(_threads)
os.environ["OPENBLAS_NUM_THREADS"] = str(_threads)
os.environ["MKL_NUM_THREADS"] = str(_threads)
os.environ["ORT_DISABLE_OPTIONAL_CPU_FEATURES"] = "1"

from fastembed import TextEmbedding

embedding_model = TextEmbedding(
    model_name="BAAI/bge-small-en-v1.5",
    device="cpu",
    threads=_threads,
    providers=["CPUExecutionProvider"],
    # Disable advanced optimizations
    provider_options={
        "CPUExecutionProvider": {
            "arena_extend_strategy": "kSameAsRequested",
        }
    }
)

print("[INFO] The model BAAI/bge-small-en-v1.5 is ready to use.")

def embed_documents(documents: list[str]) -> list[list[float]]:
    """
    Generate embeddings for a list of documents using the specified embedding model.

    Args:
        documents (list[str]): A list of text documents to be embedded.
    Returns:
        list[list[float]]: A list of embeddings, where each embedding is a list of floats.
    """

    embeddings_generator = embedding_model.embed(documents)
    embeddings_list = list(embeddings_generator)
    return embeddings_list

def embed_query(query: str) -> list[float]:
    """
    Generate an embedding for a single query string using the specified embedding model.

    Args:
        query (str): The query string to be embedded.
    Returns:
        list[float]: The embedding for the query as a list of floats.
    """

    embedding_generator = embedding_model.query_embed(query)
    embedding_list = list(embedding_generator)
    if not embedding_list:
        return []
    
    return embedding_list[0]