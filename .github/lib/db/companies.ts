import { getDb } from './index';

export interface CompanyData {
  name: string;
  website?: string;
  industry?: string;
  location?: string;
  notes?: string;
}

export interface Company extends CompanyData {
  id: string;
  created_at: string;
  updated_at: string;
}

export async function getCompanies(): Promise<Company[]> {
  const db = await getDb();
  return db.all('SELECT * FROM companies ORDER BY name ASC');
}

export async function createCompany(data: CompanyData): Promise<Company> {
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

  return getCompanyById(id) as Promise<Company>;
}

export async function getCompanyById(id: string): Promise<Company | undefined> {
  const db = await getDb();
  return db.get('SELECT * FROM companies WHERE id = ?', [id]);
}

export async function updateCompany(id: string, data: Partial<CompanyData>): Promise<Company | undefined> {
  const db = await getDb();
  const fields = Object.keys(data)
    .map(key => `${key} = ?`)
    .join(', ');
  
  await db.run(
    `UPDATE companies SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [...Object.values(data), id]
  );

  return getCompanyById(id);
}

export async function deleteCompany(id: string): Promise<void> {
  const db = await getDb();
  await db.run('DELETE FROM companies WHERE id = ?', [id]);
}