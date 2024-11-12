'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCompanyDTO, UpdateCompanyDTO, CompanyQuery } from '@/types/company.types';

const API_ENDPOINT = '/api/companies';

// API functions
const fetchCompanies = async (query: CompanyQuery = {}) => {
  const params = new URLSearchParams();
  if (query.search) params.set('search', query.search);
  if (query.industry) params.set('industry', query.industry);

  const response = await fetch(`${API_ENDPOINT}?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch companies');
  return response.json();
};

const fetchCompany = async (id: string) => {
  const response = await fetch(`${API_ENDPOINT}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch company');
  return response.json();
};

const createCompany = async (data: CreateCompanyDTO) => {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create company');
  return response.json();
};

const updateCompany = async ({ id, ...data }: UpdateCompanyDTO & { id: string }) => {
  const response = await fetch(`${API_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update company');
  return response.json();
};

const deleteCompany = async (id: string) => {
  const response = await fetch(`${API_ENDPOINT}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete company');
};

const fetchCompanyStats = async (id: string) => {
  const response = await fetch(`${API_ENDPOINT}/${id}/stats`);
  if (!response.ok) throw new Error('Failed to fetch company stats');
  return response.json();
};

const fetchCompanyJobs = async (id: string) => {
  const response = await fetch(`${API_ENDPOINT}/${id}/jobs`);
  if (!response.ok) throw new Error('Failed to fetch company jobs');
  return response.json();
};

// Hooks
export function useCompanies(query: CompanyQuery = {}) {
  return useQuery({
    queryKey: ['companies', query],
    queryFn: () => fetchCompanies(query),
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => fetchCompany(id),
    enabled: !!id,
  });
}

export function useCompanyStats(id: string) {
  return useQuery({
    queryKey: ['company', id, 'stats'],
    queryFn: () => fetchCompanyStats(id),
    enabled: !!id,
  });
}

export function useCompanyJobs(id: string) {
  return useQuery({
    queryKey: ['company', id, 'jobs'],
    queryFn: () => fetchCompanyJobs(id),
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCompany,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['company', data.id] });
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.removeQueries({ queryKey: ['company', id] });
    },
  });
}