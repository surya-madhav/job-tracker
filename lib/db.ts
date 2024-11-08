import { Database } from 'sqlite3';
import { open } from 'sqlite';
import { hash, compare } from 'bcryptjs';
import { seedDatabase } from './seed';
import { isDev } from './auth';

let db: any = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: './database.sqlite',
      driver: Database
    });

    // Drop tables if they exist (in development)
    if (isDev) {
      await db.exec(`
        DROP TABLE IF EXISTS job_contacts;
        DROP TABLE IF EXISTS contacts;
        DROP TABLE IF EXISTS jobs;
        DROP TABLE IF EXISTS companies;
        DROP TABLE IF EXISTS users;
      `);
    }
    
    // Create tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS companies (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        website TEXT,
        industry TEXT,
        location TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        company_id TEXT,
        url TEXT,
        status TEXT CHECK (status IN ('Saved', 'Applied', 'Interviewing', 'Offered', 'Rejected')),
        application_date DATE,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (company_id) REFERENCES companies(id)
      );

      CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        company_id TEXT,
        name TEXT NOT NULL,
        position TEXT,
        email TEXT,
        phone TEXT,
        linkedin_url TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (company_id) REFERENCES companies(id)
      );

      CREATE TABLE IF NOT EXISTS job_contacts (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        contact_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id),
        FOREIGN KEY (contact_id) REFERENCES contacts(id)
      );
    `);

    // Seed database in development mode
    if (isDev) {
      await seedDatabase();
    }
  }
  return db;
}

// User Operations
export async function createUser(name: string, email: string, password: string) {
  const db = await getDb();
  const hashedPassword = await hash(password, 10);
  const id = crypto.randomUUID();

  await db.run(
    'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
    [id, name, email, hashedPassword]
  );

  return { id, name, email };
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  return await db.get('SELECT * FROM users WHERE email = ?', [email]);
}

export async function getUserById(id: string) {
  const db = await getDb();
  return await db.get('SELECT * FROM users WHERE id = ?', [id]);
}

export async function verifyPassword(hashedPassword: string, password: string) {
  return await compare(password, hashedPassword);
}

// Job Operations
export async function createJob(data: {
  user_id: string;
  title: string;
  company_id?: string;
  url?: string;
  status: string;
  application_date?: string;
  notes?: string;
}) {
  const db = await getDb();
  const id = crypto.randomUUID();

  await db.run(`
    INSERT INTO jobs (
      id, user_id, title, company_id, url, status, application_date, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    data.user_id,
    data.title,
    data.company_id,
    data.url,
    data.status,
    data.application_date,
    data.notes
  ]);

  return { id, ...data };
}

export async function getJobs(userId: string) {
  const db = await getDb();
  return await db.all(`
    SELECT j.*, c.name as company_name
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    WHERE j.user_id = ?
    ORDER BY j.application_date DESC
  `, [userId]);
}

export async function getJobById(id: string) {
  const db = await getDb();
  return await db.get(`
    SELECT j.*, c.name as company_name
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    WHERE j.id = ?
  `, [id]);
}

export async function updateJob(id: string, data: Partial<{
  title: string;
  company_id: string;
  url: string;
  status: string;
  application_date: string;
  notes: string;
}>) {
  const db = await getDb();
  const sets = Object.entries(data)
    .map(([key]) => `${key} = ?`)
    .join(', ');

  await db.run(`
    UPDATE jobs
    SET ${sets}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [...Object.values(data), id]);

  return await getJobById(id);
}

export async function deleteJob(id: string) {
  const db = await getDb();
  await db.run('DELETE FROM jobs WHERE id = ?', [id]);
}

// Company Operations
export async function createCompany(data: {
  name: string;
  website?: string;
  industry?: string;
  location?: string;
  notes?: string;
}) {
  const db = await getDb();
  const id = crypto.randomUUID();

  await db.run(`
    INSERT INTO companies (
      id, name, website, industry, location, notes
    ) VALUES (?, ?, ?, ?, ?, ?)
  `, [
    id,
    data.name,
    data.website,
    data.industry,
    data.location,
    data.notes
  ]);

  return { id, ...data };
}

export async function getCompanyById(id: string) {
  const db = await getDb();
  return await db.get('SELECT * FROM companies WHERE id = ?', [id]);
}

export async function updateCompany(id: string, data: Partial<{
  name: string;
  website: string;
  industry: string;
  location: string;
  notes: string;
}>) {
  const db = await getDb();
  const sets = Object.entries(data)
    .map(([key]) => `${key} = ?`)
    .join(', ');

  await db.run(`
    UPDATE companies
    SET ${sets}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [...Object.values(data), id]);

  return await getCompanyById(id);
}

export async function deleteCompany(id: string) {
  const db = await getDb();
  await db.run('DELETE FROM companies WHERE id = ?', [id]);
}

// Contact Operations
export async function createContact(data: {
  user_id: string;
  company_id?: string;
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  notes?: string;
}) {
  const db = await getDb();
  const id = crypto.randomUUID();

  await db.run(`
    INSERT INTO contacts (
      id, user_id, company_id, name, position, email, phone, linkedin_url, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    data.user_id,
    data.company_id,
    data.name,
    data.position,
    data.email,
    data.phone,
    data.linkedin_url,
    data.notes
  ]);

  return { id, ...data };
}

export async function getContactById(id: string) {
  const db = await getDb();
  return await db.get(`
    SELECT c.*, comp.name as company_name
    FROM contacts c
    LEFT JOIN companies comp ON c.company_id = comp.id
    WHERE c.id = ?
  `, [id]);
}

export async function getUserContacts(userId: string) {
  const db = await getDb();
  return await db.all(`
    SELECT c.*, comp.name as company_name
    FROM contacts c
    LEFT JOIN companies comp ON c.company_id = comp.id
    WHERE c.user_id = ?
    ORDER BY c.name ASC
  `, [userId]);
}

export async function updateContact(id: string, data: Partial<{
  name: string;
  position: string;
  email: string;
  phone: string;
  linkedin_url: string;
  notes: string;
}>) {
  const db = await getDb();
  const sets = Object.entries(data)
    .map(([key]) => `${key} = ?`)
    .join(', ');

  await db.run(`
    UPDATE contacts
    SET ${sets}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [...Object.values(data), id]);

  return await getContactById(id);
}

export async function deleteContact(id: string) {
  const db = await getDb();
  await db.run('DELETE FROM contacts WHERE id = ?', [id]);
}

// Job Contacts Operations
export async function addJobContact(jobId: string, contactId: string) {
  const db = await getDb();
  const id = crypto.randomUUID();

  await db.run(`
    INSERT INTO job_contacts (id, job_id, contact_id)
    VALUES (?, ?, ?)
  `, [id, jobId, contactId]);

  return { id, job_id: jobId, contact_id: contactId };
}

export async function getJobContacts(jobId: string) {
  const db = await getDb();
  return await db.all(`
    SELECT c.*, jc.id as job_contact_id
    FROM contacts c
    JOIN job_contacts jc ON c.id = jc.contact_id
    WHERE jc.job_id = ?
  `, [jobId]);
}

export async function removeJobContact(jobId: string, contactId: string) {
  const db = await getDb();
  await db.run(
    'DELETE FROM job_contacts WHERE job_id = ? AND contact_id = ?',
    [jobId, contactId]
  );
}