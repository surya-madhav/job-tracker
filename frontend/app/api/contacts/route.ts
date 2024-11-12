import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { Contact } from '@/lib/db/contacts';

interface ContactWithCompany extends Contact {
  company_name: string;
}

interface FormattedContact {
  id: string;
  name: string;
  company: {
    name: string;
  };
  position: string | null;
  email: string | null;
  phone: string | null;
  linkedinUrl: string | null;
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const contacts = await db.all(`
      SELECT 
        c.*,
        comp.name as company_name
      FROM contacts c
      LEFT JOIN companies comp ON c.company_id = comp.id
      WHERE c.user_id = ?
      ORDER BY c.name ASC
    `, [session.id]) as ContactWithCompany[];

    const formattedContacts: FormattedContact[] = contacts.map(contact => ({
      id: contact.id,
      name: contact.name,
      company: {
        name: contact.company_name
      },
      position: contact.position || null,
      email: contact.email || null,
      phone: contact.phone || null,
      linkedinUrl: contact.linkedin_url || null,
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
    const session = await getSession();
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