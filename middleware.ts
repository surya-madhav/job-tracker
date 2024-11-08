import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession, isDev, Session } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const isPublicPath = path === '/' || 
    path === '/login' || 
    path === '/register' || 
    path === '/forgot-password' ||
    path.startsWith('/api/auth/');

  // In development mode, bypass authentication
  if (isDev) {
    if (isPublicPath && path !== '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  const session: Session | null = await updateSession(request);

  // Redirect authenticated users away from auth pages
  if (session && isPublicPath && path !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};