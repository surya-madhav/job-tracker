'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Minus, ChevronDown, ChevronRight } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function SkillsEditor() {
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setOpenCategories(
      openCategories.includes(id)
        ? openCategories.filter((i) => i !== id)
        : [...openCategories, id]
    );
  };

  const [categories] = useState([
    {
      id: '1',
      name: 'Programming Languages',
      skills: [
        { id: '1', name: 'Java', include: true },
        { id: '2', name: 'GoLang', include: true },
        { id: '3', name: 'JavaScript', include: true },
        { id: '4', name: 'TypeScript', include: true },
        { id: '5', name: 'Python', include: true },
      ],
      include: true,
    },
    {
      id: '2',
      name: 'Database Technologies',
      skills: [
        { id: '6', name: 'MySQL', include: true },
        { id: '7', name: 'MongoDB', include: true },
        { id: '8', name: 'PostgreSQL', include: true },
      ],
      include: true,
    },
  ]);

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="flex items-center gap-2">
                <Checkbox checked={category.include} />
                {category.name}
              </CardTitle>
              <Button variant="ghost" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input defaultValue={category.name} />
            </div>

            <Collapsible
              open={openCategories.includes(category.id)}
              onOpenChange={() => toggleCategory(category.id)}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  Skills
                  {openCategories.includes(category.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                {category.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-2">
                    <Checkbox checked={skill.include} />
                    <Input defaultValue={skill.name} />
                    <Button variant="ghost" size="icon">
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      ))}

      <Button className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Category
      </Button>
    </div>
  );
}