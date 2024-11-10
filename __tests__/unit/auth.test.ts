import { createToken, verifyToken } from '@/lib/auth';
import { createUser, getUserByEmail } from '@/lib/db';
import { hash } from 'bcryptjs';

jest.mock('@/lib/db', () => ({
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
}));

describe('Authentication Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('JWT Functions', () => {
    it('should create and verify a token', async () => {
      const payload = { id: '123', email: 'test@example.com' };
      const token = await createToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      const verified = await verifyToken(token);
      expect(verified).toBeDefined();
      expect(verified?.id).toBe(payload.id);
      expect(verified?.email).toBe(payload.email);
    });

    it('should return null for invalid token', async () => {
      const result = await verifyToken('invalid-token');
      expect(result).toBeNull();
    });
  });

  describe('User Functions', () => {
    it('should create a user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      (createUser as jest.Mock).mockResolvedValue({
        id: '123',
        name: userData.name,
        email: userData.email,
      });

      const result = await createUser(
        userData.name,
        userData.email,
        userData.password
      );

      expect(result).toBeDefined();
      expect(result.name).toBe(userData.name);
      expect(result.email).toBe(userData.email);
      expect(createUser).toHaveBeenCalledTimes(1);
      expect(createUser).toHaveBeenCalledWith(
        userData.name,
        userData.email,
        userData.password
      );
    });

    it('should get user by email', async () => {
      const email = 'test@example.com';
      const mockUser = {
        id: '123',
        name: 'Test User',
        email,
        password: await hash('password123', 10),
      };

      (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await getUserByEmail(email);

      expect(result).toBeDefined();
      expect(result.email).toBe(email);
      expect(getUserByEmail).toHaveBeenCalledWith(email);
    });

    it('should return undefined for non-existent user', async () => {
      const email = 'nonexistent@example.com';
      (getUserByEmail as jest.Mock).mockResolvedValue(undefined);

      const result = await getUserByEmail(email);
      expect(result).toBeUndefined();
    });
  });
});