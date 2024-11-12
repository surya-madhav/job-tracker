// src/services/job.service.ts
import { prisma } from '@/lib/prisma'
import {
  CreateJobDTO,
  UpdateJobDTO,
  JobQuery,
  JobWithRelations,
  MagicScrapeJobDTO,
  ScrapedJobData
} from '@/types/jobs.type'
import { CompanyService } from './company.service';
import { JobStatus } from '@prisma/client';
import { json } from 'stream/consumers';
export class JobService {
  private companyService: CompanyService;
  constructor() {
    this.companyService = new CompanyService();
  }

  private getJobIncludes() {
    return {
      company: {
        select: {
          id: true,
          name: true,
          website: true,
        },
      },
      resume: {
        select: {
          id: true,
          name: true,
          fileUrl: true,
        },
      },
    }
  }

  // Traditional job creation
  async create(userId: string, data: CreateJobDTO): Promise<JobWithRelations> {
    return prisma.job.create({
      data: {
        ...data,
        userId,
      },
      include: this.getJobIncludes(),
    })
  }

  // Magic scrape job creation
  async createFromScrape(
    userId: string,
    scrapedData: ScrapedJobData,
    additionalData: MagicScrapeJobDTO
  ): Promise<JobWithRelations> {
    // First, find or create company using CompanyService
    const company = await this.companyService.findOrCreate({
      name: scrapedData.company,
      location: [
        scrapedData.location.city,
        scrapedData.location.state,
        scrapedData.location.country
      ].filter(Boolean).join(', '),
    });

    // Parse dates
    const startDate = scrapedData.employment.start_date
      ? new Date(scrapedData.employment.start_date)
      : null;
    const endDate = scrapedData.employment.end_date
      ? new Date(scrapedData.employment.end_date)
      : null;
    const postedDate = scrapedData.important_info.posted_date
      ? new Date(scrapedData.important_info.posted_date)
      : null;
    const jsonScraped = JSON.stringify(scrapedData);
    // Create job with scraped data
    return prisma.job.create({
      data: {
        userId,
        title: scrapedData.title,
        companyId: company.id, // Use the company id from findOrCreate
        url: additionalData.url,
        resumeId: additionalData.resumeId,
        notes: additionalData.notes,
        status: 'SAVED',

        // New fields from scraper
        jobType: scrapedData.employment.type,
        term: scrapedData.employment.term,
        startDate,
        endDate,
        duration: scrapedData.employment.duration,
        city: scrapedData.location.city,
        state: scrapedData.location.state,
        country: scrapedData.location.country,
        remoteStatus: scrapedData.location.remote_status,
        visaSponsorship: scrapedData.important_info.visa_sponsorship,
        technicalTags: scrapedData.technical_keywords,
        roleTags: scrapedData.role_tags,

        // Salary information
        salaryMin: scrapedData.important_info.salary_range.min,
        salaryMax: scrapedData.important_info.salary_range.max,
        salaryCurrency: scrapedData.important_info.salary_range.currency,

        // Dates
        postedDate,
        applicationDeadline: scrapedData.important_info.application_deadline
          ? new Date(scrapedData.important_info.application_deadline)
          : null,

        // Store complete markdown and scraper response
        markdownContent: scrapedData.markdown_description,
        scraperData: jsonScraped,        

        // Metadata
        confidenceScore: scrapedData.metadata.confidence_score,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            website: true,
          },
        },
        resume: {
          select: {
            id: true,
            name: true,
            fileUrl: true,
          },
        },
      },
    });
  }

  async findById(id: string, userId: string): Promise<JobWithRelations | null> {
    return prisma.job.findFirst({
      where: {
        id,
        userId,
      },
      include: this.getJobIncludes(),
    })
  }

  async findMany(userId: string, query: JobQuery = {}): Promise<JobWithRelations[]> {
    const {
      status,
      companyId,
      title,
      jobType,
      term,
      technicalTags,
      location,
      salaryMin,
      salaryMax,
      remoteStatus,
      visaSponsorship,
    } = query;

    return prisma.job.findMany({
      where: {
        userId,
        ...(status && { status }),
        ...(companyId && { companyId }),
        ...(title && {
          title: {
            contains: title,
            mode: 'insensitive',
          },
        }),
        ...(jobType && { jobType }),
        ...(term && { term }),
        ...(technicalTags && technicalTags.length > 0 && {
          technicalTags: {
            hasAny: technicalTags,
          },
        }),
        ...(location && {
          OR: [
            { city: { contains: location, mode: 'insensitive' } },
            { state: { contains: location, mode: 'insensitive' } },
            { country: { contains: location, mode: 'insensitive' } },
          ],
        }),
        ...(salaryMin && {
          salaryMin: {
            gte: salaryMin,
          },
        }),
        ...(salaryMax && {
          salaryMax: {
            lte: salaryMax,
          },
        }),
        ...(remoteStatus && { remoteStatus }),
        ...(visaSponsorship !== undefined && { visaSponsorship }),
      },
      include: this.getJobIncludes(),
      orderBy: {
        updatedAt: 'desc',
      },
    })
  }

  async update(id: string, userId: string, data: UpdateJobDTO): Promise<JobWithRelations> {
    return prisma.job.update({
      where: {
        id,
        userId,
      },
      data,
      include: this.getJobIncludes(),
    })
  }

  async delete(id: string, userId: string): Promise<JobWithRelations> {
    return prisma.job.delete({
      where: {
        id,
        userId,
      },
      include: this.getJobIncludes(),
    })
  }

  // Advanced search methods
  async findByTechnicalSkills(userId: string, skills: string[]): Promise<JobWithRelations[]> {
    return prisma.job.findMany({
      where: {
        userId,
        technicalTags: {
          hasAny: skills,
        },
      },
      include: this.getJobIncludes(),
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findByRoleTags(userId: string, tags: string[]): Promise<JobWithRelations[]> {
    return prisma.job.findMany({
      where: {
        userId,
        roleTags: {
          hasAny: tags,
        },
      },
      include: this.getJobIncludes(),
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findInternships(
    userId: string,
    term?: string
  ): Promise<JobWithRelations[]> {
    return prisma.job.findMany({
      where: {
        userId,
        jobType: 'internship',
        ...(term && { term }),
      },
      include: this.getJobIncludes(),
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findWithSalaryRange(
    userId: string,
    min?: number,
    max?: number
  ): Promise<JobWithRelations[]> {
    return prisma.job.findMany({
      where: {
        userId,
        ...(min && { salaryMin: { gte: min } }),
        ...(max && { salaryMax: { lte: max } }),
      },
      include: this.getJobIncludes(),
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }
}