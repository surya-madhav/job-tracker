import { Database } from 'sqlite3';
import { open } from 'sqlite';
import { hash, compare } from 'bcryptjs';
import { seedDatabase } from './seed';
import { isDev } from './auth';

// Re-export all types and functions from individual modules
export * from './db/users';
export * from './db/jobs';
export * from './db/companies';
export * from './db/contacts';
export * from './db/resumes';

let db: any = null;

export async function getDb() {
  if (!db) {
    try {
      db = await open({
        filename: ':memory:', // Use in-memory database for development
        driver: Database
      });

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
          resume_id TEXT,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (company_id) REFERENCES companies(id),
          FOREIGN KEY (resume_id) REFERENCES resumes(id)
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

        CREATE TABLE IF NOT EXISTS resumes (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          name TEXT NOT NULL,
          tags TEXT,
          file_url TEXT,
          json_data TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `);

      // Seed database in development mode
      if (isDev) {
        await seedDatabase();
      }
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }
  return db;
}

// Export database utility functions
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
  return db.get('SELECT * FROM users WHERE email = ?', [email]);
}

export async function getUserById(id: string) {
  const db = await getDb();
  return db.get('SELECT * FROM users WHERE id = ?', [id]);
}

export async function verifyPassword(hashedPassword: string, password: string) {
  return compare(password, hashedPassword);
}