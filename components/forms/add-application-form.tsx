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

export function AddApplicationForm() {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    url: '',
    status: 'saved',
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
      status: 'saved',
      notes: 'Position requires 5+ years of React experience',
    });
  };

  return (
    <UrlScraper
      title="Add Application"
      description="Track a new job application"
      urlPlaceholder="Enter job posting URL"
      onScrape={handleScrape}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Job Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Company</Label>
            <Input
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saved">Saved</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="offered">Offered</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
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
        <Button className="w-full">Add Application</Button>
      </div>
    </UrlScraper>
  );
}