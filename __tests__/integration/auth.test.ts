import { createServer } from 'http';
import { apiResolver } from 'next/dist/server/api-utils/node';
import request from 'supertest';
import { POST as loginHandler } from '@/app/api/auth/login/route';
import { POST as registerHandler } from '@/app/api/auth/register/route';
import { POST as logoutHandler } from '@/app/api/auth/logout/route';
import { createToken } from '@/lib/auth';
import { createUser, getUserByEmail } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
}));

describe('Authentication Integration Tests', () => {
  let server: any;

  beforeAll(() => {
    server = createServer((req, res) => {
      const path = req.url?.split('?')[0] || '';
      
      if (path === '/api/auth/login') {
        return apiResolver(
          req,
          res,
          undefined,
          loginHandler,
          { previewModeId: '', previewModeEncryptionKey: '', previewModeSigningKey: '' },
          false
        );
      }
      
      if (path === '/api/auth/register') {
        return apiResolver(
          req,
          res,
          undefined,
          registerHandler,
          { previewModeId: '', previewModeEncryptionKey: '', previewModeSigningKey: '' },
          false
        );
      }
      
      if (path === '/api/auth/logout') {
        return apiResolver(
          req,
          res,
          undefined,
          logoutHandler,
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

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      };

      (createUser as jest.Mock).mockResolvedValue({
        id: '123',
        name: userData.name,
        email: userData.email,
      });

      const response = await request(server)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      (getUserByEmail as jest.Mock).mockResolvedValue({
        id: '123',
        name: 'Test User',
        email: credentials.email,
        password: '$2a$10$mockhashedpassword',
      });

      const response = await request(server)
        .post('/api/auth/login')
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      (getUserByEmail as jest.Mock).mockResolvedValue(null);

      const response = await request(server)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user', async () => {
      const response = await request(server)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('token=');
    });
  });
});