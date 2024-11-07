import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const company = await db.get(
      'SELECT * FROM companies WHERE id = ?',
      [params.id]
    );

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Failed to fetch company:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}