import { Company, Job, Contact } from '@prisma/client';

export interface CreateCompanyDTO {
  name: string;
  website?: string | null;
  industry?: string | null;
  location?: string | null;
  notes?: string | null;
}

export interface UpdateCompanyDTO extends Partial<CreateCompanyDTO> {
  id: string;
}

export interface CompanyQuery {
  search?: string;
  industry?: string;
}

export interface CompanyStats {
  totalJobs: number;
  activeJobs: number;
  successfulJobs: number;
  successRate: number;
}

export interface CompanyWithRelations extends Company {
  jobs?: Pick<Job, 'id' | 'title' | 'status' | 'applicationDate' | 'url' | 'notes'>[];
  contacts?: Pick<Contact, 'id' | 'name' | 'position' | 'email' | 'phone' | 'linkedinUrl'>[];
  _count?: {
    jobs: number;
    contacts: number;
  };
}

export interface CompanyListItem extends Company {
  _count: {
    jobs: number;
  };
  jobs?: Pick<Job, 'id' | 'title' | 'status' | 'applicationDate'>[];
}