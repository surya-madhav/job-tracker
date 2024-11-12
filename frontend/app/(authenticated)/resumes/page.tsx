'use client';

import { useState } from 'react';
import { FileText, Plus, LayoutGrid, List, Search, Filter } from 'lucide-react';
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
import { ResumeGrid } from '@/components/resumes/resume-grid';
import { ResumeList } from '@/components/resumes/resume-list';

type ViewType = 'grid' | 'list';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name', label: 'Name' },
  { value: 'updated', label: 'Last Updated' },
];

export default function ResumesPage() {
  const [view, setView] = useState<ViewType>('grid');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const viewOptions = [
    { icon: LayoutGrid, value: 'grid', label: 'Grid' },
    { icon: List, value: 'list', label: 'List' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Resumes</h1>
        <Button asChild>
          <Link href="/resumes/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Resume
          </Link>
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resumes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-col md:flex-row md:items-center">
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
        {view === 'grid' ? <ResumeGrid /> : <ResumeList />}
      </div>
    </div>
  );
}