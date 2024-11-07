import { createServer } from 'http';
import { apiResolver } from 'next/dist/server/api-utils/node';
import request from 'supertest';
import { POST as createCompanyHandler } from '@/app/api/companies/route';
import { GET as getCompanyHandler } from '@/app/api/companies/[id]/route';
import { createToken } from '@/lib/auth';

describe('Companies API Integration Tests', () => {
  let server: any;
  let authToken: string;

  beforeAll(async () => {
    // Create auth token for testing
    authToken = await createToken({ id: 'test-user-id' });

    server = createServer((req, res) => {
      const path = req.url?.split('?')[0] || '';
      
      if (path === '/api/companies' && req.method === 'POST') {
        return apiResolver(
          req,
          res,
          undefined,
          createCompanyHandler,
          { previewModeId: '', previewModeEncryptionKey: '', previewModeSigningKey: '' },
          false
        );
      }
      
      if (path.startsWith('/api/companies/') && req.method === 'GET') {
        return apiResolver(
          req,
          res,
          { id: path.split('/').pop() },
          getCompanyHandler,
          { previewModeId: '', previewModeEncryptionKey: '', previewModeSigningKey: '' },
          false
        );
      }
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('POST /api/companies', () => {
    it('should create a company with valid data', async () => {
      const companyData = {
        name: 'Test Company',
        website: 'https://example.com',
        industry: 'Technology',
      };

      const response = await request(server)
        .post('/api/companies')
        .set('Cookie', `token=${authToken}`)
        .send(companyData);

      expect(response.status).toBe(201);
      expect(response.body.company).toBeDefined();
      expect(response.body.company.name).toBe(companyData.name);
    });

    it('should return 401 without token', async () => {
      const response = await request(server)
        .post('/api/companies')
        .send({
          name: 'Test Company',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/companies/:id', () => {
    it('should get company by id with valid token', async () => {
      const companyId = 'test-company-id';

      const response = await request(server)
        .get(`/api/companies/${companyId}`)
        .set('Cookie', `token=${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.company).toBeDefined();
    });

    it('should return 401 without token', async () => {
      const response = await request(server)
        .get('/api/companies/test-id');

      expect(response.status).toBe(401);
    });
  });
});