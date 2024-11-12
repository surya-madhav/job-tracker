'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, 
  ChevronDown, 
  Save, 
  Download, 
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  User,
  Eye,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResumeEditor } from '@/components/resumes/resume-editor';
import { ResumePreview } from '@/components/resumes/resume-preview';
import { RoleSidebar } from '@/components/resumes/role-sidebar';

export interface Section {
  id: string;
  name: string;
  icon: React.ElementType;
}

export default function NewResumePage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>('overall');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const [sections, setSections] = useState<Section[]>([
    { id: 'overall', name: 'Overall View', icon: LayoutDashboard },
    { id: 'personal_info', name: 'Personal Information', icon: User },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'projects', name: 'Projects', icon: Code },
    { id: 'skills', name: 'Skills', icon: ChevronRight },
    { id: 'publications_and_awards', name: 'Publications & Awards', icon: Award },
  ]);

  const handleSectionReorder = (draggedId: string, targetId: string) => {
    const draggedIndex = sections.findIndex(s => s.id === draggedId);
    const targetIndex = sections.findIndex(s => s.id === targetId);
    
    const newSections = [...sections];
    const [draggedSection] = newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, draggedSection);
    
    setSections(newSections);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Create New Resume</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <RoleSidebar 
          selectedRole={selectedRole}
          onRoleSelect={setSelectedRole}
        />

        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 border-r bg-muted/30">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <div
                      key={section.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', section.id);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('bg-accent/50');
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove('bg-accent/50');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('bg-accent/50');
                        const draggedId = e.dataTransfer.getData('text/plain');
                        handleSectionReorder(draggedId, section.id);
                      }}
                    >
                      <Button
                        variant={activeSection === section.id ? 'secondary' : 'ghost'}
                        className="w-full justify-start cursor-move"
                        onClick={() => setActiveSection(section.id)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {section.name}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          <div className="flex-1 flex flex-col">
            <Tabs defaultValue="edit" className="flex-1">
              <div className="border-b">
                <TabsList className="ml-4">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="edit" className="h-full m-0">
                  <ResumeEditor 
                    activeSection={activeSection}
                    selectedRole={selectedRole}
                    sections={sections}
                  />
                </TabsContent>
                <TabsContent value="preview" className="h-full m-0">
                  <ResumePreview sections={sections} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}