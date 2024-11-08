import { getDb } from './index';

export interface ContactData {
  user_id: string;
  company_id?: string;
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  notes?: string;
}

export interface Contact extends ContactData {
  id: string;
  created_at: string;
  updated_at: string;
}

export async function getContacts(userId: string): Promise<Contact[]> {
  const db = await getDb();
  return db.all('SELECT * FROM contacts WHERE user_id = ? ORDER BY name ASC', [userId]);
}

export async function createContact(data: ContactData): Promise<Contact> {
  const db = await getDb();
  const id = crypto.randomUUID();

  await db.run(`
    INSERT INTO contacts (
      id, user_id, company_id, name, position, email, 
      phone, linkedin_url, notes
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

  return getContactById(id) as Promise<Contact>;
}

export async function getContactById(id: string): Promise<Contact | undefined> {
  const db = await getDb();
  return db.get('SELECT * FROM contacts WHERE id = ?', [id]);
}

export async function updateContact(id: string, data: Partial<ContactData>): Promise<Contact | undefined> {
  const db = await getDb();
  const fields = Object.keys(data)
    .map(key => `${key} = ?`)
    .join(', ');
  
  await db.run(
    `UPDATE contacts SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [...Object.values(data), id]
  );

  return getContactById(id);
}

export async function deleteContact(id: string): Promise<void> {
  const db = await getDb();
  await db.run('DELETE FROM contacts WHERE id = ?', [id]);
}