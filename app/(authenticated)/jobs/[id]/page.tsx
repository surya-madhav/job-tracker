'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { useDeleteJob } from '@/hooks/use-jobs';
import { JobStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Building2, 
  Calendar, 
  Link as LinkIcon, 
  FileText,
  Trash2, 
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Tags,
  Clock,
  Globe,
  Plane
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { JobWithRelations } from '@/types/jobs.type';

const JOB_STATUS_MAP: Record<JobStatus, { label: string; color: string }> = {
  [JobStatus.SAVED]: { label: 'Saved', color: 'bg-blue-100 text-blue-800' },
  [JobStatus.APPLIED]: { label: 'Applied', color: 'bg-yellow-100 text-yellow-800' },
  [JobStatus.INTERVIEWING]: { label: 'Interviewing', color: 'bg-purple-100 text-purple-800' },
  [JobStatus.OFFERED]: { label: 'Offered', color: 'bg-green-100 text-green-800' },
  [JobStatus.REJECTED]: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
};

interface HeaderSectionProps {
  job: JobWithRelations;
  onDelete: () => Promise<void>;
}

const HeaderSection = ({ job, onDelete }: HeaderSectionProps) => (
  <div className="flex justify-between items-center mb-6">
    <Button variant="ghost" asChild>
      <Link href="/jobs">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Jobs
      </Link>
    </Button>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Job Application</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this job application? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
);

interface BasicInfoCardProps {
  job: JobWithRelations;
}

const BasicInfoCard = ({ job }: BasicInfoCardProps) => (
  <Card className="mb-6">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-muted-foreground">{job.company?.name}</p>
        </div>
        <Badge variant="secondary" className={JOB_STATUS_MAP[job.status].color}>
          {JOB_STATUS_MAP[job.status].label}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span>{job.company?.name}</span>
        </div>
        {job.company?.website && (
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <a 
              href={job.company.website || '#'} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              Company Website
            </a>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            Posted: {job.postedDate 
              ? new Date(job.postedDate).toLocaleDateString() 
              : 'Not specified'}
          </span>
        </div>
        {job.url && (
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <a 
              href={job.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              Job Posting
            </a>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

interface MainContentSectionProps {
  job: JobWithRelations;
}

const MainContentSection = ({ job }: MainContentSectionProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
    <div className="lg:col-span-3">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Job Description</h2>
        </CardHeader>
        <CardContent className="prose max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {job.markdownContent || 'No description available.'}
          </ReactMarkdown>
        </CardContent>
      </Card>
    </div>
    
    <div className="lg:col-span-2 space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Job Details</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>Type: {job.jobType || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Term: {job.term || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                Location: {[job.city, job.state, job.country]
                  .filter(Boolean)
                  .join(', ') || 'Not specified'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>Remote Status: {job.remoteStatus || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>
                Salary: {
                  job.salaryMin && job.salaryMax
                    ? `${job.salaryCurrency || '$'}${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
                    : 'Not specified'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-muted-foreground" />
              <span>Visa Sponsorship: {job.visaSponsorship ? 'Yes' : 'No'}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.technicalTags?.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Role Tags</h3>
            <div className="flex flex-wrap gap-2">
              {job.roleTags?.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>

          {job.applicationDeadline && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Application Deadline: {
                  new Date(job.applicationDeadline).toLocaleDateString()
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {!job.resume && (
        <Card className="bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <FileText className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-semibold text-lg">Create a Resume</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize your resume for this position to increase your chances
                </p>
                <Button asChild>
                  <Link href="/resumes/new">Create Resume</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  </div>
);

interface JobDetailsPageProps {
  params: {
    id: string;
  };
}

export default function JobDetailsPage({ params }: JobDetailsPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const deleteJobMutation = useDeleteJob();

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/jobs/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch job');
      const data = await response.json();
      return data as JobWithRelations;
    },
    enabled: !!params.id && !!user?.id,
  });

  const handleDeleteJob = async () => {
    try {
      await deleteJobMutation.mutateAsync(params.id);
      toast.success('Job deleted successfully');
      router.push('/jobs');
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center text-destructive">
        Failed to load job details
      </div>
    );
  }
  console.log("job", job);

  return (
    <div className="space-y-6">
      <HeaderSection job={job} onDelete={handleDeleteJob} />
      <BasicInfoCard job={job} />
      <MainContentSection job={job} />
    </div>
  );
}