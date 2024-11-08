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
import { ArrowUpRight } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  status: string;
  date: string;
  location: string;
  salary: string;
}

export function JobList({ jobs }: { jobs: Job[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell>{job.company}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>
                <Badge variant={job.status === 'Interviewing' ? 'default' : 'secondary'}>
                  {job.status}
                </Badge>
              </TableCell>
              <TableCell>{job.date}</TableCell>
              <TableCell>{job.salary}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="sr-only">View details</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}