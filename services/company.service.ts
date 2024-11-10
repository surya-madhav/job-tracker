import { prisma } from '@/lib/prisma';
import { CreateCompanyDTO, UpdateCompanyDTO, CompanyQuery } from '@/types/company.types';

export class CompanyService {
  async findMany(query: CompanyQuery = {}) {
    const { search, industry } = query;

    return prisma.company.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { industry: { contains: search, mode: 'insensitive' } },
              { location: { contains: search, mode: 'insensitive' } },
            ],
          } : {},
          industry ? { industry } : {},
        ],
      },
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
        jobs: {
          select: {
            id: true,
            title: true,
            status: true,
            applicationDate: true,
          },
          orderBy: {
            applicationDate: 'desc',
          },
          take: 5, // Only get the 5 most recent jobs
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById(id: string) {
    return prisma.company.findUnique({
      where: { id },
      include: {
        jobs: {
          select: {
            id: true,
            title: true,
            status: true,
            applicationDate: true,
            url: true,
            notes: true,
          },
          orderBy: {
            applicationDate: 'desc',
          },
        },
        contacts: {
          select: {
            id: true,
            name: true,
            position: true,
            email: true,
            phone: true,
            linkedinUrl: true,
          },
        },
        _count: {
          select: {
            jobs: true,
            contacts: true,
          },
        },
      },
    });
  }

  async findOrCreate(data: CreateCompanyDTO) {
    const existingCompany = await prisma.company.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive',
        },
      },
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });

    if (existingCompany) {
      return existingCompany;
    }

    return this.create(data);
  }

  async create(data: CreateCompanyDTO) {
    return prisma.company.create({
      data,
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateCompanyDTO) {
    return prisma.company.update({
      where: { id },
      data,
      include: {
        jobs: {
          select: {
            id: true,
            title: true,
            status: true,
            applicationDate: true,
          },
          orderBy: {
            applicationDate: 'desc',
          },
        },
        _count: {
          select: {
            jobs: true,
            contacts: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.company.delete({
      where: { id },
    });
  }

  // Additional utility methods
  async getStats(id: string) {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        jobs: {
          select: {
            status: true,
            applicationDate: true,
          },
        },
      },
    });

    if (!company) return null;

    const totalJobs = company.jobs.length;
    const activeJobs = company.jobs.filter(
      job => job.status === 'APPLIED' || job.status === 'INTERVIEWING'
    ).length;
    const successfulJobs = company.jobs.filter(
      job => job.status === 'OFFERED'
    ).length;
    const successRate = totalJobs ? (successfulJobs / totalJobs) * 100 : 0;

    return {
      totalJobs,
      activeJobs,
      successfulJobs,
      successRate,
    };
  }
  
}