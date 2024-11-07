'use client';

import { useState } from 'react';
import { Users, Plus, LayoutGrid, List, Search, Filter } from 'lucide-react';
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
import { ContactGrid } from '@/components/contacts/contact-grid';
import { ContactList } from '@/components/contacts/contact-list';

type ViewType = 'grid' | 'list';

const companyOptions = [
  { value: 'all', label: 'All Companies' },
  { value: 'tech-corp', label: 'Tech Corp Inc.' },
  { value: 'startup-co', label: 'Startup Co.' },
  { value: 'enterprise', label: 'Enterprise Systems' },
];

const sortOptions = [
  { value: 'name', label: 'Contact Name' },
  { value: 'recent', label: 'Recently Added' },
  { value: 'company', label: 'Company' },
  { value: 'position', label: 'Position' },
];

export default function ContactsPage() {
  const [view, setView] = useState<ViewType>('grid');
  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('all');
  const [sort, setSort] = useState('name');

  const [contacts] = useState([
    {
      id: '1',
      name: 'John Smith',
      position: 'Technical Recruiter',
      company: 'Tech Corp Inc.',
      email: 'john@techcorp.com',
      phone: '(123) 456-7890',
      linkedin: 'https://linkedin.com/in/johnsmith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      lastContact: '2024-03-15',
      notes: 'Met at tech conference, very responsive to emails',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      position: 'Engineering Manager',
      company: 'Startup Co.',
      email: 'sarah@startup.co',
      phone: '(234) 567-8901',
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face',
      lastContact: '2024-03-10',
      notes: 'Conducted technical interview, follow up next week',
    },
    {
      id: '3',
      name: 'Michael Chen',
      position: 'Senior Recruiter',
      company: 'Enterprise Systems',
      email: 'michael@enterprise.com',
      phone: '(345) 678-9012',
      linkedin: 'https://linkedin.com/in/michaelchen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
      lastContact: '2024-03-20',
      notes: 'Referred by colleague, discussed multiple positions',
    },
  ]);

  const viewOptions = [
    { icon: LayoutGrid, value: 'grid', label: 'Grid' },
    { icon: List, value: 'list', label: 'List' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <Button asChild>
          <Link href="/contacts/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Link>
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-col md:flex-row md:items-center">
            <Select value={company} onValueChange={setCompany}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                {companyOptions.map((option) => (
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
        {view === 'grid' && <ContactGrid contacts={contacts} />}
        {view === 'list' && <ContactList contacts={contacts} />}
      </div>
    </div>
  );
}