import { createServer } from 'http';
import { apiResolver } from 'next/dist/server/api-utils/node';
import request from 'supertest';
import { GET as getJobsHandler, POST as createJobHandler } from '@/app/api/jobs/route';
import { createToken } from '@/lib/auth';
import { getJobs, createJob } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  getJobs: jest.fn(),
  createJob: jest.fn(),
}));

describe('Jobs API Integration Tests', () => {
  let server: any;
  let authToken: string;

  beforeAll(async () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('GET /api/jobs', () => {
    it('should get user jobs with valid token', async () => {
      const mockJobs = [
        {
          id: '1',
          title: 'Software Engineer',
          company_name: 'Tech Corp',
          status: 'Applied',
          application_date: '2024-01-01',
        },
      ];

      (getJobs as jest.Mock).mockResolvedValue(mockJobs);

      const response = await request(server)
        .get('/api/jobs')
        .set('Cookie', `token=${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.jobs)).toBe(true);
      expect(response.body.jobs).toHaveLength(mockJobs.length);
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
        company_id: 'company123',
        status: 'Applied',
      };

      const mockCreatedJob = {
        id: '123',
        ...jobData,
        user_id: 'test-user-id',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (createJob as jest.Mock).mockResolvedValue(mockCreatedJob);

      const response = await request(server)
        .post('/api/jobs')
        .set('Cookie', `token=${authToken}`)
        .send(jobData);

      expect(response.status).toBe(200);
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