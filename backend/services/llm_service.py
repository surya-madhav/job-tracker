from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from datetime import datetime
from typing import Protocol, Type, TypeVar
import logging
import traceback
from openai import OpenAIError
import json

from backend.models.schema import JobDescription
from backend.utils.prompts import JOB_DESCRIPTION_SYSTEM_PROMPT, JOB_DESCRIPTION_USER_PROMPT
from backend.config import Settings

# Configure logger
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

T = TypeVar('T')

class LLMException(Exception):
    """Base exception for LLM-related errors"""
    pass

class LLMConnectionError(LLMException):
    """Raised when connection to LLM service fails"""
    pass

class LLMResponseError(LLMException):
    """Raised when LLM response is invalid or unexpected"""
    pass

class LLMProcessingError(LLMException):
    """Raised when processing the LLM response fails"""
    pass

class PromptError(LLMException):
    """Raised when there are issues with prompt construction or validation"""
    pass

class LLMProvider(Protocol):
    def with_structured_output(self, cls: Type[T]) -> any:
        ...

class LLMService:
    def __init__(self, settings: Settings):
        """Initialize LLM service with settings and configure logging
        
        Args:
            settings: Application settings including API keys and model configuration
        
        Raises:
            LLMException: If initialization fails
        """
        try:
            self.settings = settings
            logger.info(f"Initializing LLM Service with model: {settings.DEFAULT_MODEL}")
            self._llm = self._initialize_llm()
            logger.info("LLM Service initialized successfully")
        except Exception as e:
            error_msg = f"Failed to initialize LLM Service: {str(e)}"
            logger.error(error_msg)
            logger.debug(f"Full traceback: {traceback.format_exc()}")
            raise LLMException(error_msg)
        
    def _initialize_llm(self) -> LLMProvider:
        """Initialize the LLM provider with proper error handling
        
        Returns:
            LLMProvider: Configured LLM instance
            
        Raises:
            LLMConnectionError: If connection setup fails
        """
        try:
            logger.debug(f"Setting up LLM with temperature: {self.settings.DEFAULT_TEMPERATURE}")
            return ChatOpenAI(
                api_key=self.settings.OPENAI_API_KEY,
                model=self.settings.DEFAULT_MODEL,
                temperature=self.settings.DEFAULT_TEMPERATURE
            )
        except OpenAIError as e:
            error_msg = f"OpenAI initialization failed: {str(e)}"
            logger.error(error_msg)
            raise LLMConnectionError(error_msg)
        except Exception as e:
            error_msg = f"Unexpected error during LLM initialization: {str(e)}"
            logger.error(error_msg)
            raise LLMException(error_msg)
    
    async def process_job_description(self, content: str, url: str) -> JobDescription:
        """Process job description content and return structured data
        
        Args:
            content: The job description text to process
            url: Source URL of the job description
            
        Returns:
            JobDescription: Structured job description data
            
        Raises:
            PromptError: If prompt construction fails
            LLMResponseError: If LLM response is invalid
            LLMProcessingError: If processing the response fails
        """
        start_time = datetime.utcnow()
        logger.info(f"Starting job description processing for URL: {url}")
        logger.debug(f"Content length: {len(content)} characters")
        
        try:
            # Validate input
            if not content.strip():
                raise ValueError("Empty content provided")
            
            # Create prompt
            logger.debug("Constructing prompt template")
            try:
                prompt = ChatPromptTemplate.from_messages([
                    ("system", JOB_DESCRIPTION_SYSTEM_PROMPT),
                    ("user", JOB_DESCRIPTION_USER_PROMPT.format(text=content))
                ])
                logger.debug("Prompt template constructed successfully")
            except Exception as e:
                raise PromptError(f"Failed to construct prompt: {str(e)}")
            
            # Get structured output
            logger.debug("Setting up LLM chain with structured output")
            try:
                chain = prompt | self._llm.with_structured_output(JobDescription)
            except Exception as e:
                raise LLMResponseError(f"Failed to setup LLM chain: {str(e)}")
            
            # Process the content
            logger.info("Invoking LLM chain")
            try:
                result = await chain.ainvoke({})
                logger.debug("LLM processing completed successfully")
            except OpenAIError as e:
                raise LLMConnectionError(f"OpenAI API error: {str(e)}")
            except Exception as e:
                raise LLMProcessingError(f"Failed to process content: {str(e)}")
            
            # Validate result
            if not result:
                raise LLMResponseError("Empty response from LLM")
            
            # Add metadata
            try:
                result.metadata.scraping_timestamp = datetime.utcnow().isoformat()
                result.metadata.source_url = url
            except Exception as e:
                raise LLMProcessingError(f"Failed to add metadata: {str(e)}")
            
            # Log processing metrics
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            logger.info(f"Processing completed in {processing_time:.2f} seconds")
            logger.debug(f"Result structure: {json.dumps(result.dict(), indent=2)}")
            
            return result
            
        except ValueError as e:
            error_msg = f"Invalid input: {str(e)}"
            logger.error(error_msg)
            raise LLMException(error_msg)
        except (PromptError, LLMResponseError, LLMConnectionError, LLMProcessingError) as e:
            logger.error(str(e))
            logger.debug(f"Full traceback: {traceback.format_exc()}")
            raise
        except Exception as e:
            error_msg = f"Unexpected error during job description processing: {str(e)}"
            logger.error(error_msg)
            logger.debug(f"Full traceback: {traceback.format_exc()}")
            raise LLMException(error_msg)

    def _validate_llm_response(self, response: dict) -> bool:
        """Validate the LLM response structure
        
        Args:
            response: The response to validate
            
        Returns:
            bool: True if valid, False otherwise
        """
        required_fields = [
            'company', 'title', 'location', 'employment',
            'technical_keywords', 'important_info', 'role_tags'
        ]
        
        try:
            return all(field in response for field in required_fields)
        except Exception as e:
            logger.error(f"Response validation failed: {str(e)}")
            return False