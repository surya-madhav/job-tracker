import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Logger utility for jobs API
const jobsApiLogger = {
  info: (message: string, data?: any) => {
    console.log(`📋 Jobs API [INFO] ${message}`, data ? data : '');
  },
  error: (message: string, error?: any) => {
    console.error(`📋 Jobs API [ERROR] ${message}`, error ? error : '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`📋 Jobs API [WARN] ${message}`, data ? data : '');
  },
  debug: (message: string, data?: any) => {
    console.debug(`📋 Jobs API [DEBUG] ${message}`, data ? data : '');
  },
  metrics: (endpoint: string, method: string, duration: number, status: number) => {
    console.log(`📊 Jobs API [METRICS] ${method} ${endpoint} - Status: ${status} - Duration: ${duration.toFixed(2)}ms`);
  }
};

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all jobs for authenticated user
 *     tags: [Jobs]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: string
 *                       company:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                       status:
 *                         type: string
 *                         enum: [applied, interview, offer, rejected]
 *                       applicationDate:
 *                         type: string
 *                         format: date
 *                       url:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  const requestId = Math.random().toString(36).substring(7);
  const requestStartTime = performance.now();
  
  jobsApiLogger.info(`Fetching jobs started [RequestID: ${requestId}]`);

  try {
    // Auth check
    const sessionStartTime = performance.now();
    const session = await getSession();
    const sessionDuration = performance.now() - sessionStartTime;
    
    jobsApiLogger.debug('Session verification completed', {
      requestId,
      duration: `${sessionDuration.toFixed(2)}ms`,
      authenticated: !!session?.id
    });

    if (!session?.id) {
      jobsApiLogger.warn('Unauthorized access attempt', { requestId });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Database query
    const queryStartTime = performance.now();
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
    const queryDuration = performance.now() - queryStartTime;

    jobsApiLogger.debug('Database query completed', {
      requestId,
      duration: `${queryDuration.toFixed(2)}ms`,
      jobsCount: jobs.length
    });

    // Format response
    const formattedJobs = jobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: {
        name: job.company_name
      },
      status: job.status,
      applicationDate: job.application_date,
      url: job.url,
    }));

    jobsApiLogger.info('Jobs fetched successfully', {
      requestId,
      userId: session.id,
      jobsCount: formattedJobs.length
    });

    const totalDuration = performance.now() - requestStartTime;
    jobsApiLogger.metrics('/api/jobs', 'GET', totalDuration, 200);

    return NextResponse.json({ jobs: formattedJobs });
  } catch (error) {
    const totalDuration = performance.now() - requestStartTime;
    
    jobsApiLogger.error('Failed to fetch jobs', {
      requestId,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : error
    });

    jobsApiLogger.metrics('/api/jobs', 'GET', totalDuration, 500);

    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job entry
 *     tags: [Jobs]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - companyId
 *               - status
 *               - applicationDate
 *             properties:
 *               title:
 *                 type: string
 *               companyId:
 *                 type: string
 *                 format: uuid
 *               url:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [applied, interview, offer, rejected]
 *               applicationDate:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 job:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     title:
 *                       type: string
 *                     companyId:
 *                       type: string
 *                     status:
 *                       type: string
 *                     applicationDate:
 *                       type: string
 *                     url:
 *                       type: string
 *                     notes:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
  const requestId = Math.random().toString(36).substring(7);
  const requestStartTime = performance.now();
  
  jobsApiLogger.info(`Creating job started [RequestID: ${requestId}]`);

  try {
    // Auth check
    const sessionStartTime = performance.now();
    const session = await getSession();
    const sessionDuration = performance.now() - sessionStartTime;
    
    jobsApiLogger.debug('Session verification completed', {
      requestId,
      duration: `${sessionDuration.toFixed(2)}ms`,
      authenticated: !!session?.id
    });

    if (!session?.id) {
      jobsApiLogger.warn('Unauthorized job creation attempt', { requestId });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const {
      title,
      companyId,
      url,
      status,
      applicationDate,
      notes
    } = await request.json();

    jobsApiLogger.debug('Request payload received', {
      requestId,
      jobData: {
        title,
        companyId,
        status,
        applicationDate,
        hasNotes: !!notes
      }
    });

    // Validate required fields
    const requiredFields = ['title', 'companyId', 'status', 'applicationDate'];
    const missingFields = requiredFields.filter(field => !eval(field));
    
    if (missingFields.length > 0) {
      jobsApiLogger.warn('Missing required fields', {
        requestId,
        missingFields
      });
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create job
    const db = await getDb();
    const jobId = crypto.randomUUID();
    const insertStartTime = performance.now();

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

    const insertDuration = performance.now() - insertStartTime;

    jobsApiLogger.debug('Database insert completed', {
      requestId,
      duration: `${insertDuration.toFixed(2)}ms`,
      jobId
    });

    jobsApiLogger.info('Job created successfully', {
      requestId,
      userId: session.id,
      jobId,
      title
    });

    const totalDuration = performance.now() - requestStartTime;
    jobsApiLogger.metrics('/api/jobs', 'POST', totalDuration, 200);

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
    const totalDuration = performance.now() - requestStartTime;
    
    jobsApiLogger.error('Failed to create job', {
      requestId,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : error
    });

    jobsApiLogger.metrics('/api/jobs', 'POST', totalDuration, 500);

    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}