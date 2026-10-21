from sentence_transformers import SentenceTransformer
import torch
from fastapi import HTTPException

# Shared lazy-loaded singleton for SentenceTransformer
_embedding_model = None

def get_embedding_model():
    """
    Returns a shared SentenceTransformer model instance (all-MiniLM-L6-v2)
    loaded lazily on the first request and cached in memory.
    """
    global _embedding_model
    if _embedding_model is None:
        try:
            model_name = "all-MiniLM-L6-v2"
            
            # Detect device acceleration
            if torch.backends.mps.is_available():
                device = "mps"
            elif torch.cuda.is_available():
                device = "cuda"
            else:
                device = "cpu"

            print(f"[AI Service] Loading shared SentenceTransformer ({model_name}) on device: {device}...")
            _embedding_model = SentenceTransformer(model_name, device=device)
            print("[AI Service] Shared SentenceTransformer model loaded.")
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to load shared SentenceTransformer model: {str(e)}"
            ) from e
    return _embedding_model
