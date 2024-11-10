// src/types/job.types.ts
import { Job, JobStatus } from '@prisma/client'

// Keep existing DTOs for backward compatibility
export interface CreateJobDTO {
  title: string;
  companyId?: string;
  url?: string;
  status?: JobStatus;
  applicationDate?: Date;
  resumeId?: string;
  notes?: string;
}

export interface UpdateJobDTO extends Partial<CreateJobDTO> {}

// New types for magic scrape
export interface ScrapedJobData {
  company: string;
  title: string;
  location: {
    city: string | null;
    state: string | null;
    country: string | null;
    remote_status: string | null;
  };
  employment: {
    type: string | null;
    term: string | null;
    start_date: string | null;
    end_date: string | null;
    duration: string | null;
  };
  technical_keywords: string[];
  important_info: {
    visa_sponsorship: boolean;
    salary_range: {
      min: number | null;
      max: number | null;
      currency: string | null;
    };
    posted_date: string | null;
    application_deadline: string | null;
  };
  role_tags: string[];
  markdown_description: string;
  metadata: {
    scraping_timestamp: string;
    confidence_score: number;
  };
}

export interface MagicScrapeJobDTO {
  url: string;
  resumeId?: string;
  notes?: string;
}
export interface JobQuery {
  status?: JobStatus;
  companyId?: string;
  title?: string;
  jobType?: string;
  term?: string;
  technicalTags?: string[];
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  remoteStatus?: string;
  visaSponsorship?: boolean;
}

export interface JobWithRelations extends Job {
  company?: {
    id: string;
    name: string;
    website?: string | null;
  } | null;
  resume?: {
    id: string;
    name: true;
    fileUrl?: string | null;
  } | null;
}