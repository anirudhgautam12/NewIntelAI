import json
import re
from .llm_client import get_llm_answer

def analyze_with_llm(article_text: str) -> dict:
    """
    Uses the configured LLM (e.g. Gemini 1.5 Flash) to generate:
    - Multi-granularity summaries (short, medium, detailed)
    - 3-class sentiment with positive, neutral, negative confidence scores
    - Top keyphrases with relevance scores

    Runs in ~2-3 seconds using < 50MB RAM, allowing free-tier cloud deployment.
    """
    prompt = f"""You are an advanced NLP and news analysis engine.
Analyze the following news article and return ONLY a valid JSON object matching this exact schema:

{{
  "summary": {{
    "short": "1-2 sentence concise punchy summary (approx 30-50 words)",
    "medium": "Comprehensive paragraph capturing the core story and context (approx 80-130 words)",
    "detailed": "Thorough multi-paragraph breakdown covering all major facts, background, and impacts (approx 180-250 words)"
  }},
  "sentiment": {{
    "label": "POSITIVE" | "NEGATIVE" | "NEUTRAL",
    "confidence": 0.0 to 1.0,
    "scores": {{
      "positive": 0.0 to 1.0,
      "neutral": 0.0 to 1.0,
      "negative": 0.0 to 1.0
    }}
  }},
  "keywords": [
    {{"keyword": "example keyphrase 1", "relevance": 0.95}},
    {{"keyword": "example keyphrase 2", "relevance": 0.88}}
  ]
}}

Requirements:
1. Ensure the 3 sentiment scores sum approximately to 1.0.
2. The "label" MUST be strictly one of: "POSITIVE", "NEGATIVE", or "NEUTRAL".
3. Extract between 6 and 10 highly relevant multi-word keyphrases, sorted by descending relevance.
4. Respond ONLY with the JSON object. Do NOT wrap in markdown formatting (like ```json), do NOT add introductory or concluding text.

Article Text:
{article_text[:50000]}
"""
    raw_response = get_llm_answer(prompt)
    
    # Extract JSON block even if model wraps in codeblocks or prefixes text
    json_match = re.search(r'\{.*\}', raw_response, re.DOTALL)
    if json_match:
        json_str = json_match.group(0)
    else:
        json_str = raw_response.strip()

    try:
        parsed = json.loads(json_str)
    except Exception as parse_err:
        print(f"[AI Service] JSON parse error: {parse_err}. Raw text: {raw_response[:200]}")
        raise ValueError(f"Failed to parse LLM JSON: {parse_err}")
    
    # Validate and normalize keys
    summaries = parsed.get("summary", {})
    short_sum = summaries.get("short", "")
    medium_sum = summaries.get("medium", "")
    detailed_sum = summaries.get("detailed", "")

    sentiment = parsed.get("sentiment", {})
    scores = sentiment.get("scores", {})
    
    pos = float(scores.get("positive", 0.33))
    neu = float(scores.get("neutral", 0.34))
    neg = float(scores.get("negative", 0.33))
    
    label = sentiment.get("label", "NEUTRAL").upper()
    if label not in ["POSITIVE", "NEGATIVE", "NEUTRAL"]:
        label = "NEUTRAL"
        
    confidence = float(sentiment.get("confidence", max(pos, neu, neg)))

    raw_keywords = parsed.get("keywords", [])
    keywords = []
    for item in raw_keywords:
        if isinstance(item, dict) and "keyword" in item:
            keywords.append({
                "keyword": str(item["keyword"]).strip(),
                "relevance": round(float(item.get("relevance", 0.5)), 4)
            })

    return {
        "summary": {
            "short": short_sum or medium_sum[:100],
            "medium": medium_sum or short_sum,
            "detailed": detailed_sum or medium_sum
        },
        "sentiment": {
            "label": label,
            "confidence": round(confidence, 4),
            "scores": {
                "positive": round(pos, 4),
                "neutral": round(neu, 4),
                "negative": round(neg, 4)
            }
        },
        "keywords": keywords
    }
