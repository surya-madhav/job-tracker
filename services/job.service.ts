// src/services/job.service.ts
import { prisma } from '@/lib/prisma'
import { CreateJobDTO, UpdateJobDTO, JobQuery, JobWithRelations } from '@/types/jobs.type'

export class JobService {
  async create(userId: string, data: CreateJobDTO): Promise<JobWithRelations> {
    return prisma.job.create({
      data: {
        ...data,
        userId,
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
    })
  }

  async findById(id: string, userId: string): Promise<JobWithRelations | null> {
    return prisma.job.findFirst({
      where: {
        id,
        userId,
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
    })
  }

  async findMany(userId: string, query: JobQuery = {}): Promise<JobWithRelations[]> {
    const { status, companyId, title } = query
    
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
    })
  }

  async delete(id: string, userId: string): Promise<JobWithRelations> {
    return prisma.job.delete({
      where: {
        id,
        userId,
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
    })
  }
}