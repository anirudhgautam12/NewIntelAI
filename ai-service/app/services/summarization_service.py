import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from fastapi import HTTPException
from .preprocessing_service import get_spacy_model

# Lazy-loaded singletons for BART model & tokenizer
_tokenizer = None
_model = None

def get_bart_model():
    """
    Lazily loads the BART summarization model and tokenizer on the first call,
    caching it for future runs. Detects and utilizes MPS (Apple Silicon), CUDA, or CPU.
    """
    global _tokenizer, _model
    if _model is None:
        try:
            model_name = "facebook/bart-large-cnn"
            
            # Hardware acceleration check (MPS for M1/M2 Mac, CUDA for GPUs, fallback CPU)
            if torch.backends.mps.is_available():
                device = torch.device("mps")
            elif torch.cuda.is_available():
                device = torch.device("cuda")
            else:
                device = torch.device("cpu")
                
            print(f"[AI Service] Loading BART model on device: {device}...")
            _tokenizer = AutoTokenizer.from_pretrained(model_name)
            _model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to(device)
            print("[AI Service] BART model loaded successfully.")
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to load Hugging Face summarization model: {str(e)}"
            ) from e
    return _tokenizer, _model

def get_sentence_aware_chunks(text: str, max_tokens: int = 800) -> list:
    """
    Splits long article text into sentence-aware blocks, each within the specified maximum token length.
    """
    tokenizer, _ = get_bart_model()
    nlp = get_spacy_model()
    
    # Process text using spaCy to extract clean sentences
    doc = nlp(text)
    sentences = [sent.text.strip() for sent in doc.sents if sent.text.strip()]

    chunks = []
    current_chunk = []
    current_tokens = 0

    for sentence in sentences:
        tokens_in_sentence = len(tokenizer.encode(sentence, add_special_tokens=False))
        
        # If adding sentence exceeds token threshold, build the chunk
        if current_tokens + tokens_in_sentence > max_tokens:
            if current_chunk:
                chunks.append(" ".join(current_chunk))
            current_chunk = [sentence]
            current_tokens = tokens_in_sentence
        else:
            current_chunk.append(sentence)
            current_tokens += tokens_in_sentence

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks

def summarize_text_pipeline(text: str, min_len: int, max_len: int) -> str:
    """
    Runs the forward inference of the BART Seq2Seq model on a text block,
    dynamically adjusting boundaries if the text is shorter than target lengths.
    """
    tokenizer, model = get_bart_model()
    device = model.device

    inputs = tokenizer(text, max_length=1024, truncation=True, return_tensors="pt").to(device)
    input_length = inputs["input_ids"].shape[1]

    # Adjust constraints if the text length is less than maximum target summary length
    adjusted_max = min(max_len, int(input_length * 0.85))
    adjusted_min = min(min_len, int(input_length * 0.4))

    # Guard bounds to prevent model generation errors
    if adjusted_max <= adjusted_min or adjusted_max < 10:
        adjusted_max = max(input_length, max_len)
        adjusted_min = min(5, input_length // 2)

    with torch.no_grad():
        summary_ids = model.generate(
            inputs["input_ids"],
            num_beams=4,
            min_length=adjusted_min,
            max_length=adjusted_max,
            early_stopping=True
        )

    return tokenizer.decode(summary_ids[0], skip_special_tokens=True).strip()

def summarize_article(text: str) -> dict:
    """
    Generates short, medium, and detailed summaries. 
    Handles long articles by chunking, summarizing chunks, merging them, and summarizing again.
    """
    if not text:
        return {"short": "", "medium": "", "detailed": ""}

    tokenizer, _ = get_bart_model()
    token_count = len(tokenizer.encode(text))

    # If document fits within 1024 token limit, we summarize directly
    if token_count <= 850:
        source_text = text
    else:
        # Otherwise, chunk and build a consolidated text representation
        chunks = get_sentence_aware_chunks(text, max_tokens=700)
        chunk_summaries = []
        for chunk in chunks:
            # We summarize chunks using a standard medium configuration to reduce size
            summary = summarize_text_pipeline(chunk, min_len=80, max_len=180)
            chunk_summaries.append(summary)
        source_text = " ".join(chunk_summaries)

    # Generate all three required granularities of summaries from the consolidated text
    detailed_summary = summarize_text_pipeline(source_text, min_len=200, max_len=350)
    medium_summary = summarize_text_pipeline(source_text, min_len=80, max_len=150)
    short_summary = summarize_text_pipeline(source_text, min_len=30, max_len=60)

    return {
        "short": short_summary,
        "medium": medium_summary,
        "detailed": detailed_summary
    }
