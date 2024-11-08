'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import type { Section } from '@/app/(authenticated)/resumes/new/page';

interface ResumePreviewProps {
  sections: Section[];
}

export function ResumePreview({ sections }: ResumePreviewProps) {
  return (
    <ScrollArea className="h-full">
      <div className="max-w-4xl mx-auto p-8">
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.id} className="space-y-4">
              <h2 className="text-2xl font-bold">{section.name}</h2>
              {/* Render section content based on section.id */}
              <div className="text-muted-foreground italic">
                Preview content for {section.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}