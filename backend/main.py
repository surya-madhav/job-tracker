from fastapi import FastAPI, HTTPException, Depends, Request
from typing import Dict, Any
import logging
from datetime import datetime
import traceback
import time
from fastapi.middleware.cors import CORSMiddleware

from backend.config import get_settings, Settings
from backend.models.schema import URLInput, JobDescription
from backend.services.scraper import WebScraper, ScraperException, NetworkError, TimeoutError, ParsingError
from backend.services.llm_service import LLMService, LLMException, LLMConnectionError, LLMResponseError

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Smart Job Description Scraper",
    description="API for scraping and analyzing job descriptions using LangChain and OpenAI",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log request details and timing"""
    start_time = time.time()
    
    # Generate request ID
    request_id = str(int(time.time() * 1000))
    logger.info(f"Request {request_id} started - {request.method} {request.url}")
    
    try:
        response = await call_next(request)
        
        process_time = time.time() - start_time
        logger.info(
            f"Request {request_id} completed - Status: {response.status_code} - "
            f"Time: {process_time:.2f}s"
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Request {request_id} failed: {str(e)}")
        raise

# Dependencies
async def get_llm_service(settings: Settings = Depends(get_settings)) -> LLMService:
    """Initialize LLM service with error handling"""
    try:
        return LLMService(settings)
    except Exception as e:
        logger.error(f"Failed to initialize LLM service: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to initialize LLM service")

async def get_scraper() -> WebScraper:
    """Initialize scraper with error handling"""
    try:
        return WebScraper(verify_ssl=True)
    except Exception as e:
        logger.error(f"Failed to initialize scraper: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to initialize scraper")

@app.post("/scrape/", response_model=JobDescription)
async def scrape_job_description(
    input_data: URLInput,
    llm_service: LLMService = Depends(get_llm_service),
    scraper: WebScraper = Depends(get_scraper),
):
    """
    Scrape and analyze a job description from the provided URL.
    
    Args:
        input_data: URLInput containing the job posting URL
        llm_service: Injected LLMService instance
        scraper: Injected WebScraper instance
        
    Returns:
        JobDescription: Structured job description data
        
    Raises:
        HTTPException: With appropriate status codes for different error types
    """
    request_id = str(int(time.time() * 1000))
    start_time = time.time()
    logger.info(f"Processing request {request_id} for URL: {input_data.url}")
    
    try:
        # Step 1: Validate URL
        url = str(input_data.url)
        if not url:
            raise ValueError("Empty URL provided")
        
        # Step 2: Scrape content
        logger.info(f"[{request_id}] Starting content scraping")
        try:
            markdown_content = await scraper.scrape(url)
            if not markdown_content:
                raise ValueError("No content retrieved from URL")
            
            logger.info(f"[{request_id}] Content scraped successfully")
            logger.debug(f"[{request_id}] Content length: {len(markdown_content)} characters")
            
        except TimeoutError as e:
            logger.error(f"[{request_id}] Scraping timeout: {str(e)}")
            raise HTTPException(status_code=504, detail="Request timeout while scraping")
        except NetworkError as e:
            logger.error(f"[{request_id}] Network error: {str(e)}")
            raise HTTPException(status_code=502, detail=str(e))
        except ParsingError as e:
            logger.error(f"[{request_id}] Parsing error: {str(e)}")
            raise HTTPException(status_code=422, detail=str(e))
        except ScraperException as e:
            logger.error(f"[{request_id}] Scraping error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
        
        # Step 3: Process with LLM
        logger.info(f"[{request_id}] Starting LLM processing")
        try:
            result = await llm_service.process_job_description(
                content=markdown_content,
                url=url
            )
            logger.info(f"[{request_id}] LLM processing completed successfully")
            
        except LLMConnectionError as e:
            logger.error(f"[{request_id}] LLM connection error: {str(e)}")
            raise HTTPException(status_code=503, detail="LLM service unavailable")
        except LLMResponseError as e:
            logger.error(f"[{request_id}] LLM response error: {str(e)}")
            raise HTTPException(status_code=422, detail=str(e))
        except LLMException as e:
            logger.error(f"[{request_id}] LLM processing error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
        
        # # Step 4: Store original markdown
        # result.markdown_description = markdown_content
        
        # Log completion metrics
        process_time = time.time() - start_time
        logger.info(
            f"[{request_id}] Request completed successfully in {process_time:.2f} seconds"
        )
        
        return result
        
    except ValueError as e:
        logger.error(f"[{request_id}] Validation error: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[{request_id}] Unexpected error: {str(e)}")
        logger.error(f"[{request_id}] Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while processing the request"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint with enhanced monitoring"""
    try:
        # Basic health metrics
        health_data = {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "version": "1.0.0",
        }
        
        # Add service checks if needed
        try:
            scraper = await get_scraper()
            health_data["scraper_status"] = "available"
        except Exception as e:
            health_data["scraper_status"] = f"unavailable: {str(e)}"
            
        # Check LLM service
        try:
            settings = get_settings()
            llm_service = await get_llm_service(settings)
            health_data["llm_status"] = "available"
        except Exception as e:
            health_data["llm_status"] = f"unavailable: {str(e)}"
            
        return health_data
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Health check failed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)