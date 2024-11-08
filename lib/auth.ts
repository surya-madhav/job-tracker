import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_secret_key_change_this_in_production'
);

export interface Session {
  id: string;
  email?: string;
  iat?: number;
  exp?: number;
}

export const DEV_USER = {
  id: 'dev-user-id',
  name: 'Development User',
  email: 'dev@example.com',
};

export const isDev = process.env.NODE_ENV === 'development';

export async function createToken(payload: Partial<Session>): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as Session;
  } catch (error) {
    if (isDev) {
      return { id: DEV_USER.id };
    }
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  if (isDev) {
    return { id: DEV_USER.id };
  }
  
  const token = cookies().get('token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function updateSession(request: NextRequest): Promise<Session | null> {
  if (isDev) {
    return { id: DEV_USER.id };
  }
  
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}