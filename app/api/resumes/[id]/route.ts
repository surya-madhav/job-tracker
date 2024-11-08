import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getResumeById, updateResume, deleteResume } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/resumes/{id}:
 *   get:
 *     summary: Get a specific resume
 *     tags: [Resumes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resume details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resume:
 *                   $ref: '#/components/schemas/Resume'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resume not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update a resume
 *     tags: [Resumes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *         description: Resume updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resume:
 *                   $ref: '#/components/schemas/Resume'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resume not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a resume
 *     tags: [Resumes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resume deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resume not found
 *       500:
 *         description: Internal server error
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resume = await getResumeById(params.id);
    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    if (resume.user_id !== session.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Failed to fetch resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resume = await getResumeById(params.id);
    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    if (resume.user_id !== session.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const updatedResume = await updateResume(params.id, data);

    return NextResponse.json({ resume: updatedResume });
  } catch (error) {
    console.error('Failed to update resume:', error);
    return NextResponse.json(
      { error: 'Failed to update resume' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resume = await getResumeById(params.id);
    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    if (resume.user_id !== session.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await deleteResume(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete resume:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}