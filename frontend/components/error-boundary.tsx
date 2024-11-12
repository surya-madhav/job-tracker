'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-6 text-center">
        <div className="mb-8">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <Button onClick={resetErrorBoundary}>Try again</Button>
      </div>
    </div>
  );
}