'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { JobWithRelations, CreateJobDTO, UpdateJobDTO, JobQuery, MagicScrapeJobDTO } from '@/types/jobs.type';

// API functions
const fetchJobs = async (query: JobQuery & { userId?: string }) => {
  if (!query.userId) return [];
  
  const params = new URLSearchParams();
  if (query.status) params.set('status', query.status);
  if (query.title) params.set('title', query.title);
  
  const response = await fetch(`/api/jobs?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch jobs');
  
  const data = await response.json();
  return data.jobs;
};

const createJob = async (job: CreateJobDTO) => {
    console.log('job');
    console.log(job);
  const response = await fetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  });
  
  if (!response.ok) throw new Error('Failed to create job');
  const data = await response.json();
  return data.job;
};

const updateJob = async ({ id, ...data }: UpdateJobDTO & { id: string }) => {
  const response = await fetch(`/api/jobs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) throw new Error('Failed to update job');
  return response.json();
};

const deleteJob = async (id: string) => {
  const response = await fetch(`/api/jobs/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) throw new Error('Failed to delete job');
};

// Hooks
export function useJobs(query: JobQuery & { userId?: string }) {
  return useQuery({
    queryKey: ['jobs', query],
    queryFn: () => fetchJobs(query),
    enabled: !!query.userId,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateJob,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}
const magicScrapeJob = async (data: MagicScrapeJobDTO) => {
  const response = await fetch('/api/jobs/magic-scrape', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to scrape job');
  }
  
  const result = await response.json();
  return result.job;
};

// Keep existing hooks

// Add new hook for magic scrape
export function useMagicScrape() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: magicScrapeJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

// Add new hook for filtering by technical tags
export function useJobsByTechnicalTags(userId?: string, tags?: string[]) {
  return useQuery({
    queryKey: ['jobs', 'technical', tags],
    queryFn: () => fetchJobs({ userId, technicalTags: tags }),
    enabled: !!userId && !!tags?.length,
  });
}

// Add new hook for filtering by term
export function useJobsByTerm(userId?: string, term?: string) {
  return useQuery({
    queryKey: ['jobs', 'term', term],
    queryFn: () => fetchJobs({ userId, term }),
    enabled: !!userId && !!term,
  });
}