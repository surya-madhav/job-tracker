import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
interface Job {
  id: string;
  title: string;
  company_name: string;
  status: string;
  application_date: string;
  url: string;
}

interface Session {
  id: string;
}
export async function GET() {
  try {
    const session = await getSession() as Session | null;
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const jobs = await db.all(`
      SELECT 
        j.*,
        c.name as company_name
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.user_id = ?
      ORDER BY j.application_date DESC
    `, [session.id]);

    const formattedJobs = jobs.map((job: Job) => ({
      id: job.id,
      title: job.title,
      company: {
        name: job.company_name
      },
      status: job.status,
      applicationDate: job.application_date,
      url: job.url,
    }));

    return NextResponse.json({ jobs: formattedJobs });
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
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

    const {
      title,
      companyId,
      url,
      status,
      applicationDate,
      notes
    } = await request.json();

    const db = await getDb();
    const jobId = crypto.randomUUID();

    await db.run(`
      INSERT INTO jobs (
        id,
        user_id,
        company_id,
        title,
        url,
        status,
        application_date,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      jobId,
      session.id,
      companyId,
      title,
      url,
      status,
      applicationDate,
      notes
    ]);

    return NextResponse.json({
      success: true,
      job: {
        id: jobId,
        title,
        companyId,
        url,
        status,
        applicationDate,
        notes,
      }
    });
  } catch (error) {
    console.error('Failed to create job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}