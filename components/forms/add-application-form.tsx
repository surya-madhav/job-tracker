'use client';

import { useState } from 'react';
import { UrlScraper } from '@/components/ui/url-scraper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateJob } from '@/hooks/use-jobs';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { JobStatus } from '@prisma/client';
// TODO: Implement company creation
// import { useCreateCompany } from '@/hooks/use-companies';

interface FormData {
  title: string;
  company: string;
  location: string;
  salary: string;
  url: string;
  status: JobStatus;
  notes: string;
}

export function AddApplicationForm() {
  const router = useRouter();
  const { toast } = useToast();
  const createJob = useCreateJob();
  // TODO: Implement company creation
  // const createCompany = useCreateCompany();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    company: '',
    location: '',
    salary: '',
    url: '',
    status: JobStatus.SAVED,
    notes: '',
  });

  const handleScrape = async (url: string) => {
    // Here you would implement the actual scraping logic
    // For now, we'll simulate with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Example: Simulating data from job posting
    setFormData({
      title: 'Senior Frontend Developer',
      company: 'Tech Corp',
      location: 'San Francisco, CA (Remote)',
      salary: '$150,000 - $180,000',
      url,
      status: JobStatus.SAVED,
      notes: 'Position requires 5+ years of React experience',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // TODO: Implement company creation
      // First create the company
      // const company = await createCompany.mutateAsync({
      //   name: formData.company,
      //   location: formData.location,
      // });
      const company = { id: '2d39a398-f5b5-47f1-96f4-9983fa2ef890', name: formData.company, website: 'https://techcorp.com' };

      // Then create the job with the company ID
      await createJob.mutateAsync({
        title: formData.title,
        companyId: company.id,
        url: formData.url,
        status: formData.status,
        notes: formData.notes,
        applicationDate: new Date(), // Current date as application date
      });

      toast({
        title: "Success",
        description: "Job application added successfully",
      });

      router.push('/jobs');
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add job application",
        variant: "destructive",
      });
    }
  };

  const statusOptions = [
    { value: JobStatus.SAVED, label: 'Saved' },
    { value: JobStatus.APPLIED, label: 'Applied' },
    { value: JobStatus.INTERVIEWING, label: 'Interviewing' },
    { value: JobStatus.OFFERED, label: 'Offered' },
    { value: JobStatus.REJECTED, label: 'Rejected' },
  ];

  return (
    <UrlScraper
      title="Add Application"
      description="Track a new job application"
      urlPlaceholder="Enter job posting URL"
      onScrape={handleScrape}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Job Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Company</Label>
            <Input
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Salary Range</Label>
            <Input
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Job URL</Label>
            <Input
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: JobStatus) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
        {/* TODO: Create company */}
        {/* <Button 
          type="submit" 
          className="w-full"
          disabled={createJob.isPending || createCompany.isPending}
        >
          {(createJob.isPending || createCompany.isPending) ? 'Adding...' : 'Add Application'}
        </Button> */}
        <Button type='submit' className='w-full'> Add Application </Button>
      </form>
    </UrlScraper>
  );
}