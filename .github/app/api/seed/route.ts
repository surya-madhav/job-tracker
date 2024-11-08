import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const db = await getDb();
    
    // Verify tables exist
    const tables = await db.all(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name IN ('users', 'jobs', 'companies', 'contacts')
    `);

    // Get table counts
    const counts = await Promise.all(
      ['users', 'jobs', 'companies', 'contacts'].map(async (table) => {
        const result = await db.get(`SELECT COUNT(*) as count FROM ${table}`);
        return { table, count: result.count };
      })
    );
    return NextResponse.json({
      status: 'success',
      message: 'Database initialized and seeded successfully',
      tables: tables.map((t:{name:string}) => t.name),
      counts
    });

    
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to initialize database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}