'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase } from 'lucide-react';
import { JobWithRelations } from '@/types/jobs.type';
import { JobStatus } from '@prisma/client';
import { useUpdateJob } from '@/hooks/use-jobs';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

const columns = [
  { id: JobStatus.SAVED, title: 'Saved', color: 'bg-secondary' },
  { id: JobStatus.APPLIED, title: 'Applied', color: 'bg-blue-100 dark:bg-blue-900' },
  { id: JobStatus.INTERVIEWING, title: 'Interviewing', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { id: JobStatus.OFFERED, title: 'Offered', color: 'bg-green-100 dark:bg-green-900' },
  { id: JobStatus.REJECTED, title: 'Rejected', color: 'bg-red-100 dark:bg-red-900' },
] as const;

export function JobKanban({ jobs }: { jobs: JobWithRelations[] }) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const { user } = useAuth();
  const updateJob = useUpdateJob();

  const getColumnJobs = (columnId: JobStatus) => {
    return jobs.filter((job) => job.status === columnId);
  };

  const handleDrop = async (jobId: string, newStatus: JobStatus) => {
    if (!user?.id) return;
    
    try {
      await updateJob.mutateAsync({
        id: jobId,
        userId: user.id,
        status: newStatus,
      });
    } catch (error) {
      console.error('Failed to update job status:', error);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80"
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add('bg-muted');
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove('bg-muted');
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('bg-muted');
            if (draggingId) {
              handleDrop(draggingId, column.id);
            }
          }}
        >
          <div className={`p-4 rounded-t-lg ${column.color}`}>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{column.title}</h3>
              <Badge variant="secondary">{getColumnJobs(column.id).length}</Badge>
            </div>
          </div>
          <div className="p-2 bg-card rounded-b-lg border-x border-b min-h-[70vh]">
            <div className="space-y-2">
              {getColumnJobs(column.id).map((job) => (
                <Card
                  key={job.id}
                  className="cursor-move hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={() => setDraggingId(job.id)}
                  onDragEnd={() => setDraggingId(null)}
                >
                  <CardHeader className="p-4">
                    <Link href={`/jobs/${job.id}`} className="hover:underline">
                      <CardTitle className="text-sm font-medium">{job.title}</CardTitle>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {job.company?.name || 'No Company'}
                    </p>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2 text-sm">
                      {job.url && (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:underline"
                        >
                          <Briefcase className="mr-2 h-4 w-4" />
                          Job Posting
                        </a>
                      )}
                      {job.applicationDate && (
                        <p className="text-muted-foreground">
                          Applied {formatDistanceToNow(new Date(job.applicationDate), { addSuffix: true })}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}