from fastapi import APIRouter, HTTPException
from ..models.schemas import QuestionRequest, QuestionResponse, SourceResponse
from ..services.rag_service import query_article_rag

router = APIRouter()

@router.post("/ask", response_model=QuestionResponse)
def ask_question_endpoint(request: QuestionRequest):
    """
    HTTP POST endpoint to run local FAISS vector search and query LLM provider
    to return a context-grounded answer based on the article chunks.
    """
    try:
        # Route query to local RAG service
        rag_output = query_article_rag(
            article_id=request.article_id,
            text=request.article_text,
            question=request.question
        )

        # Structure references to matching source chunks
        sources_list = [
            SourceResponse(chunkId=src["chunkId"], text=src["text"])
            for src in rag_output["sources"]
        ]

        return QuestionResponse(
            answer=rag_output["answer"],
            sources=sources_list
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred executing the RAG QA engine: {str(e)}"
        )
