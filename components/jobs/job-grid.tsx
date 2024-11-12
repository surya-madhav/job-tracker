'use client';

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, DollarSign, Calendar, ArrowUpRight } from 'lucide-react';
import { JobWithRelations } from '@/types/jobs.type';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

const statusColorMap = {
  SAVED: 'bg-secondary',
  APPLIED: 'bg-blue-100 text-blue-800 dark:bg-blue-900',
  INTERVIEWING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900',
  OFFERED: 'bg-green-100 text-green-800 dark:bg-green-900',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900',
} as const;

export function JobGrid({ jobs }: { jobs: JobWithRelations[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <Card key={job.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="line-clamp-1">{job.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {job.company?.name || 'No Company'}
                </p>
              </div>
              <Badge className={statusColorMap[job.status]}>
                {job.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {job.url && (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-primary hover:underline"
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Job Posting
                </a>
              )}
              {job.applicationDate && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Applied {formatDistanceToNow(new Date(job.applicationDate), { addSuffix: true })}
                </div>
              )}
              {job.technicalTags && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {job.technicalTags?.join(', ')}
                </p>
              )}
              <Button 
                className="w-full mt-4" 
                variant="secondary"
                asChild
              >
                <Link href={`/jobs/${job.id}`}>
                  View Details
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}