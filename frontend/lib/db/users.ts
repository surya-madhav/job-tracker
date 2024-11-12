import { hash, compare } from 'bcryptjs';
import { getDb } from './index';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at?: string;
  updated_at?: string;
}

export async function createUser(name: string, email: string, password: string): Promise<Omit<User, 'password'>> {
  const db = await getDb();
  const hashedPassword = await hash(password, 10);
  const id = crypto.randomUUID();

  await db.run(
    'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
    [id, name, email, hashedPassword]
  );

  return { id, name, email };
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const db = await getDb();
  return db.get('SELECT * FROM users WHERE email = ?', [email]);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const db = await getDb();
  return db.get('SELECT * FROM users WHERE id = ?', [id]);
}

export async function verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
  return compare(password, hashedPassword);
}