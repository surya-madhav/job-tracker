'use client';

import { useState } from 'react';
import { Briefcase, Plus, LayoutGrid, List, Kanban, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { JobGrid } from '@/components/jobs/job-grid';
import { JobList } from '@/components/jobs/job-list';
import { JobKanban } from '@/components/jobs/job-kanban';

type ViewType = 'grid' | 'list' | 'kanban';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'saved', label: 'Saved' },
  { value: 'applied', label: 'Applied' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'offered', label: 'Offered' },
  { value: 'rejected', label: 'Rejected' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'company', label: 'Company Name' },
  { value: 'title', label: 'Job Title' },
];

export default function JobsPage() {
  const [view, setView] = useState<ViewType>('grid');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');

  const [jobs] = useState([
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'Tech Corp Inc.',
      status: 'Applied',
      date: '2024-01-15',
      location: 'San Francisco, CA',
      salary: '$150k - $180k',
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      company: 'Startup Co.',
      status: 'Interviewing',
      date: '2024-01-10',
      location: 'Remote',
      salary: '$130k - $160k',
    },
    {
      id: '3',
      title: 'Software Architect',
      company: 'Enterprise Systems',
      status: 'Saved',
      date: '2024-01-20',
      location: 'New York, NY',
      salary: '$170k - $200k',
    },
  ]);

  const viewOptions = [
    { icon: LayoutGrid, value: 'grid', label: 'Grid' },
    { icon: List, value: 'list', label: 'List' },
    { icon: Kanban, value: 'kanban', label: 'Kanban' },
  ];

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
        {view === 'grid' && <JobGrid jobs={jobs} />}
        {view === 'list' && <JobList jobs={jobs} />}
        {view === 'kanban' && <JobKanban jobs={jobs} />}
      </div>
    </div>
  );
}