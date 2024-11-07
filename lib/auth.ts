import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_secret_key_change_this_in_production'
);

export const DEV_USER = {
  id: 'dev-user-id',
  name: 'Development User',
  email: 'dev@example.com',
};

export const isDev = process.env.NODE_ENV === 'development';

export async function createToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    if (isDev) {
      return { id: DEV_USER.id };
    }
    return null;
  }
}

export async function getSession() {
  if (isDev) {
    return { id: DEV_USER.id };
  }
  
  const token = cookies().get('token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function updateSession(request: NextRequest) {
  if (isDev) {
    return { id: DEV_USER.id };
  }
  
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}