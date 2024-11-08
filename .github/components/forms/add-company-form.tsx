'use client';

import { useState } from 'react';
import { UrlScraper } from '@/components/ui/url-scraper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function AddCompanyForm() {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    industry: '',
    location: '',
    size: '',
    description: '',
  });

  const handleScrape = async (url: string) => {
    // Here you would implement the actual scraping logic
    // For now, we'll simulate with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Example: Simulating data from company website/LinkedIn
    setFormData({
      name: 'Tech Corp Inc.',
      website: url,
      industry: 'Information Technology',
      location: 'San Francisco, CA',
      size: '1,000-5,000 employees',
      description: 'Leading provider of cloud-based enterprise solutions',
    });
  };

  return (
    <UrlScraper
      title="Add Company"
      description="Add a new company to track"
      urlPlaceholder="Enter company website or LinkedIn URL"
      onScrape={handleScrape}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <Input
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Industry</Label>
            <Input
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
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
            <Label>Company Size</Label>
            <Input
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <Button className="w-full">Add Company</Button>
      </div>
    </UrlScraper>
  );
}