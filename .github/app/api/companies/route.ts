import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const companies = await db.all(`
      SELECT DISTINCT c.* 
      FROM companies c 
      LEFT JOIN jobs j ON c.id = j.company_id 
      WHERE j.user_id = ? OR c.id IN (
        SELECT company_id FROM contacts WHERE user_id = ?
      )
      ORDER BY c.name ASC
    `, [session.id, session.id]);

    return NextResponse.json({ companies });
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, website, industry, location, notes } = await request.json();
    const db = await getDb();

    const companyId = crypto.randomUUID();
    await db.run(`
      INSERT INTO companies (
        id, name, website, industry, location, notes
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [companyId, name, website, industry, location, notes]);

    return NextResponse.json({ 
      success: true,
      company: {
        id: companyId,
        name,
        website,
        industry,
        location,
        notes,
      }
    });
  } catch (error) {
    console.error('Failed to create company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}