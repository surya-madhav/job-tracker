'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { PersonalInfoEditor } from './sections/personal-info-editor';
import { EducationEditor } from './sections/education-editor';
import { ExperienceEditor } from './sections/experience-editor';
import { ProjectsEditor } from './sections/projects-editor';
import { SkillsEditor } from './sections/skills-editor';
import { PublicationsEditor } from './sections/publications-editor';
import type { Section } from '@/app/(authenticated)/resumes/new/page';

interface ResumeEditorProps {
  activeSection: string;
  selectedRole: string | null;
  sections: Section[];
}

export function ResumeEditor({ activeSection, selectedRole, sections }: ResumeEditorProps) {
  const renderSection = () => {
    switch (activeSection) {
      case 'personal_info':
        return <PersonalInfoEditor />;
      case 'education':
        return <EducationEditor />;
      case 'experience':
        return <ExperienceEditor />;
      case 'projects':
        return <ProjectsEditor />;
      case 'skills':
        return <SkillsEditor />;
      case 'publications_and_awards':
        return <PublicationsEditor />;
      case 'overall':
        return (
          <div className="space-y-8">
            <PersonalInfoEditor />
            <EducationEditor />
            <ExperienceEditor />
            <ProjectsEditor />
            <SkillsEditor />
            <PublicationsEditor />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="max-w-4xl mx-auto p-8">
        {renderSection()}
      </div>
    </ScrollArea>
  );
}