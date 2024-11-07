import {
  createJob,
  getJobs,
  createCompany,
  getCompanyById,
  createContact,
  getUserContacts,
} from '@/lib/db';

jest.mock('sqlite3');
jest.mock('sqlite');

describe('Database Unit Tests', () => {
  describe('Jobs', () => {
    it('should create a job', async () => {
      const jobData = {
        user_id: '123',
        title: 'Software Engineer',
        company_id: '456',
        status: 'Applied',
      };

      const result = await createJob(jobData);

      expect(result).toBeDefined();
      expect(result.title).toBe(jobData.title);
      expect(result.user_id).toBe(jobData.user_id);
    });

    it('should get user jobs', async () => {
      const userId = '123';
      const mockJobs = [
        { id: '1', title: 'Job 1' },
        { id: '2', title: 'Job 2' },
      ];

      const result = await getJobs(userId);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Companies', () => {
    it('should create a company', async () => {
      const companyData = {
        name: 'Test Company',
        website: 'https://example.com',
        industry: 'Technology',
      };

      const result = await createCompany(companyData);

      expect(result).toBeDefined();
      expect(result.name).toBe(companyData.name);
    });

    it('should get company by id', async () => {
      const companyId = '123';
      const result = await getCompanyById(companyId);

      expect(result).toBeDefined();
    });
  });

  describe('Contacts', () => {
    it('should create a contact', async () => {
      const contactData = {
        user_id: '123',
        name: 'John Doe',
        email: 'john@example.com',
      };

      const result = await createContact(contactData);

      expect(result).toBeDefined();
      expect(result.name).toBe(contactData.name);
    });

    it('should get user contacts', async () => {
      const userId = '123';
      const result = await getUserContacts(userId);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });
});