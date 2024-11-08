import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const jobs = await db.all(
      `SELECT id, title, status, application_date 
       FROM jobs 
       WHERE company_id = ?
       ORDER BY application_date DESC`,
      [params.id]
    );

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Failed to fetch company jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}