import { NextResponse, userAgent } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { JobStatus } from '@prisma/client';

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

export async function GET(request: Request) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as JobStatus | null;
    const title = searchParams.get('title');
    const companyId = searchParams.get('companyId');
    console.log("session", session);
    // Database query
    const queryStartTime = performance.now();
    const jobs = await prisma.job.findMany({
      where: {
        userId: session.id,
        ...(status && { status }),
        ...(title && {
          title: {
            contains: title,
            mode: 'insensitive'
          }
        }),
        ...(companyId && { companyId })
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            website: true,
          }
        },
        resume: {
          select: {
            id: true,
            name: true,
            fileUrl: true,
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    const queryDuration = performance.now() - queryStartTime;

    jobsApiLogger.debug('Database query completed', {
      requestId,
      duration: `${queryDuration.toFixed(2)}ms`,
      jobsCount: jobs.length
    });

    jobsApiLogger.info('Jobs fetched successfully', {
      requestId,
      userId: session.id,
      jobsCount: jobs.length
    });

    const totalDuration = performance.now() - requestStartTime;
    jobsApiLogger.metrics('/api/jobs', 'GET', totalDuration, 200);

    return NextResponse.json({ jobs });
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
    jobsApiLogger.debug('Request payload received', {request})

    if (!session?.id) {
      jobsApiLogger.warn('Unauthorized job creation attempt', { requestId });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobData = await request.json();

    jobsApiLogger.debug('Request payload received', {
      requestId,
      jobData: {
        title: jobData.title,
        companyId: jobData.companyId,
        status: jobData.status,
        applicationDate: jobData.applicationDate,
        hasNotes: !!jobData.notes
      }
    });

    // Validate required fields
    const requiredFields = ['title', 'companyId', 'status'];
    const missingFields = requiredFields.filter(field => !jobData[field]);
    
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

    // Create job using Prisma
    const insertStartTime = performance.now();
    jobsApiLogger.debug('Session', session);
    console.log("jobData", jobData);
    const job = await prisma.job.create({
      data: {
        title: jobData.title,
        companyId: jobData.companyId,
        url: jobData.url,
        status: jobData.status,
        applicationDate: jobData.applicationDate,
        resumeId: jobData.resumeId,
        notes: jobData.notes,
        userId: session.id,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            website: true,
          }
        },
        resume: {
          select: {
            id: true,
            name: true,
            fileUrl: true,
          }
        }
      }
    });

    const insertDuration = performance.now() - insertStartTime;

    jobsApiLogger.debug('Database insert completed', {
      requestId,
      duration: `${insertDuration.toFixed(2)}ms`,
      jobId: job.id
    });

    jobsApiLogger.info('Job created successfully', {
      requestId,
      userId: session.id,
      jobId: job.id,
      title: job.title
    });

    const totalDuration = performance.now() - requestStartTime;
    jobsApiLogger.metrics('/api/jobs', 'POST', totalDuration, 200);

    return NextResponse.json({
      success: true,
      job
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