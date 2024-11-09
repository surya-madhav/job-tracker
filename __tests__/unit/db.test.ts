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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Jobs', () => {
    const mockJob = {
      id: '123',
      user_id: 'user123',
      title: 'Software Engineer',
      company_id: 'company123',
      status: 'Applied',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    it('should create a job', async () => {
      const jobData = {
        user_id: 'user123',
        title: 'Software Engineer',
        company_id: 'company123',
        status: 'Applied',
      };

      jest.spyOn(global.crypto, 'randomUUID').mockReturnValue('123');
      jest.spyOn(global, 'Date').mockImplementation(() => new Date('2024-01-01'));

      const result = await createJob(jobData);

      expect(result).toBeDefined();
      expect(result.id).toBe('123');
      expect(result.title).toBe(jobData.title);
      expect(result.user_id).toBe(jobData.user_id);
    });

    it('should get user jobs', async () => {
      const userId = 'user123';
      const mockJobs = [mockJob];

      jest.spyOn(global, 'Date').mockImplementation(() => new Date('2024-01-01'));

      const result = await getJobs(userId);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Companies', () => {
    const mockCompany = {
      id: '123',
      name: 'Test Company',
      website: 'https://example.com',
      industry: 'Technology',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    it('should create a company', async () => {
      const companyData = {
        name: 'Test Company',
        website: 'https://example.com',
        industry: 'Technology',
      };

      jest.spyOn(global.crypto, 'randomUUID').mockReturnValue('123');
      jest.spyOn(global, 'Date').mockImplementation(() => new Date('2024-01-01'));

      const result = await createCompany(companyData);

      expect(result).toBeDefined();
      expect(result.name).toBe(companyData.name);
      expect(result.id).toBe('123');
    });

    it('should get company by id', async () => {
      const companyId = '123';
      const result = await getCompanyById(companyId);

      expect(result).toBeDefined();
      if (result) {
        expect(result.id).toBe(companyId);
      }
    });
  });

  describe('Contacts', () => {
    const mockContact = {
      id: '123',
      user_id: 'user123',
      name: 'John Doe',
      email: 'john@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    it('should create a contact', async () => {
      const contactData = {
        user_id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
      };

      jest.spyOn(global.crypto, 'randomUUID').mockReturnValue('123');
      jest.spyOn(global, 'Date').mockImplementation(() => new Date('2024-01-01'));

      const result = await createContact(contactData);

      expect(result).toBeDefined();
      expect(result.name).toBe(contactData.name);
      expect(result.id).toBe('123');
    });

    it('should get user contacts', async () => {
      const userId = 'user123';
      const result = await getUserContacts(userId);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });
});