from .preprocessing_service import get_spacy_model
from fastapi import HTTPException

def extract_entities(text: str) -> list:
    """
    Extracts named entities from the text using the shared spaCy model.
    Filters entities to contain only PERSON, ORG, GPE, LOC, DATE, MONEY, EVENT, and PRODUCT.
    Cleans whitespaces and removes duplicates.
    """
    if not text or not text.strip():
        return []

    try:
        nlp = get_spacy_model()
        # Cap to 40,000 chars for NER to ensure fast extraction on free tier CPU
        text_sample = text[:40000]
        with nlp.select_pipes(disable=["parser"]):
            doc = nlp(text_sample)

        # Approved labels according to the requirements
        allowed_labels = {"PERSON", "ORG", "GPE", "LOC", "DATE", "MONEY", "EVENT", "PRODUCT"}
        
        seen = set()
        entities = []

        for ent in doc.ents:
            text_val = ent.text.strip()
            label_val = ent.label_

            # Ensure we filter empty text and only capture selected labels
            if text_val and label_val in allowed_labels:
                unique_key = (text_val.lower(), label_val)
                if unique_key not in seen:
                    seen.add(unique_key)
                    entities.append({
                        "text": text_val,
                        "label": label_val
                    })

        return entities
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error extracting named entities using spaCy: {str(e)}"
        )
