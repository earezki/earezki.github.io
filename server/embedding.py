_threads = 1

import os
os.environ["OMP_NUM_THREADS"] = str(_threads)
os.environ["OPENBLAS_NUM_THREADS"] = str(_threads)
os.environ["MKL_NUM_THREADS"] = str(_threads)
os.environ["ORT_DISABLE_OPTIONAL_CPU_FEATURES"] = "1"

from sentence_transformers import SentenceTransformer

# from fastembed import TextEmbedding
# embedding_model = TextEmbedding(
#     model_name="BAAI/bge-small-en-v1.5",
#     device="cpu",
#     threads=_threads,
#     providers=["CPUExecutionProvider"],
#     # Disable advanced optimizations
#     provider_options={
#         "CPUExecutionProvider": {
#             "arena_extend_strategy": "kSameAsRequested",
#         }
#     }
# )
# print("[INFO] FastEmbed model BAAI/bge-small-en-v1.5 is ready to use.")

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
embedding_model = embedding_model.to('cpu')

print("[INFO] Sentence-Transformers model all-MiniLM-L6-v2 is ready to use.")


def embed_documents(documents: list[str]) -> list[list[float]]:
    """
    Generate embeddings for a list of documents using the specified embedding model.

    Args:
        documents (list[str]): A list of text documents to be embedded.
    Returns:
        list[list[float]]: A list of embeddings, where each embedding is a list of floats.
    """

    embeddings = embedding_model.encode(
        documents,
        batch_size=32,
        show_progress_bar=False,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    return [list(e) for e in embeddings]

def embed_query(query: str) -> list[float]:
    """
    Generate an embedding for a single query string using the specified embedding model.

    Args:
        query (str): The query string to be embedded.
    Returns:
        list[float]: The embedding for the query as a list of floats.
    """

    embedding = embedding_model.encode(
        query,
        batch_size=32,
        show_progress_bar=False,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    return list(embedding)