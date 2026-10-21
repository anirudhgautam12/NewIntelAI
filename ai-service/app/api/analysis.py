from fastapi import APIRouter, HTTPException
from ..models.schemas import (
    ArticleExtractionRequest,
    ArticleExtractionResponse,
    ArticleAnalysisRequest,
    ArticleAnalysisResponse,
    SentimentResponse,
    SentimentScores,
    KeywordResponse,
    EntityResponse
)
from ..services.article_extractor_service import extract_article
from ..services.preprocessing_service import preprocess_text
from ..services.summarization_service import summarize_article
from ..services.sentiment_service import analyze_sentiment
from ..services.keyword_service import extract_keywords
from ..services.ner_service import extract_entities

router = APIRouter()

@router.post("/extract-article", response_model=ArticleExtractionResponse)
def extract_article_endpoint(request: ArticleExtractionRequest):
    """
    HTTP POST endpoint to extract article main-text and title from web URL.
    """
    try:
        extracted = extract_article(request.url)
        return ArticleExtractionResponse(
            title=extracted["title"],
            article_text=extracted["article_text"]
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred during URL extraction: {str(e)}"
        )

@router.post("/analyze", response_model=ArticleAnalysisResponse)
def analyze_article_endpoint(request: ArticleAnalysisRequest):
    """
    HTTP POST endpoint to run the entire local NLP pipeline over a news text.
    """
    try:
        # 1. Core NLP Preprocessing (lemmatization and stopword removal)
        processed_text = preprocess_text(request.article_text)

        # 2. Local BART Transformer Summarization
        summaries = summarize_article(request.article_text)

        # 3. Local RoBERTa 3-Class Sentiment Classification
        sentiment_data = analyze_sentiment(request.article_text)

        # 4. Local KeyBERT Keyword Extraction
        keywords_data = extract_keywords(request.article_text)

        # 5. Local spaCy Named Entity Recognition
        entities_data = extract_entities(request.article_text)

        # 6. Compute statistics based on raw input and chosen summary length
        original_words = len(request.article_text.strip().split())
        
        # Fall back to medium summary if length query is invalid
        chosen_summary = summaries.get(request.summary_length, summaries["medium"])
        summary_words = len(chosen_summary.strip().split())

        compression_ratio = 0.0
        if original_words > 0:
            compression_ratio = round(summary_words / original_words, 4)

        # Formulate sentiment object values
        scores_obj = SentimentScores(
            positive=sentiment_data["scores"]["positive"],
            neutral=sentiment_data["scores"]["neutral"],
            negative=sentiment_data["scores"]["negative"]
        )
        sentiment_obj = SentimentResponse(
            label=sentiment_data["label"],
            confidence=sentiment_data["confidence"],
            scores=scores_obj
        )

        # Map list of keywords and entity responses
        keywords_list = [KeywordResponse(keyword=k["keyword"], relevance=k["relevance"]) for k in keywords_data]
        entities_list = [EntityResponse(text=e["text"], label=e["label"]) for e in entities_data]

        return ArticleAnalysisResponse(
            processed_text=processed_text,
            summary=summaries,
            sentiment=sentiment_obj,
            keywords=keywords_list,
            entities=entities_list,
            original_word_count=original_words,
            summary_word_count=summary_words,
            compression_ratio=compression_ratio
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred executing the NLP analysis pipeline: {str(e)}"
        )
