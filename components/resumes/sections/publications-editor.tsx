'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus } from 'lucide-react';

export function PublicationsEditor() {
  const [entries] = useState([
    {
      id: '1',
      description: "Co-Authored a publication in Springer's Advances in Computing and Network Communications.",
      boldKeywords: ['Springer'],
      include: true,
    },
    {
      id: '2',
      description: 'First runner up in Protothon, a two-week Product Hackathon at Northeastern University, Boston (2023).',
      boldKeywords: ['Protothon'],
      include: true,
    },
  ]);

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card key={entry.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="flex items-center gap-2">
                <Checkbox checked={entry.include} />
                Entry
              </CardTitle>
              <Button variant="ghost" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                defaultValue={entry.description}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Bold Keywords (comma-separated)</Label>
              <Input defaultValue={entry.boldKeywords.join(', ')} />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Entry
      </Button>
    </div>
  );
}