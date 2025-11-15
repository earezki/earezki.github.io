import argparse
import os
import hashlib
from pathlib import Path

from embedding import embed_documents
from vector_store import search_by_filename, delete_by_filename, store, search

from langchain_text_splitters import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter

from tqdm import tqdm

folder_to_url_map = {
    "posts": "/",
    "ainews": "/ai-news/",
    "aifinnews": "/ai-financial-news/",
}

chunk_size = 512
overlap = 50

markdown_splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on=[
            ("#", "Header 1"),
            ("##", "Header 2"),
            ("###", "Header 3"),
            ("####", "Header 4"),
    ]
)

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=chunk_size,
    chunk_overlap=overlap,
)

def get_file_hash(filepath):
    """Fast hash for change detection"""
    with open(filepath, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

def read_markdown(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def read_front_matter(content: str) -> dict:
    """
    Read YAML front matter from markdown content.

    Args:
        content (str): The full markdown content including front matter.
    Returns:
        dict: A dictionary containing front matter key-value pairs.
    """
    if not content.startswith("---"):
        raise ValueError(f"Markdown file does not start with front matter.")
    
    end_front_matter = content.find("---", 3)
    front_matter_content = content[3:end_front_matter].strip().split("\n")
    
    front_matter = {}
    for line in front_matter_content:
        if ":" in line:
            key, value = line.split(":", 1)
            front_matter[key.strip()] = value.strip()
    
    return front_matter

def get_chunks(content: str) -> list[str]:
    """
    Chunk the given content into smaller pieces.

    Args:
        content (str): The content to be chunked.
    Returns:
        list[str]: A list of chunked text pieces.
    """
    # First split by markdown headers
    header_chunks = markdown_splitter.split_text(content)
    
    # Further split each header chunk into smaller chunks
    final_chunks = []
    for chunk in header_chunks:
        smaller_chunks = text_splitter.split_text(chunk.page_content)
        final_chunks.extend(smaller_chunks)

    return final_chunks

def find_record(filename: str) -> dict | None:
    existing_records = search_by_filename(filename)
    existing_record = existing_records[0] if existing_records else None
    return existing_record

def embed_markdown(path: str) -> None:
    """
    Embed markdown files from the specified folder

    Args:
        path (str): The path to the folder containing markdown files.
    """

    folder = os.path.basename(path)

    # Fail if folder is not in the predefined map
    if folder not in folder_to_url_map:
        raise ValueError(f"Folder {folder} is not recognized.")
    

    docs_path = Path(path)
    markdown_files = list(docs_path.rglob("*.md"))

    for file_path in tqdm(markdown_files, desc=f"Processing files in {folder}"):

        content = read_markdown(file_path)

        # Extract (title, description, pubDate, categories) front matter if present
        front_matter = read_front_matter(content)

        title = front_matter.get("title")
        description = front_matter.get("description")
        published_at = front_matter.get("pubDate")
        categories = front_matter.get("categories")

        file_hash = get_file_hash(file_path)

        existing_record = find_record(file_path.name)
        if existing_record and existing_record['file_hash'] == file_hash:
            # The file has not changed.
            continue
        elif existing_record:
            # Remove all chunks of existing records for this filename
            delete_by_filename(file_path.name)

        chunks = get_chunks(content)

        # Embed and store each chunk
        for idx, chunk in enumerate(chunks):
            vector = embed_documents([chunk])[0]
            store(
                text=chunk,
                title=title,
                description=description,
                published_at=published_at,
                categories=categories,
                url=folder_to_url_map.get(folder) + file_path.name.replace(".md", ""),
                vector=vector,
                chunk_id=idx + 1,
                total_chunks=len(chunks),
                filename=file_path.name,
                folder=folder,
                file_hash=file_hash,
                mtime=os.path.getmtime(file_path),
            )

def embed(base_path: str) -> None:
    """
    Embed markdown files from all predefined folders.
    Args:
        base_path (str): The base path containing the folders to process.
    """
    for folder in folder_to_url_map.keys():
        embed_markdown(os.path.join(base_path, folder))

def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Process Markdown files for embedding.")
    parser.add_argument("--path", type=str, help="Base path containing the folders to process.", required=True)
    args = parser.parse_args()

    print(f"[INFO] Starting embedding process for path: {args.path}")
    embed(args.path)

if __name__ == "__main__":
    main()