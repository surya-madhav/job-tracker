import { createServer } from 'http';
import { apiResolver } from 'next/dist/server/api-utils/node';
import request from 'supertest';
import { GET as getContactsHandler, POST as createContactHandler } from '@/app/api/contacts/route';
import { createToken } from '@/lib/auth';

describe('Contacts API Integration Tests', () => {
  let server: any;
  let authToken: string;

  beforeAll(async () => {
    // Create auth token for testing
    authToken = await createToken({ id: 'test-user-id' });

    server = createServer((req, res) => {
      const path = req.url?.split('?')[0] || '';
      
      if (path === '/api/contacts' && req.method === 'GET') {
        return apiResolver(
          req,
          res,
          undefined,
          getContactsHandler,
          { previewModeId: '', previewModeEncryptionKey: '', previewModeSigningKey: '' },
          false
        );
      }
      
      if (path === '/api/contacts' && req.method === 'POST') {
        return apiResolver(
          req,
          res,
          undefined,
          createContactHandler,
          { previewModeId: '', previewModeEncryptionKey: '', previewModeSigningKey: '' },
          false
        );
      }
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('GET /api/contacts', () => {
    it('should get user contacts with valid token', async () => {
      const response = await request(server)
        .get('/api/contacts')
        .set('Cookie', `token=${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.contacts)).toBe(true);
    });

    it('should return 401 without token', async () => {
      const response = await request(server)
        .get('/api/contacts');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/contacts', () => {
    it('should create a contact with valid data', async () => {
      const contactData = {
        name: 'John Doe',
        company_id: 'test-company-id',
        email: 'john@example.com',
      };

      const response = await request(server)
        .post('/api/contacts')
        .set('Cookie', `token=${authToken}`)
        .send(contactData);

      expect(response.status).toBe(201);
      expect(response.body.contact).toBeDefined();
      expect(response.body.contact.name).toBe(contactData.name);
    });

    it('should return 401 without token', async () => {
      const response = await request(server)
        .post('/api/contacts')
        .send({
          name: 'Test Contact',
        });

      expect(response.status).toBe(401);
    });
  });
});