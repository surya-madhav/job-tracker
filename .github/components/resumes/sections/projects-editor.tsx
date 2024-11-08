'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { SearchCombobox } from '@/components/ui/search-combobox';
import { DndList } from '@/components/ui/dnd-list';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface Description {
  id: string;
  text: string;
  boldKeywords: string[];
  include: boolean;
}

interface Project {
  id: string;
  title: string;
  technologies: string[];
  link: string;
  descriptions: Description[];
  include: boolean;
}

export function ProjectsEditor() {
  const [openDescriptions, setOpenDescriptions] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Agentic RAG Architecture for Financial Reporting',
      technologies: ['Airflow', 'HuggingFace', 'Pinecone', 'LlamaIndex', 'Streamlit'],
      link: 'https://www.rssmv.in/projects/reportGen',
      descriptions: [
        {
          id: '1',
          text: 'Built automated data pipeline with Airflow for web scraping, multimodal processing, and embedding generation.',
          boldKeywords: ['Airflow', 'web scraping', 'embedding generation'],
          include: true,
        },
        {
          id: '2',
          text: 'Developed hybrid Agentic-Workflow Architecture for intelligent reporting.',
          boldKeywords: ['Agentic-Workflow Architecture'],
          include: true,
        },
      ],
      include: true,
    },
  ]);

  const toggleDescriptions = (id: string) => {
    setOpenDescriptions(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDescriptionReorder = (projectId: string, sourceIndex: number, destinationIndex: number) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        const newDescriptions = [...proj.descriptions];
        const [removed] = newDescriptions.splice(sourceIndex, 1);
        newDescriptions.splice(destinationIndex, 0, removed);
        return { ...proj, descriptions: newDescriptions };
      }
      return proj;
    }));
  };

  const addDescription = (projectId: string) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        return {
          ...proj,
          descriptions: [
            ...proj.descriptions,
            {
              id: crypto.randomUUID(),
              text: '',
              boldKeywords: [],
              include: true,
            },
          ],
        };
      }
      return proj;
    }));
  };

  const updateDescription = (projectId: string, descriptionId: string, field: keyof Description, value: any) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        return {
          ...proj,
          descriptions: proj.descriptions.map(desc => {
            if (desc.id === descriptionId) {
              return { ...desc, [field]: value };
            }
            return desc;
          }),
        };
      }
      return proj;
    }));
  };

  const removeDescription = (projectId: string, descriptionId: string) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        return {
          ...proj,
          descriptions: proj.descriptions.filter(desc => desc.id !== descriptionId),
        };
      }
      return proj;
    }));
  };

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="flex items-center gap-2">
                <Checkbox 
                  checked={project.include}
                  onCheckedChange={(checked) => {
                    setProjects(prev => prev.map(p => 
                      p.id === project.id ? { ...p, include: checked as boolean } : p
                    ));
                  }}
                />
                Project Entry
              </CardTitle>
              <Button variant="ghost" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Project Title</Label>
                <Input 
                  value={project.title}
                  onChange={(e) => setProjects(prev => prev.map(p => 
                    p.id === project.id ? { ...p, title: e.target.value } : p
                  ))}
                />
              </div>
              <div className="space-y-2">
                <Label>Project Link</Label>
                <Input 
                  value={project.link}
                  onChange={(e) => setProjects(prev => prev.map(p => 
                    p.id === project.id ? { ...p, link: e.target.value } : p
                  ))}
                />
              </div>
              <div className="space-y-2">
                <Label>Technologies (comma-separated)</Label>
                <Input 
                  value={project.technologies.join(', ')}
                  onChange={(e) => setProjects(prev => prev.map(p => 
                    p.id === project.id ? { ...p, technologies: e.target.value.split(',').map(t => t.trim()) } : p
                  ))}
                />
              </div>
            </div>

            <Collapsible
              open={openDescriptions.includes(project.id)}
              onOpenChange={() => toggleDescriptions(project.id)}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  Descriptions
                  {openDescriptions.includes(project.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Search Descriptions</Label>
                  <SearchCombobox
                    items={project.descriptions.map(desc => ({
                      value: desc.id,
                      label: desc.text,
                    }))}
                    placeholder="Search descriptions..."
                    onSelect={(value) => {
                      const description = project.descriptions.find(desc => desc.id === value);
                      if (description) {
                        // Scroll to description
                        document.getElementById(`description-${value}`)?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'center',
                        });
                      }
                    }}
                  />
                </div>

                <DndList
                  items={project.descriptions}
                  onReorder={(sourceIndex, destinationIndex) => 
                    handleDescriptionReorder(project.id, sourceIndex, destinationIndex)
                  }
                  droppableId={`descriptions-${project.id}`}
                  renderItem={(description, index) => (
                    <div 
                      id={`description-${description.id}`}
                      className="space-y-2 bg-muted/50 p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        <Checkbox 
                          checked={description.include}
                          onCheckedChange={(checked) => {
                            updateDescription(project.id, description.id, 'include', checked);
                          }}
                        />
                        <Label>Description {index + 1}</Label>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="ml-auto"
                          onClick={() => removeDescription(project.id, description.id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={description.text}
                        onChange={(e) => updateDescription(
                          project.id,
                          description.id,
                          'text',
                          e.target.value
                        )}
                        className="min-h-[100px]"
                      />
                      <div className="space-y-2">
                        <Label>Bold Keywords (comma-separated)</Label>
                        <Input
                          value={description.boldKeywords.join(', ')}
                          onChange={(e) => updateDescription(
                            project.id,
                            description.id,
                            'boldKeywords',
                            e.target.value.split(',').map(k => k.trim())
                          )}
                        />
                      </div>
                    </div>
                  )}
                />

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => addDescription(project.id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Description
                </Button>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      ))}

      <Button 
        className="w-full"
        onClick={() => setProjects(prev => [...prev, {
          id: crypto.randomUUID(),
          title: '',
          technologies: [],
          link: '',
          descriptions: [],
          include: true,
        }])}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Project
      </Button>
    </div>
  );
}