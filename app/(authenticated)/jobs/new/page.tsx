'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddApplicationForm } from '@/components/forms/add-application-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function NewJobPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Redirect if not authenticated
  if (!isLoading && !user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Add New Application</h1>
      </div>

      <div className="max-w-2xl">
        <AddApplicationForm />
      </div>
    </div>
  );
}