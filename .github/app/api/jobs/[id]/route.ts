import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const job = await db.get(
      `SELECT * FROM jobs WHERE id = ?`,
      [params.id]
    );

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Failed to fetch job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const db = await getDb();
    
    await db.run(
      `UPDATE jobs 
       SET title = ?, company = ?, location = ?, url = ?, status = ?, notes = ?, 
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [body.title, body.company, body.location, body.url, body.status, body.notes, params.id]
    );

    const updatedJob = await db.get('SELECT * FROM jobs WHERE id = ?', [params.id]);
    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error('Failed to update job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    await db.run('DELETE FROM jobs WHERE id = ?', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}