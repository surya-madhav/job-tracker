import { getDb } from './db';
import { DEV_USER } from './auth';
import { hash } from 'bcryptjs';

export async function seedDatabase() {
  const db = await getDb();
  
  try {
    // Check if dev user exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [DEV_USER.email]);
    
    if (!existingUser) {
      // Create development user
      const hashedPassword = await hash('password123', 10);
      await db.run(
        'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
        [DEV_USER.id, DEV_USER.name, DEV_USER.email, hashedPassword]
      );
    }

    // Seed companies if they don't exist
    const companies = [
      {
        id: '66aa578b-4d2f-4d1d-8c53-e0ffae801d99',
        name: 'Tech Corp',
        website: 'https://techcorp.com',
        industry: 'Technology',
        location: 'San Francisco, CA',
        notes: 'Leading tech company in AI and ML'
      },
      {
        id: '7c15b6f0-8c7a-4f6d-9c3b-7d42f456ef12',
        name: 'Innovation Labs',
        website: 'https://innovationlabs.com',
        industry: 'Software',
        location: 'New York, NY',
        notes: 'Startup focusing on blockchain'
      },
      {
        id: '9e45d2a1-3b7c-4e8f-bc1d-8f9a6b4c2d1e',
        name: 'Future Systems',
        website: 'https://futuresystems.com',
        industry: 'Technology',
        location: 'Seattle, WA',
        notes: 'Enterprise software solutions'
      }
    ];

    for (const company of companies) {
      const existingCompany = await db.get('SELECT id FROM companies WHERE id = ?', [company.id]);
      if (!existingCompany) {
        await db.run(`
          INSERT INTO companies (id, name, website, industry, location, notes)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          company.id,
          company.name,
          company.website,
          company.industry,
          company.location,
          company.notes
        ]);
      }
    }

    // Seed jobs if they don't exist
    const jobs = [
      {
        id: 'b7e31dde-0f6a-4662-9659-b53cd2352790',
        user_id: DEV_USER.id,
        title: 'Senior Frontend Developer',
        company_id: companies[0].id,
        url: 'https://techcorp.com/careers/123',
        status: 'Applied',
        application_date: '2024-03-15',
        notes: 'Applied through company website. First interview scheduled for next week.'
      },
      {
        id: 'c8f42eef-1g7b-5h73-10i4-c64de3463891',
        user_id: DEV_USER.id,
        title: 'Full Stack Engineer',
        company_id: companies[1].id,
        url: 'https://innovationlabs.com/jobs/456',
        status: 'Interviewing',
        application_date: '2024-03-10',
        notes: 'Technical interview completed. Waiting for feedback.'
      },
      {
        id: 'd9g53fgh-2h8c-6i84-11j5-d75ef4574912',
        user_id: DEV_USER.id,
        title: 'Software Architect',
        company_id: companies[2].id,
        url: 'https://futuresystems.com/positions/789',
        status: 'Saved',
        application_date: '2024-03-20',
        notes: 'Position looks interesting. Need to update resume and prepare cover letter.'
      }
    ];

    for (const job of jobs) {
      const existingJob = await db.get('SELECT id FROM jobs WHERE id = ?', [job.id]);
      if (!existingJob) {
        await db.run(`
          INSERT INTO jobs (id, user_id, title, company_id, url, status, application_date, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          job.id,
          job.user_id,
          job.title,
          job.company_id,
          job.url,
          job.status,
          job.application_date,
          job.notes
        ]);
      }
    }

    // Seed contacts if they don't exist
    const contacts = [
      {
        id: 'e10h64ij-3i9d-7j95-12k6-e86fg5685123',
        user_id: DEV_USER.id,
        company_id: companies[0].id,
        name: 'John Smith',
        position: 'Technical Recruiter',
        email: 'john@techcorp.com',
        phone: '123-456-7890',
        linkedin_url: 'https://linkedin.com/in/johnsmith',
        notes: 'Initial contact through LinkedIn. Very responsive and helpful.'
      },
      {
        id: 'f11i75jk-4j0e-8k06-13l7-f97gh6796234',
        user_id: DEV_USER.id,
        company_id: companies[1].id,
        name: 'Sarah Johnson',
        position: 'Engineering Manager',
        email: 'sarah@innovationlabs.com',
        phone: '234-567-8901',
        linkedin_url: 'https://linkedin.com/in/sarahjohnson',
        notes: 'Met at tech conference. Discussed team culture and growth opportunities.'
      }
    ];

    for (const contact of contacts) {
      const existingContact = await db.get('SELECT id FROM contacts WHERE id = ?', [contact.id]);
      if (!existingContact) {
        await db.run(`
          INSERT INTO contacts (id, user_id, company_id, name, position, email, phone, linkedin_url, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          contact.id,
          contact.user_id,
          contact.company_id,
          contact.name,
          contact.position,
          contact.email,
          contact.phone,
          contact.linkedin_url,
          contact.notes
        ]);
      }
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}