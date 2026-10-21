import trafilatura
from fastapi import HTTPException

def extract_article(url: str) -> dict:
    """
    Downloads and extracts raw main-text and title from a web URL using trafilatura
    """
    if not (url.startswith("http://") or url.startswith("https://")):
        raise HTTPException(status_code=400, detail="Invalid URL. Only http and https protocols are supported.")

    try:
        # Download webpage content
        downloaded = trafilatura.fetch_url(url)
        if not downloaded:
            raise HTTPException(status_code=400, detail="Unable to retrieve or fetch content from the provided URL.")

        # Extract core text body
        extracted_text = trafilatura.extract(
            downloaded,
            include_comments=False,
            include_tables=False,
            no_fallback=False
        )

        if not extracted_text or len(extracted_text.strip()) < 100:
            raise HTTPException(
                status_code=422,
                detail="Extracted article content contains insufficient text (minimum 100 characters required)."
            )

        # Attempt metadata parsing to find article title
        metadata = trafilatura.extract_metadata(downloaded)
        title = "Untitled Article"
        if metadata and metadata.title:
            title = metadata.title.strip()

        return {
            "title": title,
            "article_text": extracted_text.strip()
        }
    except HTTPException:
        # Re-raise HTTP exceptions directly
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred during URL extraction: {str(e)}"
        )
