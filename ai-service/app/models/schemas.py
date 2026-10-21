from pydantic import BaseModel, Field, field_validator
from typing import List, Dict

class ArticleExtractionRequest(BaseModel):
    url: str

    @field_validator('url')
    @classmethod
    def validate_url(cls, v: str) -> str:
        if not (v.startswith('http://') or v.startswith('https://')):
            raise ValueError('URL must start with http:// or https://')
        return v

class ArticleExtractionResponse(BaseModel):
    title: str
    article_text: str

class ArticleAnalysisRequest(BaseModel):
    article_text: str = Field(..., min_length=100)
    summary_length: str = Field(default="medium")

    @field_validator('summary_length')
    @classmethod
    def validate_summary_length(cls, v: str) -> str:
        valid_lengths = ['short', 'medium', 'detailed']
        if v not in valid_lengths:
            raise ValueError(f"summary_length must be one of: {', '.join(valid_lengths)}")
        return v

class SentimentScores(BaseModel):
    positive: float
    neutral: float
    negative: float

class SentimentResponse(BaseModel):
    label: str
    confidence: float
    scores: SentimentScores

    @field_validator('label')
    @classmethod
    def validate_label(cls, v: str) -> str:
        valid_labels = ['POSITIVE', 'NEGATIVE', 'NEUTRAL']
        if v.upper() not in valid_labels:
            raise ValueError(f"label must be POSITIVE, NEGATIVE, or NEUTRAL")
        return v.upper()

class KeywordResponse(BaseModel):
    keyword: str
    relevance: float

class EntityResponse(BaseModel):
    text: str
    label: str

class ArticleAnalysisResponse(BaseModel):
    processed_text: str
    summary: Dict[str, str]
    sentiment: SentimentResponse
    keywords: List[KeywordResponse]
    entities: List[EntityResponse]
    original_word_count: int
    summary_word_count: int
    compression_ratio: float

class QuestionRequest(BaseModel):
    article_id: str
    article_text: str = Field(..., min_length=1)
    question: str = Field(..., min_length=1)

    @field_validator('article_id')
    @classmethod
    def validate_article_id(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('article_id must not be empty')
        return v

    @field_validator('question')
    @classmethod
    def validate_question(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('question must not be empty')
        return v

class SourceResponse(BaseModel):
    chunkId: str
    text: str

class QuestionResponse(BaseModel):
    answer: str
    sources: List[SourceResponse]
