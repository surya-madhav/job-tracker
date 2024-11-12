import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    await db.get('SELECT 1');
    return NextResponse.json({ status: 'Database is running' });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    );
  }
}