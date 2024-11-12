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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowUpRight, Globe, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { CompanyWithRelations } from '@/types/company.types';
import { JobStatus } from '@prisma/client';

export function CompanyList({ companies }: { companies: CompanyWithRelations[] }) {
  const getActiveJobsCount = (company: CompanyWithRelations) => {
    return company.jobs?.filter(job => 
      job.status === JobStatus.APPLIED || 
      job.status === JobStatus.INTERVIEWING
    ).length || 0;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatWebsiteUrl = (website: string | null) => {
    if (!website) return '';
    try {
      const url = new URL(website);
      return url.hostname.replace('www.', '');
    } catch {
      return website;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Applications</TableHead>
            <TableHead>Latest Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10">
                      {getInitials(company.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{company.name}</div>
                    {company.website && (
                      <div className="text-sm text-muted-foreground">
                        <a 
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1"
                        >
                          <Globe className="h-3 w-3" />
                          {formatWebsiteUrl(company.website)}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {company.industry && (
                  <Badge variant="secondary">{company.industry}</Badge>
                )}
              </TableCell>
              <TableCell>{company.location || 'N/A'}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  {company._count?.jobs || 0} total
                  {getActiveJobsCount(company) > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {getActiveJobsCount(company)} active
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {company.jobs && company.jobs[0] ? (
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-medium">
                      {company.jobs[0].title}
                    </div>
                    <Badge variant="outline">
                      {company.jobs[0].status}
                    </Badge>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">No applications</span>
                )}
              </TableCell>
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