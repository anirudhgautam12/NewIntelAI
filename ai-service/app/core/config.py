from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    LLM_PROVIDER: str = Field(default="gemini")
    LLM_API_KEY: str = Field(default="")
    LLM_MODEL: str = Field(default="")
    VECTOR_STORE_PATH: str = Field(default="./vector_store")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
