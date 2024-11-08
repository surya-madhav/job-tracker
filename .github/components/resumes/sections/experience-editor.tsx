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

interface Achievement {
  id: string;
  description: string;
  boldKeywords: string[];
  include: boolean;
}

interface Experience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  achievements: Achievement[];
  include: boolean;
}

export function ExperienceEditor() {
  const [openAchievements, setOpenAchievements] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      company: 'Sensei Technologies - Kaleidofin',
      title: 'Software Engineer',
      location: 'Bangalore, India',
      startDate: 'September 2020',
      endDate: 'April 2023',
      achievements: [
        {
          id: '1',
          description: 'Excelled in rapid prototyping using AngularJS - Typescript and Spring Boot - Java, improving feature delivery by 40%.',
          boldKeywords: ['AngularJS', 'Typescript', 'Spring Boot', 'Java'],
          include: true,
        },
        {
          id: '2',
          description: 'Developed data visualizations for loan management using D3.js with real-time data from RESTful APIs.',
          boldKeywords: ['D3.js', 'RESTful APIs'],
          include: true,
        },
      ],
      include: true,
    },
  ]);

  const toggleAchievements = (id: string) => {
    setOpenAchievements(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAchievementReorder = (experienceId: string, sourceIndex: number, destinationIndex: number) => {
    setExperiences(prev => prev.map(exp => {
      if (exp.id === experienceId) {
        const newAchievements = [...exp.achievements];
        const [removed] = newAchievements.splice(sourceIndex, 1);
        newAchievements.splice(destinationIndex, 0, removed);
        return { ...exp, achievements: newAchievements };
      }
      return exp;
    }));
  };

  const addAchievement = (experienceId: string) => {
    setExperiences(prev => prev.map(exp => {
      if (exp.id === experienceId) {
        return {
          ...exp,
          achievements: [
            ...exp.achievements,
            {
              id: crypto.randomUUID(),
              description: '',
              boldKeywords: [],
              include: true,
            },
          ],
        };
      }
      return exp;
    }));
  };

  const updateAchievement = (experienceId: string, achievementId: string, field: keyof Achievement, value: any) => {
    setExperiences(prev => prev.map(exp => {
      if (exp.id === experienceId) {
        return {
          ...exp,
          achievements: exp.achievements.map(ach => {
            if (ach.id === achievementId) {
              return { ...ach, [field]: value };
            }
            return ach;
          }),
        };
      }
      return exp;
    }));
  };

  const removeAchievement = (experienceId: string, achievementId: string) => {
    setExperiences(prev => prev.map(exp => {
      if (exp.id === experienceId) {
        return {
          ...exp,
          achievements: exp.achievements.filter(ach => ach.id !== achievementId),
        };
      }
      return exp;
    }));
  };

  return (
    <div className="space-y-4">
      {experiences.map((exp) => (
        <Card key={exp.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="flex items-center gap-2">
                <Checkbox 
                  checked={exp.include}
                  onCheckedChange={(checked) => {
                    setExperiences(prev => prev.map(e => 
                      e.id === exp.id ? { ...e, include: checked as boolean } : e
                    ));
                  }}
                />
                Experience Entry
              </CardTitle>
              <Button variant="ghost" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company</Label>
                <Input 
                  value={exp.company}
                  onChange={(e) => setExperiences(prev => prev.map(e => 
                    e.id === exp.id ? { ...e, company: e.target.value } : e
                  ))}
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={exp.title}
                  onChange={(e) => setExperiences(prev => prev.map(e => 
                    e.id === exp.id ? { ...e, title: e.target.value } : e
                  ))}
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input 
                  value={exp.location}
                  onChange={(e) => setExperiences(prev => prev.map(e => 
                    e.id === exp.id ? { ...e, location: e.target.value } : e
                  ))}
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input 
                  value={exp.startDate}
                  onChange={(e) => setExperiences(prev => prev.map(e => 
                    e.id === exp.id ? { ...e, startDate: e.target.value } : e
                  ))}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input 
                  value={exp.endDate}
                  onChange={(e) => setExperiences(prev => prev.map(e => 
                    e.id === exp.id ? { ...e, endDate: e.target.value } : e
                  ))}
                />
              </div>
            </div>

            <Collapsible
              open={openAchievements.includes(exp.id)}
              onOpenChange={() => toggleAchievements(exp.id)}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  Achievements
                  {openAchievements.includes(exp.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Search Achievements</Label>
                  <SearchCombobox
                    items={exp.achievements.map(ach => ({
                      value: ach.id,
                      label: ach.description,
                    }))}
                    placeholder="Search achievements..."
                    onSelect={(value) => {
                      const achievement = exp.achievements.find(ach => ach.id === value);
                      if (achievement) {
                        // Scroll to achievement
                        document.getElementById(`achievement-${value}`)?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'center',
                        });
                      }
                    }}
                  />
                </div>

                <DndList
                  items={exp.achievements}
                  onReorder={(sourceIndex, destinationIndex) => 
                    handleAchievementReorder(exp.id, sourceIndex, destinationIndex)
                  }
                  droppableId={`achievements-${exp.id}`}
                  renderItem={(achievement, index) => (
                    <div 
                      id={`achievement-${achievement.id}`}
                      className="space-y-2 bg-muted/50 p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        <Checkbox 
                          checked={achievement.include}
                          onCheckedChange={(checked) => {
                            updateAchievement(exp.id, achievement.id, 'include', checked);
                          }}
                        />
                        <Label>Achievement {index + 1}</Label>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="ml-auto"
                          onClick={() => removeAchievement(exp.id, achievement.id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={achievement.description}
                        onChange={(e) => updateAchievement(
                          exp.id,
                          achievement.id,
                          'description',
                          e.target.value
                        )}
                        className="min-h-[100px]"
                      />
                      <div className="space-y-2">
                        <Label>Bold Keywords (comma-separated)</Label>
                        <Input
                          value={achievement.boldKeywords.join(', ')}
                          onChange={(e) => updateAchievement(
                            exp.id,
                            achievement.id,
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
                  onClick={() => addAchievement(exp.id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Achievement
                </Button>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      ))}

      <Button 
        className="w-full"
        onClick={() => setExperiences(prev => [...prev, {
          id: crypto.randomUUID(),
          company: '',
          title: '',
          location: '',
          startDate: '',
          endDate: '',
          achievements: [],
          include: true,
        }])}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Experience
      </Button>
    </div>
  );
}