'use client';

import { useState } from 'react';
import { Building2, Plus, LayoutGrid, List, Search, Filter } from 'lucide-react';
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
import { CompanyGrid } from '@/components/companies/company-grid';
import { CompanyList } from '@/components/companies/company-list';

type ViewType = 'grid' | 'list';

const industryOptions = [
  { value: 'all', label: 'All Industries' },
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
];

const sortOptions = [
  { value: 'name', label: 'Company Name' },
  { value: 'recent', label: 'Recently Added' },
  { value: 'applications', label: 'Most Applications' },
  { value: 'size', label: 'Company Size' },
];

export default function CompaniesPage() {
  const [view, setView] = useState<ViewType>('grid');
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('all');
  const [sort, setSort] = useState('name');

  const [companies] = useState([
    {
      id: '1',
      name: 'Tech Corp Inc.',
      logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=200&h=200&fit=crop',
      industry: 'Technology',
      location: 'San Francisco, CA',
      size: '1000-5000',
      website: 'https://techcorp.com',
      activeJobs: 3,
      contacts: 2,
      description: 'Leading technology company specializing in AI and machine learning solutions.',
    },
    {
      id: '2',
      name: 'Finance Plus',
      logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop',
      industry: 'Finance',
      location: 'New York, NY',
      size: '5000+',
      website: 'https://financeplus.com',
      activeJobs: 1,
      contacts: 1,
      description: 'Global financial services firm providing innovative solutions.',
    },
    {
      id: '3',
      name: 'Health Solutions',
      logo: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?w=200&h=200&fit=crop',
      industry: 'Healthcare',
      location: 'Boston, MA',
      size: '500-1000',
      website: 'https://healthsolutions.com',
      activeJobs: 2,
      contacts: 3,
      description: 'Healthcare technology company improving patient care through innovation.',
    },
  ]);

  const viewOptions = [
    { icon: LayoutGrid, value: 'grid', label: 'Grid' },
    { icon: List, value: 'list', label: 'List' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Companies</h1>
        <Button asChild>
          <Link href="/companies/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Link>
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-col md:flex-row md:items-center">
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by industry" />
              </SelectTrigger>
              <SelectContent>
                {industryOptions.map((option) => (
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
        {view === 'grid' && <CompanyGrid companies={companies} />}
        {view === 'list' && <CompanyList companies={companies} />}
      </div>
    </div>
  );
}