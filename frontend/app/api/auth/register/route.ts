`use server`;
import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db';
import { createToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration successful
 *       400:
 *         description: Invalid input or email already exists
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    console.log('name:', name);
    console.log('email:', email);
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const user = await createUser(name, email, password);
    const token = await createToken({ id: user.id });

    // Create the response with the user data
    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      },
      { status: 200 }
    );

    // Set the auth cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}