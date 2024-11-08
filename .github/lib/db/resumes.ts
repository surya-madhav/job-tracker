import { getDb } from './index';

export interface ResumeData {
  user_id: string;
  name: string;
  tags?: string[];
  file_url?: string;
  json_data?: object;
}

export interface Resume extends Omit<ResumeData, 'tags' | 'json_data'> {
  id: string;
  tags: string;
  json_data: string;
  created_at: string;
  updated_at: string;
}

export async function getResumes(userId: string): Promise<Resume[]> {
  const db = await getDb();
  const resumes = await db.all('SELECT * FROM resumes WHERE user_id = ?', [userId]);
  return resumes.map(resume => ({
    ...resume,
    tags: JSON.parse(resume.tags || '[]'),
    json_data: JSON.parse(resume.json_data || '{}')
  }));
}

export async function createResume(data: ResumeData): Promise<Resume> {
  const db = await getDb();
  const id = crypto.randomUUID();
  
  await db.run(`
    INSERT INTO resumes (
      id, user_id, name, tags, file_url, json_data
    ) VALUES (?, ?, ?, ?, ?, ?)
  `, [
    id,
    data.user_id,
    data.name,
    JSON.stringify(data.tags || []),
    data.file_url,
    JSON.stringify(data.json_data || {})
  ]);

  return getResumeById(id) as Promise<Resume>;
}

export async function getResumeById(id: string): Promise<Resume | undefined> {
  const db = await getDb();
  const resume = await db.get('SELECT * FROM resumes WHERE id = ?', [id]);
  if (resume) {
    resume.tags = JSON.parse(resume.tags || '[]');
    resume.json_data = JSON.parse(resume.json_data || '{}');
  }
  return resume;
}

export async function updateResume(id: string, data: Partial<ResumeData>): Promise<Resume | undefined> {
  const db = await getDb();
  const fields = Object.keys(data)
    .map(key => {
      if (key === 'tags' || key === 'json_data') {
        return `${key} = ?`;
      }
      return `${key} = ?`;
    })
    .join(', ');
  
  const values = Object.entries(data).map(([key, value]) => {
    if (key === 'tags' || key === 'json_data') {
      return JSON.stringify(value);
    }
    return value;
  });

  await db.run(
    `UPDATE resumes SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [...values, id]
  );

  return getResumeById(id);
}

export async function deleteResume(id: string): Promise<void> {
  const db = await getDb();
  await db.run('DELETE FROM resumes WHERE id = ?', [id]);
}