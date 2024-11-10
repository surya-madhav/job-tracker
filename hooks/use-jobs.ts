'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { JobWithRelations, CreateJobDTO, UpdateJobDTO, JobQuery } from '@/types/jobs.type';

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