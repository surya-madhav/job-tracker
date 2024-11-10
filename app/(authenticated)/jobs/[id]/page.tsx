'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { useUpdateJob, useDeleteJob } from '@/hooks/use-jobs';
import { JobStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useForm } from 'react-hook-form';
import { 
  Building2, 
  Calendar, 
  Link as LinkIcon, 
  FileText,
  Edit, 
  Trash2, 
  ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { JobWithRelations, UpdateJobDTO } from '@/types/jobs.type';

const JOB_STATUS_MAP = {
  [JobStatus.SAVED]: { label: 'Saved', color: 'bg-blue-100 text-blue-800' },
  [JobStatus.APPLIED]: { label: 'Applied', color: 'bg-yellow-100 text-yellow-800' },
  [JobStatus.INTERVIEWING]: { label: 'Interviewing', color: 'bg-purple-100 text-purple-800' },
  [JobStatus.OFFERED]: { label: 'Offered', color: 'bg-green-100 text-green-800' },
  [JobStatus.REJECTED]: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
};

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch job data
  const { data: mob, isLoading, error } = useQuery({
    queryKey: ['job', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/jobs/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch job');
      return response.json();
    },
    enabled: !!params.id && !!user?.id,
  });
  const job = mob as JobWithRelations;
  const updateJobMutation = useUpdateJob();
  const deleteJobMutation = useDeleteJob();

  const form = useForm<UpdateJobDTO>({
    defaultValues: {
      title: job?.title || '',
      status: job?.status || JobStatus.SAVED,
      url: job?.url || '',
      applicationDate: job?.applicationDate ? job.applicationDate : undefined,
      notes: job?.notes || '',
    },
  });

  const handleUpdateJob = async (data: UpdateJobDTO) => {
    try {
      await updateJobMutation.mutateAsync({
        id: params.id,
        ...data,
      });
      setIsEditDialogOpen(false);
      toast.success('Job updated successfully');
    } catch (error) {
      toast.error('Failed to update job');
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" asChild>
          <Link href="/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
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
                <AlertDialogAction onClick={handleDeleteJob}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Main Content */}
      <Card>
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
        <CardContent className="space-y-6">
          {/* Key Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Company Details</h2>
              {job.company && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{job.company.name}</span>
                  </div>
                  {job.company.website && (
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={job.company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Company Website
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Application Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Application Details</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Applied: {job.applicationDate 
                      ? new Date(job.applicationDate).toLocaleDateString() 
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
                {job.resume && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={job.resume.fileUrl || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Resume: {job.resume.name}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {job.notes && (
            <>
              <Separator />
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Notes</h2>
                <div className="prose max-w-none">
                  {job.notes}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Job Application</DialogTitle>
            <DialogDescription>
              Make changes to your job application details below.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateJob)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(JOB_STATUS_MAP).map(([value, { label }]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[100px]" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateJobMutation.isPending}>
                  {updateJobMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}