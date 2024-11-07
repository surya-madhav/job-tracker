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

// Rest of the file remains the same...