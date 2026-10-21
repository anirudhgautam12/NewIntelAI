from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from .api import analysis, qa

# Initialize FastAPI application
app = FastAPI(title="AI News Intelligence - NLP Service")

# Exception handler for FastAPI HTTPExceptions to return structured JSON
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

# Exception handler for Pydantic schema validation failures
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        location = " -> ".join([str(loc) for loc in err["loc"]])
        errors.append(f"[{location}]: {err['msg']}")
    
    return JSONResponse(
        status_code=422,
        content={"detail": f"Request validation failed: {', '.join(errors)}"}
    )

# Catch-all exception handler to block internal Python traceback leaks
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"An internal server error occurred: {str(exc)}"}
    )

# Service health check
@app.get("/health")
def health_endpoint():
    return {"status": "AI service is running"}

# Include routers under the /api contract prefix
app.include_router(analysis.router, prefix="/api")
app.include_router(qa.router, prefix="/api")
