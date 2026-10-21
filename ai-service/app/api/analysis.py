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
from ..core.config import settings
from ..services.article_extractor_service import extract_article
from ..services.preprocessing_service import preprocess_text
from ..services.summarization_service import summarize_article
from ..services.sentiment_service import analyze_sentiment
from ..services.keyword_service import extract_keywords
from ..services.ner_service import extract_entities
from ..services.llm_analysis_service import analyze_with_llm

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
    HTTP POST endpoint to run the NLP pipeline over a news text.
    Uses ultra-fast LLM (Gemini) when enabled (default) or falls back to local models.
    """
    try:
        # 1. Core NLP Preprocessing (spaCy lightweight lemmatization)
        processed_text = preprocess_text(request.article_text)

        # 2. Local spaCy Named Entity Recognition (lightweight ~15MB RAM)
        entities_data = extract_entities(request.article_text)

        summaries = None
        sentiment_data = None
        keywords_data = None

        # Prefer LLM analysis if enabled (avoids loading 2GB PyTorch models into 512MB RAM)
        if getattr(settings, "USE_LLM_ANALYSIS", True) and settings.LLM_API_KEY:
            try:
                llm_result = analyze_with_llm(request.article_text)
                summaries = llm_result["summary"]
                sentiment_data = llm_result["sentiment"]
                keywords_data = llm_result["keywords"]
            except Exception as llm_err:
                print(f"[AI Service] LLM analysis failed, falling back to local models: {llm_err}")

        # Fallback to local Hugging Face / KeyBERT models if LLM was skipped or failed
        if not summaries:
            summaries = summarize_article(request.article_text)
        if not sentiment_data:
            sentiment_data = analyze_sentiment(request.article_text)
        if not keywords_data:
            keywords_data = extract_keywords(request.article_text)

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
