'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  status: string;
  date: string;
  location: string;
  salary: string;
}

const columns = [
  { id: 'saved', title: 'Saved', color: 'bg-secondary' },
  { id: 'applied', title: 'Applied', color: 'bg-blue-100 dark:bg-blue-900' },
  { id: 'interviewing', title: 'Interviewing', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { id: 'offered', title: 'Offered', color: 'bg-green-100 dark:bg-green-900' },
  { id: 'rejected', title: 'Rejected', color: 'bg-red-100 dark:bg-red-900' },
];

export function JobKanban({ jobs }: { jobs: Job[] }) {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const getColumnJobs = (columnId: string) => {
    return jobs.filter((job) => job.status.toLowerCase() === columnId);
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
            e.currentTarget.classList.remove('bg-muted');
            if (draggingId) {
              // Handle drop logic here
              console.log(`Moved ${draggingId} to ${column.id}`);
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
                  className="cursor-move"
                  draggable
                  onDragStart={() => setDraggingId(job.id)}
                  onDragEnd={() => setDraggingId(null)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium">{job.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <DollarSign className="mr-2 h-4 w-4" />
                        {job.salary}
                      </div>
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