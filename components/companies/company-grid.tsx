'use client';

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Globe, Users, Briefcase, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  size: string;
  website: string;
  activeJobs: number;
  contacts: number;
  description: string;
}

export function CompanyGrid({ companies }: { companies: Company[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {companies.map((company) => (
        <Card key={company.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={company.logo} alt={company.name} />
                <AvatarFallback>{company.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <CardTitle className="line-clamp-1">{company.name}</CardTitle>
                <Badge variant="secondary">{company.industry}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {company.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {company.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  {company.size} employees
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Globe className="mr-2 h-4 w-4" />
                  <a 
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {new URL(company.website).hostname}
                  </a>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <div className="flex items-center text-sm">
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{company.activeJobs} active jobs</span>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/companies/${company.id}`}>
                    View Details
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}