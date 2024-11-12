'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GripVertical, Plus, X } from 'lucide-react';

interface Course {
  course_id: string;
  course_name: string;
}

interface Education {
  education_id: string;
  degree: string;
  university: string;
  location: string;
  start_date: string;
  end_date: string;
  gpa: string;
  relevant_coursework: Course[];
  include: boolean;
}

export function EducationEditor() {
  const [education, setEducation] = useState<Education[]>([
    {
      education_id: '1',
      degree: 'Master of Science in Information Systems',
      university: 'Northeastern University',
      location: 'Boston, MA',
      start_date: 'September 2023',
      end_date: 'May 2025',
      gpa: '3.5/4',
      relevant_coursework: [
        { course_id: '1', course_name: 'Data Management & Data Design' },
        { course_id: '2', course_name: 'Network Structure & Cloud Computing' },
        { course_id: '3', course_name: 'Data Science' },
        { course_id: '4', course_name: 'Big-Data Systems and Intelligence Analytics' },
        { course_id: '5', course_name: 'High-Performance Parallel Machine Learning and AI' }
      ],
      include: true
    }
  ]);

  const updateEducationField = (id: string, field: keyof Education, value: string) => {
    setEducation(prevEducation =>
      prevEducation.map(edu =>
        edu.education_id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const handleCourseReorder = (educationId: string, draggedId: string, targetId: string) => {
    setEducation(prevEducation => {
      return prevEducation.map(edu => {
        if (edu.education_id === educationId) {
          const courses = [...edu.relevant_coursework];
          const draggedIndex = courses.findIndex(c => c.course_id === draggedId);
          const targetIndex = courses.findIndex(c => c.course_id === targetId);
          const [draggedCourse] = courses.splice(draggedIndex, 1);
          courses.splice(targetIndex, 0, draggedCourse);
          return { ...edu, relevant_coursework: courses };
        }
        return edu;
      });
    });
  };

  const addCourse = (educationId: string) => {
    setEducation(prevEducation => {
      return prevEducation.map(edu => {
        if (edu.education_id === educationId) {
          return {
            ...edu,
            relevant_coursework: [
              ...edu.relevant_coursework,
              {
                course_id: crypto.randomUUID(),
                course_name: ''
              }
            ]
          };
        }
        return edu;
      });
    });
  };

  const updateCourse = (educationId: string, courseId: string, courseName: string) => {
    setEducation(prevEducation => {
      return prevEducation.map(edu => {
        if (edu.education_id === educationId) {
          return {
            ...edu,
            relevant_coursework: edu.relevant_coursework.map(course => {
              if (course.course_id === courseId) {
                return { ...course, course_name: courseName };
              }
              return course;
            })
          };
        }
        return edu;
      });
    });
  };

  const removeCourse = (educationId: string, courseId: string) => {
    setEducation(prevEducation => {
      return prevEducation.map(edu => {
        if (edu.education_id === educationId) {
          return {
            ...edu,
            relevant_coursework: edu.relevant_coursework.filter(
              course => course.course_id !== courseId
            )
          };
        }
        return edu;
      });
    });
  };

  return (
    <div className="space-y-6">
      {education.map(edu => (
        <Card key={edu.education_id}>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Checkbox
              checked={edu.include}
              onCheckedChange={(checked) => {
                setEducation(prevEducation =>
                  prevEducation.map(e =>
                    e.education_id === edu.education_id
                      ? { ...e, include: checked as boolean }
                      : e
                  )
                );
              }}
            />
            <CardTitle>Education Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`degree-${edu.education_id}`}>Degree</Label>
                <Input
                  id={`degree-${edu.education_id}`}
                  value={edu.degree}
                  onChange={(e) => updateEducationField(edu.education_id, 'degree', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`university-${edu.education_id}`}>University</Label>
                <Input
                  id={`university-${edu.education_id}`}
                  value={edu.university}
                  onChange={(e) => updateEducationField(edu.education_id, 'university', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`location-${edu.education_id}`}>Location</Label>
                <Input
                  id={`location-${edu.education_id}`}
                  value={edu.location}
                  onChange={(e) => updateEducationField(edu.education_id, 'location', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`gpa-${edu.education_id}`}>GPA</Label>
                <Input
                  id={`gpa-${edu.education_id}`}
                  value={edu.gpa}
                  onChange={(e) => updateEducationField(edu.education_id, 'gpa', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`start_date-${edu.education_id}`}>Start Date</Label>
                <Input
                  id={`start_date-${edu.education_id}`}
                  value={edu.start_date}
                  onChange={(e) => updateEducationField(edu.education_id, 'start_date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`end_date-${edu.education_id}`}>End Date</Label>
                <Input
                  id={`end_date-${edu.education_id}`}
                  value={edu.end_date}
                  onChange={(e) => updateEducationField(edu.education_id, 'end_date', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Relevant Coursework</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addCourse(edu.education_id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </div>

              <div className="space-y-2">
                {edu.relevant_coursework.map(course => (
                  <div
                    key={course.course_id}
                    className="flex items-center gap-2"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', course.course_id);
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
                      handleCourseReorder(edu.education_id, draggedId, course.course_id);
                    }}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <Input
                      value={course.course_name}
                      onChange={(e) =>
                        updateCourse(edu.education_id, course.course_id, e.target.value)
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCourse(edu.education_id, course.course_id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}