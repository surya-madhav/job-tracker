from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    DEFAULT_MODEL: str = "gpt-4o-mini"
    DEFAULT_TEMPERATURE: float = 0.1

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()