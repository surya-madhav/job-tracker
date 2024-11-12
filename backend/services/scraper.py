import httpx
from bs4 import BeautifulSoup
import re
from typing import Optional, Tuple, Union, Dict
import logging
from datetime import datetime
import traceback
from playwright.sync_api import Error as PlaywrightError
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
import pypandoc

# Configure logger
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

class ScraperException(Exception):
    """Base exception for scraper errors"""
    pass

class NetworkError(ScraperException):
    """Raised when network-related errors occur"""
    pass

class ParsingError(ScraperException):
    """Raised when content parsing fails"""
    pass

class TimeoutError(ScraperException):
    """Raised when requests timeout"""
    pass

class WebScraper:
    pandoc_available = None
    playwright_available = None

    def __init__(self, print_error=None, playwright_available=True, verify_ssl: bool = True):
        """Initialize the scraper with configurable error handling and SSL verification.
        
        Args:
            print_error: Custom error printing function
            playwright_available: Flag to indicate if playwright is available
            verify_ssl: Whether to verify SSL certificates
        """
        self.verify_ssl = verify_ssl
        self.playwright_available = playwright_available
        self.print_error = print_error if print_error else logger.error
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Smart Scraper/1.0)",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        }
        logger.info(f"WebScraper initialized with verify_ssl={verify_ssl}, playwright_available={playwright_available}")

    async def scrape(self, url: str) -> Union[str, None]:
        """Scrape URL content and convert to markdown if HTML.
        
        Args:
            url: The URL to scrape
            
        Returns:
            str: Markdown content or original content if not HTML
            
        Raises:
            NetworkError: For network-related failures
            TimeoutError: For request timeouts
            ParsingError: For content parsing failures
            ScraperException: For other scraping errors
        """
        logger.info(f"Starting scrape operation for URL: {url}")
        try:
            if self.playwright_available:
                logger.info("Using Playwright for scraping")
                content, mime_type = await self.scrape_with_playwright(url)
            else:
                logger.info("Using HTTPX for scraping")
                content, mime_type = await self._fetch_content(url)

            if not content:
                raise ScraperException(f"Failed to retrieve content from {url}")

            logger.info(f"Content retrieved successfully. MIME type: {mime_type}")

            # Convert to markdown if HTML
            if self._is_html(content, mime_type):
                logger.info("Converting HTML content to markdown")
                try:
                    return self._html_to_markdown(content)
                except Exception as e:
                    logger.error(f"Markdown conversion failed: {str(e)}")
                    raise ParsingError(f"Failed to convert HTML to markdown: {str(e)}")
            
            return content

        except httpx.TimeoutException as e:
            error_msg = f"Request timed out for {url}: {str(e)}"
            logger.error(error_msg)
            raise TimeoutError(error_msg)
        except httpx.HTTPError as e:
            error_msg = f"HTTP error occurred while scraping {url}: {str(e)}"
            logger.error(error_msg)
            raise NetworkError(error_msg)
        except Exception as e:
            error_msg = f"Unexpected error while scraping {url}: {str(e)}"
            logger.error(error_msg)
            logger.debug(f"Full traceback: {traceback.format_exc()}")
            raise ScraperException(error_msg)

    async def _fetch_content(self, url: str) -> Tuple[Optional[str], Optional[str]]:
        """Fetch content from URL with comprehensive error handling"""
        logger.debug(f"Initiating HTTP request to {url}")
        start_time = datetime.now()
        
        try:
            async with httpx.AsyncClient(
                verify=self.verify_ssl,
                follow_redirects=True,
                timeout=30.0
            ) as client:
                response = await client.get(str(url), headers=self.headers)
                response.raise_for_status()
                
                execution_time = (datetime.now() - start_time).total_seconds()
                logger.info(f"Content fetched in {execution_time:.2f} seconds")
                logger.debug(f"Response headers: {dict(response.headers)}")
                
                return response.text, response.headers.get("content-type", "").split(";")[0]

        except httpx.TimeoutException as e:
            logger.error(f"Timeout during fetch: {str(e)}")
            raise TimeoutError(f"Request timed out: {str(e)}")
        except httpx.HTTPError as e:
            logger.error(f"HTTP error during fetch: {str(e)}")
            raise NetworkError(f"HTTP error: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error during fetch: {str(e)}")
            raise ScraperException(f"Failed to fetch content: {str(e)}")

    async def scrape_with_playwright(self, url: str) -> Tuple[Optional[str], Optional[str]]:
        """Scrape using Playwright with detailed error handling"""
        from playwright.async_api import async_playwright
        
        logger.info("Initializing Playwright scraper")
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch()
                try:
                    context = await browser.new_context(ignore_https_errors=not self.verify_ssl)
                    page = await context.new_page()

                    # Configure page
                    await page.set_extra_http_headers(self.headers)
                    
                    try:
                        response = await page.goto(url, wait_until="networkidle", timeout=30000)
                        if response:
                            mime_type = response.headers.get("content-type", "").split(";")[0]
                        else:
                            mime_type = None
                            
                        content = await page.content()
                        return content, mime_type
                        
                    except PlaywrightTimeoutError as e:
                        logger.error(f"Playwright timeout: {str(e)}")
                        raise TimeoutError(f"Page load timeout: {str(e)}")
                    except PlaywrightError as e:
                        logger.error(f"Playwright error: {str(e)}")
                        raise ScraperException(f"Playwright error: {str(e)}")
                finally:
                    await browser.close()
                    
        except Exception as e:
            logger.error(f"Failed to scrape with Playwright: {str(e)}")
            logger.debug(f"Full traceback: {traceback.format_exc()}")
            raise ScraperException(f"Playwright scraping failed: {str(e)}")

    def _is_html(self, content: str, mime_type: Optional[str]) -> bool:
        """Check if content is HTML based on mime type and patterns"""
        logger.debug(f"Checking content type. MIME type: {mime_type}")
        
        if mime_type and "text/html" in mime_type.lower():
            return True

        html_patterns = [
            r"<!DOCTYPE\s+html",
            r"<html",
            r"<head",
            r"<body",
            r"<div",
            r"<p>",
            r"<a\s+href=",
        ]
        
        try:
            return any(re.search(pattern, content, re.IGNORECASE) for pattern in html_patterns)
        except Exception as e:
            logger.error(f"Error checking HTML patterns: {str(e)}")
            raise ParsingError(f"Failed to check HTML patterns: {str(e)}")

    def _html_to_markdown(self, html_content: str) -> str:
        """Convert HTML to markdown with error handling"""
        logger.debug("Starting HTML to markdown conversion")
        
        try:
            # Try pandoc first if available
            if self.pandoc_available:
                try:
                    logger.debug("Attempting pandoc conversion")
                    return pypandoc.convert_text(html_content, "markdown", format="html")
                except Exception as e:
                    logger.warning(f"Pandoc conversion failed, falling back to BeautifulSoup: {str(e)}")
            
            # BeautifulSoup fallback
            soup = BeautifulSoup(html_content, "html.parser")
            
            # Clean up the HTML
            for element in soup.find_all(['script', 'style', 'svg', 'iframe']):
                element.decompose()
            
            # Process elements
            for header in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
                level = int(header.name[1])
                header.string = f"\n{'#' * level} {header.get_text().strip()}\n"
            
            for p in soup.find_all('p'):
                p.string = f"\n{p.get_text().strip()}\n"
            
            for li in soup.find_all('li'):
                li.string = f"* {li.get_text().strip()}\n"
            
            # Extract and clean text
            text = soup.get_text(separator='\n', strip=True)
            text = re.sub(r'\n\s*\n', '\n\n', text)
            text = re.sub(r'\s+', ' ', text)
            
            logger.info("Markdown conversion completed successfully")
            return text.strip()
            
        except Exception as e:
            logger.error(f"Failed to convert HTML to markdown: {str(e)}")
            logger.debug(f"Full traceback: {traceback.format_exc()}")
            raise ParsingError(f"HTML to markdown conversion failed: {str(e)}")
async def main():
        scraper = WebScraper()
        url = "https://www.linkedin.com/in/tejassunilparikh/"
        markdown_content = await scraper.scrape(url)
        print(markdown_content)        
if __name__ == "__main__":
    import asyncio
    asyncio.run(main())