'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddCompanyForm } from '@/components/forms/add-company-form';
import { useRouter } from 'next/navigation';

export default function NewCompanyPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Add New Company</h1>
      </div>

      <div className="max-w-2xl">
        <AddCompanyForm />
      </div>
    </div>
  );
}