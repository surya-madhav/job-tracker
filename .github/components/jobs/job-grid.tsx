'use client';

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, DollarSign, Calendar, ArrowUpRight } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  status: string;
  date: string;
  location: string;
  salary: string;
}

export function JobGrid({ jobs }: { jobs: Job[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <Card key={job.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="line-clamp-1">{job.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
              <Badge variant={job.status === 'Interviewing' ? 'default' : 'secondary'}>
                {job.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                {job.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="mr-2 h-4 w-4" />
                {job.salary}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                Applied on {job.date}
              </div>
              <Button className="w-full mt-4" variant="secondary">
                View Details
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}