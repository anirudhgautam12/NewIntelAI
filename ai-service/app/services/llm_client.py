import httpx
from fastapi import HTTPException
from ..core.config import settings

def call_gemini(prompt: str) -> str:
    """
    Sends request to Gemini API generateContent endpoint using HTTPX
    """
    api_key = settings.LLM_API_KEY.strip()
    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="Gemini API Key is missing. Please configure LLM_API_KEY in your environment variables."
        )

    # Primary model with automatic fallbacks
    configured_model = settings.LLM_MODEL.strip() if settings.LLM_MODEL else "gemini-3.8-flash"
    models_to_try = [configured_model]
    for fallback in ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-flash-latest"]:
        if fallback not in models_to_try:
            models_to_try.append(fallback)

    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.1
        },
        "safetySettings": [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_NONE"
            }
        ]
    }

    last_error = None
    for model_name in models_to_try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        try:
            response = httpx.post(url, json=payload, timeout=45.0)
            if response.status_code == 200:
                data = response.json()
                candidates = data.get("candidates", [])
                if candidates:
                    text_content = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    if text_content:
                        return text_content.strip()
            
            print(f"[AI Service] Model {model_name} returned status {response.status_code}: {response.text[:200]}")
            last_error = f"Model {model_name} returned {response.status_code}: {response.text[:200]}"
        except Exception as e:
            print(f"[AI Service] Error contacting {model_name}: {e}")
            last_error = str(e)

    raise HTTPException(
        status_code=502,
        detail=f"All Gemini models failed. Last error: {last_error}"
    )

def call_openai(prompt: str) -> str:
    """
    Sends request to OpenAI Chat Completions API using HTTPX
    """
    api_key = settings.LLM_API_KEY
    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="OpenAI API Key is missing. Please configure LLM_API_KEY in your environment variables."
        )

    # Use configured model or fall back to gpt-3.5-turbo
    model = settings.LLM_MODEL if settings.LLM_MODEL else "gpt-3.5-turbo"
    url = "https://api.openai.com/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": model,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1
    }

    try:
        response = httpx.post(url, json=payload, headers=headers, timeout=60.0)
        response.raise_for_status()
        data = response.json()

        choices = data.get("choices", [])
        if not choices:
            raise HTTPException(
                status_code=502,
                detail="OpenAI API returned an empty choices array."
            )

        text_content = choices[0].get("message", {}).get("content", "")
        return text_content.strip()
    except httpx.HTTPStatusError as e:
        error_info = e.response.text
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"OpenAI API returned error status {e.response.status_code}: {error_info}"
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred contacting OpenAI API: {str(e)}"
        ) from e

def get_llm_answer(prompt: str) -> str:
    """
    Decides and routes the prompt call to the configured LLM provider.
    """
    provider = settings.LLM_PROVIDER.lower().strip()

    if provider == "gemini":
        return call_gemini(prompt)
    elif provider == "openai":
        return call_openai(prompt)
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported LLM provider: '{provider}'. Please verify LLM_PROVIDER is set to 'gemini' or 'openai'."
        )
