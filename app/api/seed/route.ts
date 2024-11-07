import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await seedDatabase();
    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Failed to seed database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}