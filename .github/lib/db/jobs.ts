import { getDb } from './index';

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
  const db = await getDb();
  return db.all('SELECT * FROM jobs WHERE user_id = ?', [userId]);
}

export async function createJob(data: JobData): Promise<Job> {
  const db = await getDb();
  const id = crypto.randomUUID();
  
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

  return getJobById(id) as Promise<Job>;
}

export async function getJobById(id: string): Promise<Job | undefined> {
  const db = await getDb();
  return db.get('SELECT * FROM jobs WHERE id = ?', [id]);
}

export async function updateJob(id: string, data: Partial<JobData>): Promise<Job | undefined> {
  const db = await getDb();
  const fields = Object.keys(data)
    .map(key => `${key} = ?`)
    .join(', ');
  
  await db.run(
    `UPDATE jobs SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [...Object.values(data), id]
  );

  return getJobById(id);
}

export async function deleteJob(id: string): Promise<void> {
  const db = await getDb();
  await db.run('DELETE FROM jobs WHERE id = ?', [id]);
}