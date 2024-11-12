import os
import time
import json
import logging
import tempfile
from pathlib import Path
from typing import Optional, Dict, Any, Tuple
from datetime import datetime
from contextlib import contextmanager

import fitz  # PyMuPDF
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError, Browser, Page
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class LinkedInScraperException(Exception):
    """Base exception for LinkedIn scraper errors"""
    pass

class AuthenticationError(LinkedInScraperException):
    """Raised when authentication fails"""
    pass

class ScrapingError(LinkedInScraperException):
    """Raised when scraping operations fail"""
    pass

class ParsingError(LinkedInScraperException):
    """Raised when PDF parsing fails"""
    pass

class LinkedInProfileScraper:
    """Service for scraping LinkedIn profiles and converting them to structured data"""
    
    def __init__(self, 
                 temp_dir: Optional[str] = None,
                 headless: bool = True,
                 auth_file: str = "linkedin_auth.json",
                 load_env: bool = True):
        """
        Initialize the LinkedIn Profile Scraper
        
        Args:
            temp_dir: Directory for temporary files (default: system temp dir)
            headless: Whether to run browser in headless mode
            auth_file: Path to authentication state file
            load_env: Whether to load environment variables
        """
        self.headless = headless
        self.auth_file = auth_file
        self.temp_dir = temp_dir or tempfile.gettempdir()
        
        if load_env:
            load_dotenv()
            
        self.linkedin_email = os.getenv('LINKEDIN_EMAIL')
        self.linkedin_password = os.getenv('LINKEDIN_PASSWORD')
        
        if not (self.linkedin_email and self.linkedin_password):
            logger.warning("LinkedIn credentials not found in environment variables")
            
        # Ensure temp directory exists
        os.makedirs(self.temp_dir, exist_ok=True)
        logger.info(f"Initialized scraper with temp directory: {self.temp_dir}")

    @contextmanager
    def _get_browser(self) -> Browser:
        """Context manager for handling browser lifecycle"""
        playwright = None
        browser = None
        try:
            playwright = sync_playwright().start()
            browser = playwright.chromium.launch(headless=self.headless)
            yield browser
        finally:
            if browser:
                try:
                    browser.close()
                except Exception as e:
                    logger.warning(f"Error closing browser: {str(e)}")
            if playwright:
                try:
                    playwright.stop()
                except Exception as e:
                    logger.warning(f"Error stopping playwright: {str(e)}")

    def authenticate(self) -> bool:
        """
        Perform LinkedIn authentication and save state
        
        Returns:
            bool: True if authentication successful, False otherwise
        """
        logger.info("Starting LinkedIn authentication")
        
        try:
            with self._get_browser() as browser:
                context = browser.new_context()
                page = context.new_page()
                
                # Navigate to LinkedIn login
                page.goto('https://www.linkedin.com/login')
                
                # Fill login form
                page.fill('#username', self.linkedin_email)
                page.fill('#password', self.linkedin_password)
                
                # Submit form and wait for navigation
                page.click('button[type="submit"]')
                page.wait_for_load_state(state='networkidle')
                
                # Verify login success
                if page.url.startswith('https://www.linkedin.com/feed/'):
                    logger.info("Authentication successful")
                    context.storage_state(path=self.auth_file)
                    return True
                else:
                    logger.error("Authentication failed - unexpected redirect URL")
                    return False
                    
        except Exception as e:
            logger.error(f"Authentication failed: {str(e)}")
            raise AuthenticationError(f"Failed to authenticate with LinkedIn: {str(e)}")

    def download_profile(self, profile_url: str) -> Optional[str]:
        """
        Download LinkedIn profile as PDF
        
        Args:
            profile_url: LinkedIn profile URL
            
        Returns:
            str: Path to downloaded PDF file
        """
        logger.info(f"Starting profile download for URL: {profile_url}")
        
        if not Path(self.auth_file).exists():
            logger.info("No authentication file found - authenticating first")
            if not self.authenticate():
                raise AuthenticationError("Failed to authenticate with LinkedIn")

        pdf_path = None
        try:
            with self._get_browser() as browser:
                context = browser.new_context(
                    storage_state=self.auth_file,
                    accept_downloads=True
                )
                
                page = context.new_page()
                page.goto(profile_url)
                
                # Wait for and click "More actions" button
                more_button = page.get_by_role("button", name="More actions")
                more_button.wait_for(state="visible", timeout=30000)
                more_button.click()
                
                # Wait for and click "Save to PDF" button
                save_pdf_button = page.get_by_role("button", name="Save to PDF")
                save_pdf_button.wait_for(state="visible", timeout=30000)
                
                # Handle download
                with page.expect_download(timeout=60000) as download_info:
                    save_pdf_button.click()
                    download = download_info.value
                    
                    # Generate temp file path
                    timestamp = int(time.time())
                    pdf_path = os.path.join(self.temp_dir, f"linkedin_profile_{timestamp}.pdf")
                    
                    logger.info(f"Saving profile PDF to: {pdf_path}")
                    download.save_as(pdf_path)
                    
                    return pdf_path
                    
        except PlaywrightTimeoutError as e:
            logger.error(f"Timeout while downloading profile: {str(e)}")
            raise ScrapingError(f"Profile download timed out: {str(e)}")
        except Exception as e:
            logger.error(f"Failed to download profile: {str(e)}")
            if pdf_path and os.path.exists(pdf_path):
                try:
                    os.remove(pdf_path)
                except Exception:
                    pass
            raise ScrapingError(f"Profile download failed: {str(e)}")

    def parse_pdf(self, pdf_path: str) -> Dict[str, Any]:
        """
        Parse LinkedIn profile PDF into structured data
        
        Args:
            pdf_path: Path to profile PDF file
            
        Returns:
            dict: Structured profile data
        """
        logger.info(f"Starting PDF parsing for file: {pdf_path}")
        
        doc = None
        try:
            # Open PDF with PyMuPDF
            doc = fitz.open(pdf_path)
            
            # Extract text from all pages
            text = ""
            for page in doc:
                text += page.get_text()
            
            # Create text splitter for chunking
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                length_function=len,
            )
            
            # Split text into chunks
            chunks = text_splitter.split_text(text)
            
            # Create Langchain documents
            documents = [
                Document(
                    page_content=chunk,
                    metadata={
                        "source": pdf_path,
                        "timestamp": datetime.now().isoformat()
                    }
                )
                for chunk in chunks
            ]
            
            return {
                "text": text,
                "chunks": chunks,
                "documents": documents
            }
            
        except Exception as e:
            logger.error(f"Failed to parse PDF: {str(e)}")
            raise ParsingError(f"PDF parsing failed: {str(e)}")
        finally:
            if doc:
                try:
                    doc.close()
                except Exception as e:
                    logger.warning(f"Error closing PDF document: {str(e)}")
            
    def cleanup(self, pdf_path: str):
        """
        Clean up temporary PDF file
        
        Args:
            pdf_path: Path to PDF file to remove
        """
        try:
            if pdf_path and os.path.exists(pdf_path):
                os.remove(pdf_path)
                logger.info(f"Removed temporary file: {pdf_path}")
        except Exception as e:
            logger.warning(f"Failed to remove temporary file {pdf_path}: {str(e)}")

    def          scrape_profile(self, profile_url: str, cleanup_temp: bool = True) -> Dict[str, Any]:
        """
        Main method to scrape and parse LinkedIn profile
        
        Args:
            profile_url: LinkedIn profile URL
            cleanup_temp: Whether to remove temporary PDF file after parsing
            
        Returns:
            dict: Structured profile data
        """
        logger.info(f"Starting full profile scrape for URL: {profile_url}")
        
        pdf_path = None
        try:
            # Download profile as PDF
            pdf_path = self.download_profile(profile_url)
            if not pdf_path:
                raise ScrapingError("Failed to download profile PDF")
                
            # Parse PDF content
            profile_data = self.parse_pdf(pdf_path)
            
            # Add metadata
            profile_data["metadata"] = {
                "url": profile_url,
                "scraped_at": datetime.now().isoformat(),
                "source_file": pdf_path
            }
            
            return profile_data
            
        finally:
            if cleanup_temp and pdf_path:
                self.cleanup(pdf_path)

def main():
    """Example usage of LinkedInProfileScraper"""
    # Initialize scraper
    scraper = LinkedInProfileScraper(headless=True)
    
    # Example profile URL
    profile_url = "https://www.linkedin.com/in/tejassunilparikh/"
    
    try:
        # Scrape and parse profile
        profile_data = scraper.scrape_profile(profile_url)
        print(profile_data)
        # Print results
        print(f"Successfully scraped profile: {profile_url}")
        print(f"Total text length: {len(profile_data['text'])}")
        print(f"Number of chunks: {len(profile_data['chunks'])}")
        
    except LinkedInScraperException as e:
        logger.error(f"Scraping failed: {str(e)}")
        
if __name__ == "__main__":
    main()