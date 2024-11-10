import { getDb } from './index';

// Logger utility for jobs database operations
const jobsDbLogger = {
  info: (message: string, data?: any) => {
    console.log(`🗄️ Jobs DB [INFO] ${message}`, data ? data : '');
  },
  error: (message: string, error?: any) => {
    console.error(`🗄️ Jobs DB [ERROR] ${message}`, error ? error : '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`🗄️ Jobs DB [WARN] ${message}`, data ? data : '');
  },
  debug: (message: string, data?: any) => {
    console.debug(`🗄️ Jobs DB [DEBUG] ${message}`, data ? data : '');
  },
  metrics: (operation: string, duration: number, success: boolean) => {
    console.log(
      `📊 Jobs DB [METRICS] ${operation} - Duration: ${duration.toFixed(2)}ms - Status: ${success ? 'Success' : 'Failed'}`
    );
  }
};

export interface JobData {
  user_id: string;
  company_id: string;
  title: string;
  url?: string;
  status: 'Saved' | 'Applied' | 'Interviewing' | 'Offered' | 'Rejected';
  application_date?: string;
  resume_id?: string;
  notes?: string;
}

export interface Job extends JobData {
  id: string;
  created_at: string;
  updated_at: string;
}

export async function getJobs(userId: string): Promise<Job[]> {
  const operationId = Math.random().toString(36).substring(7);
  const startTime = performance.now();

  jobsDbLogger.info(`Fetching all jobs for user [OperationID: ${operationId}]`, {
    userId: userId
  });

  try {
    const db = await getDb();
    const jobs = await db.all('SELECT * FROM jobs WHERE user_id = ?', [userId]);
    
    const duration = performance.now() - startTime;
    jobsDbLogger.debug('Jobs fetch completed', {
      operationId,
      userId,
      jobsCount: jobs.length,
      duration: `${duration.toFixed(2)}ms`
    });

    jobsDbLogger.metrics('GET_ALL_JOBS', duration, true);
    return jobs;
  } catch (error) {
    const duration = performance.now() - startTime;
    jobsDbLogger.error(`Failed to fetch jobs for user ${userId}`, {
      operationId,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : error
    });

    jobsDbLogger.metrics('GET_ALL_JOBS', duration, false);
    throw error;
  }
}

export async function createJob(data: JobData): Promise<Job> {
  const operationId = Math.random().toString(36).substring(7);
  const startTime = performance.now();
  const id = crypto.randomUUID();

  jobsDbLogger.info(`Creating new job [OperationID: ${operationId}]`, {
    jobId: id,
    userId: data.user_id,
    title: data.title
  });

  try {
    const db = await getDb();
    
    jobsDbLogger.debug('Inserting job data', {
      operationId,
      jobData: {
        id,
        title: data.title,
        company_id: data.company_id,
        status: data.status,
        hasUrl: !!data.url,
        hasResumeId: !!data.resume_id,
        hasNotes: !!data.notes
      }
    });

    await db.run(`
      INSERT INTO jobs (
        id, user_id, company_id, title, url, status, 
        application_date, resume_id, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      data.user_id,
      data.company_id,
      data.title,
      data.url,
      data.status,
      data.application_date,
      data.resume_id,
      data.notes
    ]);

    const job = await getJobById(id);
    if (!job) {
      throw new Error('Failed to fetch created job');
    }

    const duration = performance.now() - startTime;
    jobsDbLogger.info('Job created successfully', {
      operationId,
      jobId: id,
      userId: data.user_id
    });

    jobsDbLogger.metrics('CREATE_JOB', duration, true);
    return job;
  } catch (error) {
    const duration = performance.now() - startTime;
    jobsDbLogger.error('Failed to create job', {
      operationId,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : error,
      jobData: {
        id,
        title: data.title,
        company_id: data.company_id,
        status: data.status
      }
    });

    jobsDbLogger.metrics('CREATE_JOB', duration, false);
    throw error;
  }
}

export async function getJobById(id: string): Promise<Job | undefined> {
  const operationId = Math.random().toString(36).substring(7);
  const startTime = performance.now();

  jobsDbLogger.info(`Fetching job by ID [OperationID: ${operationId}]`, {
    jobId: id
  });

  try {
    const db = await getDb();
    const job = await db.get('SELECT * FROM jobs WHERE id = ?', [id]);

    const duration = performance.now() - startTime;
    jobsDbLogger.debug('Job fetch completed', {
      operationId,
      jobId: id,
      found: !!job,
      duration: `${duration.toFixed(2)}ms`
    });

    jobsDbLogger.metrics('GET_JOB_BY_ID', duration, true);
    return job;
  } catch (error) {
    const duration = performance.now() - startTime;
    jobsDbLogger.error(`Failed to fetch job ${id}`, {
      operationId,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : error
    });

    jobsDbLogger.metrics('GET_JOB_BY_ID', duration, false);
    throw error;
  }
}

export async function updateJob(id: string, data: Partial<JobData>): Promise<Job | undefined> {
  const operationId = Math.random().toString(36).substring(7);
  const startTime = performance.now();

  jobsDbLogger.info(`Updating job [OperationID: ${operationId}]`, {
    jobId: id,
    updatedFields: Object.keys(data)
  });

  try {
    const db = await getDb();
    const fields = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(', ');
    
    jobsDbLogger.debug('Update query details', {
      operationId,
      jobId: id,
      updateFields: fields,
      updateData: data
    });

    await db.run(
      `UPDATE jobs SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...Object.values(data), id]
    );

    const updatedJob = await getJobById(id);
    if (!updatedJob) {
      throw new Error('Failed to fetch updated job');
    }

    const duration = performance.now() - startTime;
    jobsDbLogger.info('Job updated successfully', {
      operationId,
      jobId: id,
      updatedFields: Object.keys(data)
    });

    jobsDbLogger.metrics('UPDATE_JOB', duration, true);
    return updatedJob;
  } catch (error) {
    const duration = performance.now() - startTime;
    jobsDbLogger.error(`Failed to update job ${id}`, {
      operationId,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : error,
      updateData: {
        id,
        ...data
      }
    });

    jobsDbLogger.metrics('UPDATE_JOB', duration, false);
    throw error;
  }
}

export async function deleteJob(id: string): Promise<void> {
  const operationId = Math.random().toString(36).substring(7);
  const startTime = performance.now();

  jobsDbLogger.info(`Deleting job [OperationID: ${operationId}]`, {
    jobId: id
  });

  try {
    const db = await getDb();
    
    // First verify the job exists
    const existingJob = await getJobById(id);
    if (!existingJob) {
      jobsDbLogger.warn('Attempted to delete non-existent job', {
        operationId,
        jobId: id
      });
      return;
    }

    await db.run('DELETE FROM jobs WHERE id = ?', [id]);

    const duration = performance.now() - startTime;
    jobsDbLogger.info('Job deleted successfully', {
      operationId,
      jobId: id,
      previousData: {
        title: existingJob.title,
        company_id: existingJob.company_id,
        status: existingJob.status
      }
    });

    jobsDbLogger.metrics('DELETE_JOB', duration, true);
  } catch (error) {
    const duration = performance.now() - startTime;
    jobsDbLogger.error(`Failed to delete job ${id}`, {
      operationId,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : error
    });

    jobsDbLogger.metrics('DELETE_JOB', duration, false);
    throw error;
  }
}