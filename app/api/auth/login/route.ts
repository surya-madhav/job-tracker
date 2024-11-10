import { NextResponse } from 'next/server';
import { getUserByEmail, verifyPassword } from '@/lib/db';
import { createToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Logger utility specifically for auth API endpoints
const authApiLogger = {
  info: (message: string, data?: any) => {
    console.log(`🔒 Auth API [INFO] ${message}`, data ? data : '');
  },
  error: (message: string, error?: any) => {
    console.error(`🔒 Auth API [ERROR] ${message}`, error ? error : '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`🔒 Auth API [WARN] ${message}`, data ? data : '');
  },
  debug: (message: string, data?: any) => {
    console.debug(`🔒 Auth API [DEBUG] ${message}`, data ? data : '');
  },
  metrics: (endpoint: string, duration: number, status: number) => {
    console.log(`📊 Auth API [METRICS] ${endpoint} - Status: ${status} - Duration: ${duration.toFixed(2)}ms`);
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
  const requestStartTime = performance.now();
  const requestId = Math.random().toString(36).substring(7);
  
  authApiLogger.info(`Login attempt started [RequestID: ${requestId}]`);

  try {
    // Log request headers (excluding sensitive data)
    const headers = Object.fromEntries(request.headers.entries());
    authApiLogger.debug('Request headers', {
      requestId,
      headers: {
        'content-type': headers['content-type'],
        'user-agent': headers['user-agent'],
        'accept': headers['accept']
      }
    });

    const { email, password } = await request.json();
    
    // Log sanitized input
    authApiLogger.debug('Login attempt details', {
      requestId,
      email: email ? `${email.substring(0, 3)}...${email.split('@')[1]}` : undefined,
      hasPassword: !!password
    });

    // Validate required fields
    if (!email || !password) {
      const missingFields = [];
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');
      
      authApiLogger.warn('Missing required fields', {
        requestId,
        missingFields
      });
      
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user from database
    const findUserStartTime = performance.now();
    const user = await getUserByEmail(email);
    const findUserDuration = performance.now() - findUserStartTime;
    
    authApiLogger.debug('Database query completed', {
      requestId,
      duration: `${findUserDuration.toFixed(2)}ms`,
      userFound: !!user
    });

    if (!user) {
      authApiLogger.warn('Invalid login attempt - User not found', {
        requestId,
        email: `${email.substring(0, 3)}...${email.split('@')[1]}`
      });
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const verifyStartTime = performance.now();
    const isValid = await verifyPassword(user.password, password);
    const verifyDuration = performance.now() - verifyStartTime;
    
    authApiLogger.debug('Password verification completed', {
      requestId,
      duration: `${verifyDuration.toFixed(2)}ms`,
      success: isValid
    });

    if (!isValid) {
      authApiLogger.warn('Invalid login attempt - Wrong password', {
        requestId,
        userId: user.id
      });
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create authentication token
    const tokenStartTime = performance.now();
    const token = await createToken({ id: user.id });
    const tokenDuration = performance.now() - tokenStartTime;
    
    authApiLogger.debug('Token creation completed', {
      requestId,
      duration: `${tokenDuration.toFixed(2)}ms`,
      userId: user.id
    });

    // Create the response with the user data
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

    // Set the auth cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 // 24 hours
    };

    response.cookies.set('token', token, cookieOptions);

    authApiLogger.info('Login successful', {
      requestId,
      userId: user.id,
      cookieOptions: {
        ...cookieOptions,
        token: `${token.substring(0, 10)}...`
      }
    });

    // Log total request duration
    const totalDuration = performance.now() - requestStartTime;
    authApiLogger.metrics('/api/auth/login', totalDuration, 200);

    return response;
  } catch (error) {
    const totalDuration = performance.now() - requestStartTime;
    
    authApiLogger.error('Login process failed', {
      requestId,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : error
    });

    authApiLogger.metrics('/api/auth/login', totalDuration, 500);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    authApiLogger.debug(`Login attempt completed [RequestID: ${requestId}]`);
  }
}