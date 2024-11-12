import { NextResponse } from 'next/server';
import { JobService } from '@/services/job.service';
import { getSession } from '@/lib/auth';
import { UpdateJobDTO } from '@/types/jobs.type';

const jobService = new JobService();

const jobsApiLogger = {
  info: (message: string, data?: any) => {
    console.log(`📋 Jobs API [INFO] ${message}`, data ? data : '');
  },
  error: (message: string, error?: any) => {
    console.error(`📋 Jobs API [ERROR] ${message}`, error ? error : '');
  },
  metrics: (endpoint: string, method: string, duration: number, status: number) => {
    console.log(`📊 Jobs API [METRICS] ${method} ${endpoint} - Status: ${status} - Duration: ${duration.toFixed(2)}ms`);
  }
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const requestStartTime = performance.now();
  const requestId = Math.random().toString(36).substring(7);

  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const job = await jobService.findById(params.id, session.id);

    if (!job) {
      const totalDuration = performance.now() - requestStartTime;
      jobsApiLogger.metrics(`/api/jobs/${params.id}`, 'GET', totalDuration, 404);
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const totalDuration = performance.now() - requestStartTime;
    jobsApiLogger.metrics(`/api/jobs/${params.id}`, 'GET', totalDuration, 200);
    return NextResponse.json(job);
  } catch (error) {
    const totalDuration = performance.now() - requestStartTime;
    jobsApiLogger.error('Failed to fetch job:', {
      requestId,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : error
    });
    jobsApiLogger.metrics(`/api/jobs/${params.id}`, 'GET', totalDuration, 500);
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
  const requestStartTime = performance.now();
  const requestId = Math.random().toString(36).substring(7);

  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updateData: UpdateJobDTO = await request.json();

    // Check if job exists and belongs to user
    const existingJob = await jobService.findById(params.id, session.id);
    if (!existingJob) {
      const totalDuration = performance.now() - requestStartTime;
      jobsApiLogger.metrics(`/api/jobs/${params.id}`, 'PUT', totalDuration, 404);
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const updatedJob = await jobService.update(params.id, session.id, updateData);

    jobsApiLogger.info('Job updated successfully', {
      requestId,
      jobId: params.id,
      userId: session.id
    });

    const totalDuration = performance.now() - requestStartTime;
    jobsApiLogger.metrics(`/api/jobs/${params.id}`, 'PUT', totalDuration, 200);
    return NextResponse.json(updatedJob);
  } catch (error) {
    const totalDuration = performance.now() - requestStartTime;
    jobsApiLogger.error('Failed to update job:', {
      requestId,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : error
    });
    jobsApiLogger.metrics(`/api/jobs/${params.id}`, 'PUT', totalDuration, 500);
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
  const requestStartTime = performance.now();
  const requestId = Math.random().toString(36).substring(7);

  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if job exists and belongs to user
    const existingJob = await jobService.findById(params.id, session.id);
    if (!existingJob) {
      const totalDuration = performance.now() - requestStartTime;
      jobsApiLogger.metrics(`/api/jobs/${params.id}`, 'DELETE', totalDuration, 404);
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    await jobService.delete(params.id, session.id);

    jobsApiLogger.info('Job deleted successfully', {
      requestId,
      jobId: params.id,
      userId: session.id
    });

    const totalDuration = performance.now() - requestStartTime;
    jobsApiLogger.metrics(`/api/jobs/${params.id}`, 'DELETE', totalDuration, 200);
    return NextResponse.json({ success: true });
  } catch (error) {
    const totalDuration = performance.now() - requestStartTime;
    jobsApiLogger.error('Failed to delete job:', {
      requestId,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : error
    });
    jobsApiLogger.metrics(`/api/jobs/${params.id}`, 'DELETE', totalDuration, 500);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}