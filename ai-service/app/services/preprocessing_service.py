import spacy
import unicodedata
import re
from fastapi import HTTPException

# Lazy-loaded spaCy model singleton
_nlp = None

def get_spacy_model():
    """
    Retrieves the cached spaCy model or loads it lazily on the first request.
    """
    global _nlp
    if _nlp is None:
        try:
            _nlp = spacy.load("en_core_web_sm")
        except OSError as e:
            raise HTTPException(
                status_code=500,
                detail="spaCy 'en_core_web_sm' model is missing. Please download it using 'python -m spacy download en_core_web_sm'"
            ) from e
    return _nlp

def preprocess_text(text: str) -> str:
    """
    Normalizes unicode characters, simplifies whitespaces, and processes text
    through spaCy to filter stopwords/punctuation and perform lemmatization.
    """
    if not text:
        return ""

    # 1. Normalize unicode characters (compatibility form NFKC)
    normalized_text = unicodedata.normalize("NFKC", text)

    # 2. Normalize newlines and collapse redundant spaces
    normalized_text = re.sub(r'\r\n|\r', '\n', normalized_text)
    normalized_text = re.sub(r'\n+', '\n', normalized_text)
    normalized_text = re.sub(r'[ \t]+', ' ', normalized_text)
    normalized_text = normalized_text.strip()

    # 3. Process with spaCy for advanced NLP cleaning (Stopword, Punctuation removal, Lemmatization)
    try:
        # Limit text for tokenization/lemmatization if it is massive to avoid CPU timeout
        sample_text = normalized_text[:30000]
        nlp = get_spacy_model()
        # Disable parser and ner during lemmatization to run 10x faster
        with nlp.select_pipes(disable=["parser", "ner"]):
            doc = nlp(sample_text)

        cleaned_tokens = []
        for token in doc:
            if not token.is_stop and not token.is_punct and not token.is_space:
                # Convert token to lowercase lemmatized form
                cleaned_tokens.append(token.lemma_.lower())

        return " ".join(cleaned_tokens)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during NLP text preprocessing: {str(e)}"
        )
