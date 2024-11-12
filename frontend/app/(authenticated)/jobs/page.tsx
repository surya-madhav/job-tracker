'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useJobs } from '@/hooks/use-jobs';
import { JobStatus } from '@prisma/client';
import { JobGrid } from '@/components/jobs/job-grid';
import { JobList } from '@/components/jobs/job-list';
import { JobKanban } from '@/components/jobs/job-kanban';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Plus, LayoutGrid, List, Kanban, Search, Filter } from 'lucide-react';
import Link from 'next/link';

type ViewType = 'grid' | 'list' | 'kanban';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: JobStatus.SAVED, label: 'Saved' },
  { value: JobStatus.APPLIED, label: 'Applied' },
  { value: JobStatus.INTERVIEWING, label: 'Interviewing' },
  { value: JobStatus.OFFERED, label: 'Offered' },
  { value: JobStatus.REJECTED, label: 'Rejected' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'company', label: 'Company Name' },
  { value: 'title', label: 'Job Title' },
];

export default function JobsPage() {
  const { user } = useAuth();
  const [view, setView] = useState<ViewType>('grid');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');

  // Fetch jobs using the hook
  const { data: jobs, isLoading, error } = useJobs({
    userId: user?.id,
    status: status !== 'all' ? status as JobStatus : undefined,
    title: search || undefined,
  });

  const viewOptions = [
    { icon: LayoutGrid, value: 'grid', label: 'Grid' },
    { icon: List, value: 'list', label: 'List' },
    { icon: Kanban, value: 'kanban', label: 'Kanban' },
  ];

  // Sort jobs based on selected option
  const sortedJobs = jobs ? [...jobs].sort((a, b) => {
    switch (sort) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'company':
        return (a.company?.name || '').localeCompare(b.company?.name || '');
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  }) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Applications</h1>
        <Button asChild>
          <Link href="/jobs/new">
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Link>
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-col md:flex-row md:items-center">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex rounded-md border">
              {viewOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    variant={view === option.value ? 'secondary' : 'ghost'}
                    size="sm"
                    className="px-3 rounded-none first:rounded-l-md last:rounded-r-md"
                    onClick={() => setView(option.value as ViewType)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{option.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center text-destructive">
            Error loading jobs: {error.message}
          </div>
        ) : sortedJobs.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No jobs found. Try adjusting your filters or add a new job application.
          </div>
        ) : (
          <>
            {view === 'grid' && <JobGrid jobs={sortedJobs} />}
            {view === 'list' && <JobList jobs={sortedJobs} />}
            {view === 'kanban' && <JobKanban jobs={sortedJobs} />}
          </>
        )}
      </div>
    </div>
  );
}