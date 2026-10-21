from keybert import KeyBERT
from .embedding_service import get_embedding_model
from fastapi import HTTPException

# Lazy-loaded singleton for KeyBERT instance
_keybert_instance = None

def get_keybert_instance():
    """
    Lazily instantiates KeyBERT, reuse the shared SentenceTransformer model
    instance as the embedding backend to optimize memory.
    """
    global _keybert_instance
    if _keybert_instance is None:
        try:
            print("[AI Service] Initializing KeyBERT instance...")
            embedding_model = get_embedding_model()
            # Pass our preloaded embedding model directly to KeyBERT
            _keybert_instance = KeyBERT(model=embedding_model)
            print("[AI Service] KeyBERT initialized successfully.")
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to load or configure KeyBERT extractor: {str(e)}"
            ) from e
    return _keybert_instance

def extract_keywords(text: str) -> list:
    """
    Extracts top 10 keywords and keyphrases (1 to 3 words) using KeyBERT.
    Uses Maximal Marginal Relevance (MMR) to diversify outputs and remove similar duplicates.
    """
    if not text or not text.strip():
        return []

    try:
        kw_model = get_keybert_instance()
        # Extract keywords with diversity parameters
        extracted = kw_model.extract_keywords(
            text,
            keyphrase_ngram_range=(1, 3),
            stop_words='english',
            use_mmr=True,
            diversity=0.3,
            top_n=10
        )

        # Structure results as a list of dicts with relevance scores
        results = []
        for keyword, score in extracted:
            results.append({
                "keyword": keyword.strip(),
                "relevance": round(float(score), 4)
            })

        # Ensure elements are sorted by relevance descending
        results.sort(key=lambda x: x["relevance"], reverse=True)
        return results
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error performing keyword extraction: {str(e)}"
        )
