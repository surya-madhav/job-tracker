'use client';

import { useState } from 'react';
import { UrlScraper } from '@/components/ui/url-scraper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCompany } from '@/hooks/use-companies';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface FormData {
  name: string;
  website: string;
  industry: string;
  location: string;
  notes: string;
}

export function AddCompanyForm() {
  const router = useRouter();
  const { toast } = useToast();
  const createCompany = useCreateCompany();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    website: '',
    industry: '',
    location: '',
    notes: '',
  });

  const handleScrape = async (url: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setFormData({
      name: 'Tech Corp Inc.',
      website: url,
      industry: 'Information Technology',
      location: 'San Francisco, CA',
      notes: 'Leading provider of cloud-based enterprise solutions',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createCompany.mutateAsync({
        name: formData.name,
        website: formData.website || null,
        industry: formData.industry || null,
        location: formData.location || null,
        notes: formData.notes || null,
      });

      toast({
        title: "Success",
        description: "Company added successfully",
      });

      router.push('/companies');
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add company",
        variant: "destructive",
      });
    }
  };

  return (
    <UrlScraper
      title="Add Company"
      description="Add a new company to track"
      urlPlaceholder="Enter company website or LinkedIn URL"
      onScrape={handleScrape}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <Input
              type="url"
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
        </div>
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add any additional notes about the company..."
          />
        </div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={createCompany.isPending}
        >
          {createCompany.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {createCompany.isPending ? 'Adding...' : 'Add Company'}
        </Button>
      </form>
    </UrlScraper>
  );
}