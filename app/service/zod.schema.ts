// src/schemas/index.ts
import { z } from 'zod';
import { JobStatus } from '@prisma/client';

// Base schemas for common fields
const baseEntitySchema = z.object({
  id: z.string().uuid().optional(), // optional for creation
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// User schemas
export const UserSchema = baseEntitySchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const UserUpdateSchema = UserSchema.partial().omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// Company schemas
export const CompanySchema = baseEntitySchema.extend({
  name: z.string().min(1, 'Company name is required'),
  website: z.string().url().optional().nullable(),
  industry: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const CompanyUpdateSchema = CompanySchema.partial().omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// Job schemas
export const JobSchema = baseEntitySchema.extend({
  title: z.string().min(1, 'Job title is required'),
  userId: z.string().uuid(),
  companyId: z.string().uuid().optional().nullable(),
  url: z.string().url().optional().nullable(),
  status: z.nativeEnum(JobStatus).default('SAVED'),
  applicationDate: z.date().optional().nullable(),
  resumeId: z.string().uuid().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const JobUpdateSchema = JobSchema.partial().omit({ 
  id: true, 
  userId: true,
  createdAt: true, 
  updatedAt: true 
});

// Contact schemas
export const ContactSchema = baseEntitySchema.extend({
  userId: z.string().uuid(),
  companyId: z.string().uuid().optional().nullable(),
  name: z.string().min(1, 'Contact name is required'),
  position: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  linkedinUrl: z.string().url().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const ContactUpdateSchema = ContactSchema.partial().omit({ 
  id: true, 
  userId: true,
  createdAt: true, 
  updatedAt: true 
});

// Resume schemas
export const ResumeSchema = baseEntitySchema.extend({
  userId: z.string().uuid(),
  name: z.string().min(1, 'Resume name is required'),
  tags: z.string().optional().nullable(),
  fileUrl: z.string().url().optional().nullable(),
  jsonData: z.any().optional().nullable(),
});

export const ResumeUpdateSchema = ResumeSchema.partial().omit({ 
  id: true, 
  userId: true,
  createdAt: true, 
  updatedAt: true 
});

// Types
export type UserInput = z.infer<typeof UserSchema>;
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;
export type CompanyInput = z.infer<typeof CompanySchema>;
export type CompanyUpdateInput = z.infer<typeof CompanyUpdateSchema>;
export type JobInput = z.infer<typeof JobSchema>;
export type JobUpdateInput = z.infer<typeof JobUpdateSchema>;
export type ContactInput = z.infer<typeof ContactSchema>;
export type ContactUpdateInput = z.infer<typeof ContactUpdateSchema>;
export type ResumeInput = z.infer<typeof ResumeSchema>;
export type ResumeUpdateInput = z.infer<typeof ResumeUpdateSchema>;