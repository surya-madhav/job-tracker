import { z } from 'zod';
import { JobStatus } from '@prisma/client';

export const jobFormSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  companyId: z.string().uuid().optional(),
  company: z.object({
    name: z.string().min(1, 'Company name is required'),
    website: z.string().url().optional().nullable(),
    industry: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
  }).optional(),
  url: z.string().url().optional().nullable(),
  applicationDate: z.date().optional().nullable(),
  status: z.nativeEnum(JobStatus).default(JobStatus.SAVED),
  notes: z.string().optional().nullable(),
  resumeId: z.string().uuid().optional().nullable(),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;