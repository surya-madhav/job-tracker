import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface Contact {
  id: string;
  name: string;
  company_name: string;
  position: string;
  email: string;
  phone: string;
  linkedin_url: string;
}

interface Session {
  id: string;
}

export async function GET() {
  try {
    const session = await getSession() as Session | null;
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const contacts = await db.all(`
      SELECT 
        c.*,
        comp.name as company_name
      FROM contacts c
      JOIN companies comp ON c.company_id = comp.id
      WHERE c.user_id = ?
      ORDER BY c.name ASC
    `, [session.id]);
    const formattedContacts = contacts.map((contact: Contact) => ({
      id: contact.id,
      name: contact.name,
      company: {
        name: contact.company_name
      },
      position: contact.position,
      email: contact.email,
      phone: contact.phone,
      linkedinUrl: contact.linkedin_url,
    }));

    return NextResponse.json({ contacts: formattedContacts });
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession() as Session | null;
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      name,
      companyId,
      position,
      email,
      phone,
      linkedinUrl,
      notes
    } = await request.json();

    const db = await getDb();
    const contactId = crypto.randomUUID();

    await db.run(`
      INSERT INTO contacts (
        id,
        user_id,
        company_id,
        name,
        position,
        email,
        phone,
        linkedin_url,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      contactId,
      session.id,
      companyId,
      name,
      position,
      email,
      phone,
      linkedinUrl,
      notes
    ]);

    return NextResponse.json({
      success: true,
      contact: {
        id: contactId,
        name,
        companyId,
        position,
        email,
        phone,
        linkedinUrl,
        notes,
      }
    });
  } catch (error) {
    console.error('Failed to create contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}