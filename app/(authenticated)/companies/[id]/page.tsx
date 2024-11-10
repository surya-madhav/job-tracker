'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Globe, MapPin, Phone, Mail, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Job, JobStatus } from '@prisma/client';
import { useCompany } from '@/hooks/use-companies';
import { formatDistanceToNow } from 'date-fns';

const statusColorMap: Record<JobStatus, string> = {
  SAVED: 'bg-secondary text-secondary-foreground',
  APPLIED: 'bg-blue-100 text-blue-800 dark:bg-blue-900',
  INTERVIEWING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900',
  OFFERED: 'bg-green-100 text-green-800 dark:bg-green-900',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900',
};

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: company, isLoading, error } = useCompany(params.id);

  if (error) {
    router.push('/companies');
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            {company.name}
          </h1>
        </div>
        <Button onClick={() => router.push(`/companies/${company.id}/edit`)}>
          Edit Company
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {company.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {company.website}
                </a>
              </div>
            )}
            {company.industry && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{company.industry}</span>
              </div>
            )}
            {company.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{company.location}</span>
              </div>
            )}
            {company.notes && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Notes</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{company.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Job Applications</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/jobs/new?company=${company.id}`)}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Add Job
            </Button>
          </CardHeader>
          <CardContent>
            {company.jobs && company.jobs.length > 0 ? (
              <div className="space-y-4">
                {company.jobs.map((job:Job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer"
                    onClick={() => router.push(`/jobs/${job.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{job.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {job.applicationDate && (
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(job.applicationDate), { addSuffix: true })}
                        </span>
                      )}
                      <Badge className={statusColorMap[job.status]}>
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No job applications yet</p>
                <Button 
                  variant="link" 
                  onClick={() => router.push(`/jobs/new?company=${company.id}`)}
                >
                  Add your first application
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Recent activity items */}
              <div className="text-sm text-muted-foreground">
                Company added {formatDistanceToNow(new Date(company.createdAt), { addSuffix: true })}
              </div>
              {company.jobs?.map((job:Job) => (
                <div key={job.id} className="text-sm text-muted-foreground">
                  Applied for {job.title} position{' '}
                  {job.applicationDate && (
                    formatDistanceToNow(new Date(job.applicationDate), { addSuffix: true })
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{company.jobs?.length || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Active Applications</p>
                <p className="text-2xl font-bold">
                  {company.jobs?.filter((job:Job) => 
                    job.status === 'APPLIED' || job.status === 'INTERVIEWING'
                  ).length || 0}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">
                  {company.jobs?.length ? 
                    Math.round((company.jobs.filter((job:Job) => job.status === 'OFFERED').length / 
                    company.jobs.length) * 100) : 0}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Avg. Response Time</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}