'use client';

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, ArrowUpRight, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Resume {
  id: string;
  name: string;
  tags: string[];
  updatedAt: string;
  linkedJobs: number;
}

export function ResumeGrid() {
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {resumes.map((resume) => (
        <Card key={resume.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-primary/10 p-2 rounded">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">{resume.name}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {resume.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                Updated {resume.updatedAt}
              </div>

              <div className="text-sm text-muted-foreground">
                Linked to {resume.linkedJobs} job applications
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button asChild variant="secondary" size="sm" className="flex-1">
                  <Link href={`/resumes/${resume.id}`}>
                    View Details
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}