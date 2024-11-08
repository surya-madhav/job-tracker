import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user by removing authentication token
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               description: Removes the authentication token cookie
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    
    // Remove the auth cookie
    response.cookies.delete('token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}