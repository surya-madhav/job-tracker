import { createServer } from 'http';
import { apiResolver } from 'next/dist/server/api-utils/node';
import request from 'supertest';
import { GET as getJobsHandler, POST as createJobHandler } from '@/app/api/jobs/route';
import { createToken } from '@/lib/auth';

describe('Jobs API Integration Tests', () => {
  let server: any;
  let authToken: string;

  beforeAll(async () => {
    // Create auth token for testing
    authToken = await createToken({ id: 'test-user-id' });

    server = createServer((req, res) => {
      const path = req.url?.split('?')[0] || '';
      
      if (path === '/api/jobs' && req.method === 'GET') {
        return apiResolver(
          req,
          res,
          undefined,
          getJobsHandler,
          { previewModeId: '', previewModeEncryptionKey: '', previewModeSigningKey: '' },
          false
        );
      }
      
      if (path === '/api/jobs' && req.method === 'POST') {
        return apiResolver(
          req,
          res,
          undefined,
          createJobHandler,
          { previewModeId: '', previewModeEncryptionKey: '', previewModeSigningKey: '' },
          false
        );
      }
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('GET /api/jobs', () => {
    it('should get user jobs with valid token', async () => {
      const response = await request(server)
        .get('/api/jobs')
        .set('Cookie', `token=${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.jobs)).toBe(true);
    });

    it('should return 401 without token', async () => {
      const response = await request(server)
        .get('/api/jobs');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/jobs', () => {
    it('should create a job with valid data', async () => {
      const jobData = {
        title: 'Software Engineer',
        company_id: 'test-company-id',
        status: 'Applied',
      };

      const response = await request(server)
        .post('/api/jobs')
        .set('Cookie', `token=${authToken}`)
        .send(jobData);

      expect(response.status).toBe(201);
      expect(response.body.job).toBeDefined();
      expect(response.body.job.title).toBe(jobData.title);
    });

    it('should return 401 without token', async () => {
      const response = await request(server)
        .post('/api/jobs')
        .send({
          title: 'Test Job',
        });

      expect(response.status).toBe(401);
    });
  });
});