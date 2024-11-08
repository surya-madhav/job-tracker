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
import { Download, ArrowUpRight, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Resume {
  id: string;
  name: string;
  tags: string[];
  updatedAt: string;
  linkedJobs: number;
}

export function ResumeList() {
  // TODO: Replace with actual data fetching
  const resumes: Resume[] = [
    {
      id: '1',
      name: 'Software Engineer Resume',
      tags: ['tech', 'engineering', 'frontend'],
      updatedAt: '2024-03-15',
      linkedJobs: 3,
    },
    {
      id: '2',
      name: 'Product Manager Resume',
      tags: ['product', 'management', 'agile'],
      updatedAt: '2024-03-10',
      linkedJobs: 2,
    },
    {
      id: '3',
      name: 'UX Designer Resume',
      tags: ['design', 'ux', 'creative'],
      updatedAt: '2024-03-20',
      linkedJobs: 1,
    },
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Linked Jobs</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resumes.map((resume) => (
            <TableRow key={resume.id}>
              <TableCell className="font-medium">{resume.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {resume.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  {resume.updatedAt}
                </div>
              </TableCell>
              <TableCell>{resume.linkedJobs}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download PDF</span>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/resumes/${resume.id}`}>
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}