import { NextResponse } from 'next/server';
import { getApiDocs } from '@/lib/swagger';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(getApiDocs());
}