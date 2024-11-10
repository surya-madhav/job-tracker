// src/types/job.types.ts
import { Job, JobStatus } from '@prisma/client'

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

export interface JobQuery {
  status?: JobStatus;
  companyId?: string;
  title?: string;
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