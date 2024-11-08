'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowUpRight, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  size: string;
  website: string;
  activeJobs: number;
  contacts: number;
  description: string;
}

export function CompanyList({ companies }: { companies: Company[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Active Jobs</TableHead>
            <TableHead>Contacts</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={company.logo} alt={company.name} />
                    <AvatarFallback>{company.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{company.name}</div>
                    <div className="text-sm text-muted-foreground">
                      <a 
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {new URL(company.website).hostname}
                      </a>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{company.industry}</Badge>
              </TableCell>
              <TableCell>{company.location}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  {company.size}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  {company.activeJobs}
                </div>
              </TableCell>
              <TableCell>{company.contacts}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/companies/${company.id}`}>
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}