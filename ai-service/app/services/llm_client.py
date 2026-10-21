import httpx
from fastapi import HTTPException
from ..core.config import settings

def call_gemini(prompt: str) -> str:
    """
    Sends request to Gemini API generateContent endpoint using HTTPX
    """
    api_key = settings.LLM_API_KEY
    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="Gemini API Key is missing. Please configure LLM_API_KEY in your environment variables."
        )

    # Use configured model or fall back to gemini-1.5-flash
    model = settings.LLM_MODEL if settings.LLM_MODEL else "gemini-1.5-flash"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

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

    try:
        # Long timeout since LLM calls can sometimes block
        response = httpx.post(url, json=payload, timeout=60.0)
        response.raise_for_status()
        data = response.json()

        # Extract textual content from response
        candidates = data.get("candidates", [])
        if not candidates:
            raise HTTPException(
                status_code=502,
                detail="Gemini API returned an empty candidate list (safety blockers might have triggered)."
            )

        text_content = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        if not text_content:
            raise HTTPException(
                status_code=502,
                detail="Gemini API response structure parsed, but no text output was found."
            )

        return text_content.strip()
    except httpx.HTTPStatusError as e:
        error_info = e.response.text
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Gemini API returned error status {e.response.status_code}: {error_info}"
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred contacting Gemini API: {str(e)}"
        ) from e

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
