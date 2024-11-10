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
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { JobWithRelations } from '@/types/jobs.type';
import Link from 'next/link';
import { format } from 'date-fns';

const statusColorMap = {
  SAVED: 'bg-secondary',
  APPLIED: 'bg-blue-100 text-blue-800 dark:bg-blue-900',
  INTERVIEWING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900',
  OFFERED: 'bg-green-100 text-green-800 dark:bg-green-900',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900',
} as const;

export function JobList({ jobs }: { jobs: JobWithRelations[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Application Date</TableHead>
            <TableHead>Job Posting</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell>{job.company?.name || 'No Company'}</TableCell>
              <TableCell>
                <Badge className={statusColorMap[job.status]}>
                  {job.status}
                </Badge>
              </TableCell>
              <TableCell>
                {job.applicationDate 
                  ? format(new Date(job.applicationDate), 'MMM dd, yyyy')
                  : 'Not applied'
                }
              </TableCell>
              <TableCell>
                {job.url ? (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </a>
                ) : (
                  <span className="text-muted-foreground">No link</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/jobs/${job.id}`}>
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