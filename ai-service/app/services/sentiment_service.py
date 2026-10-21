import torch
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch.nn.functional as F
from fastapi import HTTPException

# Lazy-loaded singletons for Sentiment model & tokenizer
_sentiment_tokenizer = None
_sentiment_model = None

def get_sentiment_model():
    """
    Lazily loads the RoBERTa sentiment classifier (cardiffnlp/twitter-roberta-base-sentiment-latest)
    on the first request, caching it for subsequent calls. Runs on MPS (M1/M2), CUDA, or CPU.
    """
    global _sentiment_tokenizer, _sentiment_model
    if _sentiment_model is None:
        try:
            model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
            
            if torch.backends.mps.is_available():
                device = torch.device("mps")
            elif torch.cuda.is_available():
                device = torch.device("cuda")
            else:
                device = torch.device("cpu")

            print(f"[AI Service] Loading Sentiment model: {model_name} on device: {device}...")
            _sentiment_tokenizer = AutoTokenizer.from_pretrained(model_name)
            _sentiment_model = AutoModelForSequenceClassification.from_pretrained(model_name).to(device)
            print("[AI Service] Sentiment model loaded successfully.")
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to initialize Hugging Face sentiment model: {str(e)}"
            ) from e
    return _sentiment_tokenizer, _sentiment_model

def analyze_sentiment(text: str) -> dict:
    """
    Analyzes sentiment into POSITIVE, NEUTRAL, or NEGATIVE classes.
    For documents exceeding the model's 512-token sequence limit, the text is split into
    400-token chunks, classification is run on each segment, and the softmax probabilities
    are averaged to construct the final document-level sentiment response.
    """
    if not text or not text.strip():
        return {
            "label": "NEUTRAL",
            "confidence": 1.0,
            "scores": {"positive": 0.0, "neutral": 1.0, "negative": 0.0}
        }

    tokenizer, model = get_sentiment_model()
    device = model.device

    # Encode full input without truncation to assess token length
    full_tokens = tokenizer.encode(text, add_special_tokens=False)
    total_tokens = len(full_tokens)

    scores_list = []

    # If the text easily fits within RoBERTa's sequence limit, analyze as a single piece
    if total_tokens <= 500:
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512).to(device)
        with torch.no_grad():
            outputs = model(**inputs)
            probs = F.softmax(outputs.logits, dim=-1).cpu().numpy()[0]
            scores_list.append(probs)
    else:
        # Long article segment-averaging logic:
        # Split tokens into sequential non-overlapping chunks of 400 tokens
        chunk_size = 400
        for i in range(0, total_tokens, chunk_size):
            chunk_ids = full_tokens[i : i + chunk_size]
            
            # Guard against processing tiny residuals (e.g. less than 10 tokens)
            if len(chunk_ids) < 10 and len(scores_list) > 0:
                continue
                
            # Convert token list back to tensor, adding batch dimension and moving to active device
            chunk_tensor = torch.tensor([chunk_ids]).to(device)
            attention_mask = torch.ones_like(chunk_tensor).to(device)
            
            with torch.no_grad():
                outputs = model(input_ids=chunk_tensor, attention_mask=attention_mask)
                probs = F.softmax(outputs.logits, dim=-1).cpu().numpy()[0]
                scores_list.append(probs)

    # Average the probabilities across all processed chunks
    averaged_probs = np.mean(scores_list, axis=0)

    # cardiffnlp/twitter-roberta-base-sentiment-latest label outputs map to:
    # index 0: negative, index 1: neutral, index 2: positive
    neg_score = float(averaged_probs[0])
    neu_score = float(averaged_probs[1])
    pos_score = float(averaged_probs[2])

    labels = ["NEGATIVE", "NEUTRAL", "POSITIVE"]
    winning_index = int(np.argmax(averaged_probs))
    winning_label = labels[winning_index]
    confidence = float(averaged_probs[winning_index])

    return {
        "label": winning_label,
        "confidence": round(confidence, 4),
        "scores": {
            "positive": round(pos_score, 4),
            "neutral": round(neu_score, 4),
            "negative": round(neg_score, 4)
        }
    }
