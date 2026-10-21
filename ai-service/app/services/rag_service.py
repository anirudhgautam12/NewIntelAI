import os
import json
import faiss
import numpy as np
from fastapi import HTTPException
from ..core.config import settings
from .preprocessing_service import get_spacy_model
from .embedding_service import get_embedding_model
from .llm_client import get_llm_answer

def chunk_article_text(text: str) -> list:
    """
    Slices raw article text into sentence-aware overlapping chunks.
    Groups sentences using spaCy to maintain structural and context integrity.
    """
    nlp = get_spacy_model()
    doc = nlp(text)
    sentences = [sent.text.strip() for sent in doc.sents if sent.text.strip()]

    if not sentences:
        return [{"chunkId": "chunk_0", "text": text}]

    chunks = []
    chunk_size = 3    # Number of sentences per chunk
    overlap_size = 1  # Overlapping sentences between consecutive chunks
    
    idx = 0
    chunk_num = 0
    while idx < len(sentences):
        current_chunk_sentences = sentences[idx : idx + chunk_size]
        chunk_text = " ".join(current_chunk_sentences).strip()
        
        if chunk_text:
            chunks.append({
                "chunkId": f"chunk_{chunk_num}",
                "text": chunk_text
            })
            chunk_num += 1
            
        # Move sliding window index forward
        idx += (chunk_size - overlap_size)

    return chunks

def create_and_save_index(article_id: str, text: str) -> list:
    """
    Generates sentence-transformer embeddings for article chunks,
    builds a local FAISS index, and saves index/metadata to disk.
    """
    try:
        # 1. Segment text into sentences
        chunks = chunk_article_text(text)
        chunk_texts = [c["text"] for c in chunks]

        # 2. Extract embeddings
        model = get_embedding_model()
        embeddings = model.encode(chunk_texts, show_progress_bar=False)
        embeddings_np = np.array(embeddings).astype('float32')

        # 3. Create FAISS index mapping L2 distances
        dimension = embeddings_np.shape[1]
        index = faiss.IndexFlatL2(dimension)
        index.add(embeddings_np)

        # 4. Verify vector store destination directory
        os.makedirs(settings.VECTOR_STORE_PATH, exist_ok=True)

        # 5. Serialize and persist FAISS index and JSON chunk mappings
        index_file = os.path.join(settings.VECTOR_STORE_PATH, f"{article_id}.faiss")
        meta_file = os.path.join(settings.VECTOR_STORE_PATH, f"{article_id}.json")

        faiss.write_index(index, index_file)
        with open(meta_file, 'w', encoding='utf-8') as f:
            json.dump(chunks, f, ensure_ascii=False, indent=2)

        print(f"[RAG Service] Saved index for article {article_id} to disk.")
        return chunks
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate RAG index for article: {str(e)}"
        ) from e

def query_article_rag(article_id: str, text: str, question: str) -> dict:
    """
    Performs vector similarity search on article chunks and forwards
    top sources as context to the LLM to get a factual answer.
    """
    index_file = os.path.join(settings.VECTOR_STORE_PATH, f"{article_id}.faiss")
    meta_file = os.path.join(settings.VECTOR_STORE_PATH, f"{article_id}.json")

    # If the index or chunk mapping is missing, rebuild it dynamically
    if not os.path.exists(index_file) or not os.path.exists(meta_file):
        print(f"[RAG Service] Index not found for {article_id}. Creating index...")
        chunks = create_and_save_index(article_id, text)
    else:
        # Load pre-existing chunks
        try:
            with open(meta_file, 'r', encoding='utf-8') as f:
                chunks = json.load(f)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to load article metadata: {str(e)}"
            ) from e

    try:
        # Load pre-existing FAISS index
        index = faiss.read_index(index_file)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load article FAISS index: {str(e)}"
        ) from e

    # Embed user question
    try:
        model = get_embedding_model()
        question_emb = model.encode([question], show_progress_bar=False)
        question_emb_np = np.array(question_emb).astype('float32')
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to encode question embedding: {str(e)}"
        ) from e

    # Search for top 3 matching chunks
    k = min(3, len(chunks))
    distances, indices = index.search(question_emb_np, k)

    retrieved_chunks = []
    for idx_val in indices[0]:
        if 0 <= idx_val < len(chunks):
            retrieved_chunks.append(chunks[idx_val])

    # Reconstruct prompt with standard instruction boundaries
    context_str = "\n\n".join([f"[{c['chunkId']}]: {c['text']}" for c in retrieved_chunks])
    
    prompt = f"""You are an intelligent news article assistant.

Answer the user's question using only the provided article context.
Do not use external knowledge.
If the answer cannot be found in the context, say:
'The information is not available in the article.'

Keep the answer concise, factual, and directly related to the question.
Do not invent names, dates, numbers, or events.

---
ARTICLE CONTEXT:
{context_str}
---

USER QUESTION: {question}

HELPFUL RESPONSE:"""

    # Generate answer using modular LLM client
    answer = get_llm_answer(prompt)

    return {
        "answer": answer,
        "sources": retrieved_chunks
    }
