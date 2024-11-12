'use client';

import { useState } from 'react';
import { UrlScraper } from '@/components/ui/url-scraper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function AddContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    notes: '',
  });

  const handleScrape = async (url: string) => {
    // Here you would implement the actual scraping logic
    // For now, we'll simulate with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Example: Simulating data from LinkedIn
    setFormData({
      name: 'John Doe',
      position: 'Senior Software Engineer',
      company: 'Tech Corp',
      email: 'john.doe@techcorp.com',
      phone: '(123) 456-7890',
      linkedinUrl: url,
      notes: 'Met at Tech Conference 2024',
    });
  };

  return (
    <UrlScraper
      title="Add Contact"
      description="Add a new contact to your network"
      urlPlaceholder="Enter LinkedIn profile URL"
      onScrape={handleScrape}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Position</Label>
            <Input
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
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
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>LinkedIn URL</Label>
            <Input
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
        <Button className="w-full">Add Contact</Button>
      </div>
    </UrlScraper>
  );
}