import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getResumes, createResume } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/resumes:
 *   get:
 *     summary: Get user's resumes
 *     tags: [Resumes]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user's resumes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resumes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Resume'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new resume
 *     tags: [Resumes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               fileUrl:
 *                 type: string
 *               jsonData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Resume created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resume:
 *                   $ref: '#/components/schemas/Resume'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resumes = await getResumes(session.id);
    return NextResponse.json({ resumes });
  } catch (error) {
    console.error('Failed to fetch resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, tags, fileUrl, jsonData } = await request.json();

    const resume = await createResume({
      user_id: session.id,
      name,
      tags,
      file_url: fileUrl,
      json_data: jsonData,
    });

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Failed to create resume:', error);
    return NextResponse.json(
      { error: 'Failed to create resume' },
      { status: 500 }
    );
  }
}