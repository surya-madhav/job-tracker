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
import { useCreateJob, useMagicScrape } from '@/hooks/use-jobs';
import { useCreateCompany, useCompanies } from '@/hooks/use-companies';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { JobStatus } from '@prisma/client';
import { CompanyCombobox } from '@/components/ui/company-combobox';

interface FormData {
  title: string;
  companyId?: string;
  newCompany?: {
    name: string;
    location: string;
  };
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
  const magicScrape = useMagicScrape();
  const createCompany = useCreateCompany();
  const { data: companies = [] } = useCompanies();
  const [isNewCompany, setIsNewCompany] = useState(false);
  const [isScraped, setIsScraped] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    location: '',
    salary: '',
    url: '',
    status: JobStatus.SAVED,
    notes: '',
  });

  const handleScrape = async (url: string) => {
    try {
      const scrapedJob = await magicScrape.mutateAsync({
        url,
        notes: formData.notes // Preserve any existing notes
      });

      // Update form with scraped data
      setFormData({
        title: scrapedJob.title,
        newCompany: {
          name: scrapedJob.company,
          location: [
            scrapedJob.city,
            scrapedJob.state,
            scrapedJob.country
          ].filter(Boolean).join(', '),
        },
        location: [
          scrapedJob.city,
          scrapedJob.state,
          `(${scrapedJob.remoteStatus})`
        ].filter(Boolean).join(', '),
        salary: scrapedJob.salaryMin && scrapedJob.salaryMax 
          ? `${scrapedJob.salaryCurrency || '$'}${scrapedJob.salaryMin.toLocaleString()} - ${scrapedJob.salaryCurrency || '$'}${scrapedJob.salaryMax.toLocaleString()}`
          : '',
        url,
        status: JobStatus.SAVED,
        notes: [
          formData.notes,
          `Technical Skills: ${scrapedJob.technicalTags?.join(', ')}`,
          `Role Tags: ${scrapedJob.roleTags?.join(', ')}`,
          scrapedJob.markdownContent,
        ].filter(Boolean).join('\n\n'),
      });

      setIsNewCompany(true);
      setIsScraped(true);

      toast({
        title: "Success",
        description: "Job details scraped successfully",
      });

    } catch (error) {
      console.error('Scraping failed:', error);
      toast({
        title: "Error",
        description: "Failed to scrape job details. Please try manual entry.",
        variant: "destructive",
      });
    }
  };

  const handleCompanySelect = (companyId: string) => {
    setIsNewCompany(false);
    setFormData(prev => ({
      ...prev,
      companyId,
      newCompany: undefined,
    }));
  };

  const handleNewCompanyChange = (field: 'name' | 'location', value: string) => {
    setFormData(prev => ({
      ...prev,
      newCompany: {
        ...prev.newCompany || { name: '', location: '' },
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isScraped) {
        // For scraped jobs, we don't need to do anything as the job was already created
        router.push('/jobs');
        router.refresh();
        return;
      }

      let companyId = formData.companyId;

      // Create new company if needed
      if (isNewCompany && formData.newCompany?.name) {
        const company = await createCompany.mutateAsync({
          name: formData.newCompany.name,
          location: formData.newCompany.location,
        });
        companyId = company.id;
      }

      // Create job manually
      await createJob.mutateAsync({
        title: formData.title,
        companyId,
        url: formData.url,
        status: formData.status,
        notes: formData.notes,
        applicationDate: new Date(),
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
      description={
        isScraped 
          ? "Job details have been automatically filled. Review and save or make adjustments as needed."
          : "Track a new job application by auto-filling from URL or manual entry"
      }
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
              disabled={isScraped}
            />
          </div>
          <div className="space-y-2">
            <Label>Company</Label>
            <div className="flex items-center gap-2">
              {isNewCompany ? (
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Company Name"
                    value={formData.newCompany?.name || ''}
                    onChange={(e) => handleNewCompanyChange('name', e.target.value)}
                    required
                    disabled={isScraped}
                  />
                  {!isScraped && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsNewCompany(false)}
                    >
                      Select Existing
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex-1 space-y-2">
                  <CompanyCombobox
                    value={formData.companyId}
                    onChange={handleCompanySelect}
                    disabled={isScraped}
                  />
                  {!isScraped && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsNewCompany(true)}
                    >
                      Add New Company
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            {isNewCompany ? (
              <Input
                value={formData.newCompany?.location || ''}
                onChange={(e) => handleNewCompanyChange('location', e.target.value)}
                placeholder="Company Location"
                disabled={isScraped}
              />
            ) : (
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Job Location"
                disabled={isScraped}
              />
            )}
          </div>
          <div className="space-y-2">
            <Label>Salary Range</Label>
            <Input
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              disabled={isScraped}
            />
          </div>
          <div className="space-y-2">
            <Label>Job URL</Label>
            <Input
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              disabled={isScraped}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: JobStatus) => setFormData({ ...formData, status: value })}
              disabled={isScraped}
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
            className={isScraped ? "min-h-[300px]" : undefined}
          />
        </div>
        
        {!isScraped && (
          <Button 
            type="submit" 
            className="w-full"
            disabled={createJob.isPending || createCompany.isPending}
          >
            {(createJob.isPending || createCompany.isPending) ? 'Adding...' : 'Add Application'}
          </Button>
        )}

        {isScraped && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              This job has been automatically added to your applications. You can review the details above.
            </div>
            <Button 
              type="button" 
              className="w-full"
              onClick={() => router.push('/jobs')}
            >
              View All Applications
            </Button>
          </div>
        )}
      </form>
    </UrlScraper>
  );
}