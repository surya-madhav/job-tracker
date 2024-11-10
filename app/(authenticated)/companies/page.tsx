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
import { useCompanies } from '@/hooks/use-companies';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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
];

export default function CompaniesPage() {
  const [view, setView] = useState<ViewType>('grid');
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('all');
  const [sort, setSort] = useState('name');

  const { data: companies = [], isLoading, error } = useCompanies({
    search: search || undefined,
    industry: industry !== 'all' ? industry : undefined,
  });

  const viewOptions = [
    { icon: LayoutGrid, value: 'grid', label: 'Grid' },
    { icon: List, value: 'list', label: 'List' },
  ];

  // Sort companies based on selected option
  const sortedCompanies = [...companies].sort((a, b) => {
    switch (sort) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'applications':
        return (b._count?.jobs || 0) - (a._count?.jobs || 0);
      default:
        return 0;
    }
  });

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
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center text-destructive">
            Error loading companies
          </div>
        ) : sortedCompanies.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No companies found. Try adjusting your filters or add a new company.
          </div>
        ) : (
          <>
            {view === 'grid' && <CompanyGrid companies={sortedCompanies} />}
            {view === 'list' && <CompanyList companies={sortedCompanies} />}
          </>
        )}
      </div>
    </div>
  );
}