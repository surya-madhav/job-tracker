from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional
from datetime import datetime

class Location(BaseModel):
    city: Optional[str] = Field(None, description="City where the job is located")
    state: Optional[str] = Field(None, description="State/Province of the job location")
    country: Optional[str] = Field(None, description="Country where the job is located")
    remote_status: Optional[str] = Field(None, description="Remote work status (Remote/Hybrid/On-site)")

class Employment(BaseModel):
    type: Optional[str] = Field(None, description="Type of employment (full-time/internship/coop)")
    term: Optional[str] = Field(None, description="Term if internship/coop (e.g., 'Spring_2024')")
    start_date: Optional[str] = Field(None, description="Expected start date in YYYY-MM-DD format")
    end_date: Optional[str] = Field(None, description="Expected end date in YYYY-MM-DD format")
    duration: Optional[str] = Field(None, description="Duration of employment if specified")

class SalaryRange(BaseModel):
    min: Optional[float] = Field(None, description="Minimum salary amount")
    max: Optional[float] = Field(None, description="Maximum salary amount")
    currency: str = Field("USD", description="Salary currency")

class ImportantInfo(BaseModel):
    visa_sponsorship: Optional[bool] = Field(None, description="Whether visa sponsorship is available")
    salary_range: SalaryRange = Field(..., description="Salary range information")
    posted_date: Optional[str] = Field(None, description="Job posting date in YYYY-MM-DD format")
    application_deadline: Optional[str] = Field(None, description="Application deadline in YYYY-MM-DD format")

class Metadata(BaseModel):
    scraping_timestamp: str = Field(..., description="Timestamp when the data was scraped")
    confidence_score: float = Field(..., description="Confidence score of extracted information (0-1)")
    source_url: str = Field(..., description="Original job posting URL")

class JobDescription(BaseModel):
    company: str = Field(..., description="Company name")
    title: str = Field(..., description="Job title")
    location: Location = Field(..., description="Job location information")
    employment: Employment = Field(..., description="Employment details")
    technical_keywords: List[str] = Field(..., description="Technical skills, tools, languages mentioned")
    important_info: ImportantInfo = Field(..., description="Important job-related information")
    role_tags: List[str] = Field(..., description="Tags describing the role")
    markdown_description: str = Field(..., description="Complete job description in markdown format")
    metadata: Metadata = Field(..., description="Metadata about the scraping")

class URLInput(BaseModel):
    url: HttpUrl = Field(..., description="URL of the job posting to scrape")