'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ),
});

export default function ApiDocs() {
  return (
    <div className="container mx-auto p-4">
      <SwaggerUI url="/api/docs" />
    </div>
  );
}