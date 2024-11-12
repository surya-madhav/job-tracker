'use client';

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Globe, Building2, Briefcase, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { CompanyWithRelations } from '@/types/company.types';
import { JobStatus } from '@prisma/client';

export function CompanyGrid({ companies }: { companies: CompanyWithRelations[] }) {
  const getActiveJobsCount = (company: CompanyWithRelations) => {
    return company.jobs?.filter(job => 
      job.status === JobStatus.APPLIED || 
      job.status === JobStatus.INTERVIEWING
    ).length || 0;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatWebsiteUrl = (website: string | null) => {
    if (!website) return '';
    try {
      const url = new URL(website);
      return url.hostname.replace('www.', '');
    } catch {
      return website;
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {companies.map((company) => (
        <Card key={company.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10">
                  {getInitials(company.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <CardTitle className="line-clamp-1">{company.name}</CardTitle>
                {company.industry && (
                  <Badge variant="secondary">{company.industry}</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {company.notes && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {company.notes}
                </p>
              )}
              
              <div className="space-y-2">
                {company.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    {company.location}
                  </div>
                )}
                {company.industry && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="mr-2 h-4 w-4" />
                    {company.industry}
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Globe className="mr-2 h-4 w-4" />
                    <a 
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {formatWebsiteUrl(company.website)}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t">
                <div className="flex items-center text-sm">
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{getActiveJobsCount(company)} active jobs</span>
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