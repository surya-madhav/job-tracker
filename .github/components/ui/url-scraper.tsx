'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Wand2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface UrlScraperProps {
  title: string;
  description: string;
  urlPlaceholder: string;
  onScrape: (url: string) => Promise<void>;
  children: React.ReactNode;
}

export function UrlScraper({
  title,
  description,
  urlPlaceholder,
  onScrape,
  children
}: UrlScraperProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleScrape = async () => {
    if (!url) return;
    setIsLoading(true);
    try {
      await onScrape(url);
    } catch (error) {
      console.error('Scraping failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scrape">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scrape">
              <Wand2 className="h-4 w-4 mr-2" />
              Auto-fill
            </TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scrape" className="space-y-4">
            <div className="space-y-2">
              <Label>URL</Label>
              <div className="flex gap-2">
                <Input
                  placeholder={urlPlaceholder}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button 
                  onClick={handleScrape}
                  disabled={!url || isLoading}
                >
                  {isLoading ? (
                    <>Loading...</>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Auto-fill
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="manual">
            {children}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}