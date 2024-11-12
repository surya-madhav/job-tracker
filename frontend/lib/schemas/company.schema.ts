import { z } from 'zod';

export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  website: z.string().url().optional().nullable(),
  industry: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type CompanyFormValues = z.infer<typeof companySchema>;