import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Internal server error
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