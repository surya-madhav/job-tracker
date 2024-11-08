import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getContactById, updateContact, deleteContact } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Get a specific contact
 *     tags: [Contacts]
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
 *         description: Contact details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update a contact
 *     tags: [Contacts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 **     schema:
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
 *               position:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               linkedin_url:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
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
 *         description: Contact deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
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
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const contact = await getContactById(params.id);
    
    if (!contact) {
      return new NextResponse(
        JSON.stringify({ error: 'Contact not found' }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (contact.user_id !== session.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new NextResponse(
      JSON.stringify({ contact }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to fetch contact:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
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
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const contact = await getContactById(params.id);
    
    if (!contact) {
      return new NextResponse(
        JSON.stringify({ error: 'Contact not found' }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (contact.user_id !== session.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await request.json();
    const updatedContact = await updateContact(params.id, data);

    return new NextResponse(
      JSON.stringify({ contact: updatedContact }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to update contact:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
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
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const contact = await getContactById(params.id);
    
    if (!contact) {
      return new NextResponse(
        JSON.stringify({ error: 'Contact not found' }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (contact.user_id !== session.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await deleteContact(params.id);

    return new NextResponse(
      JSON.stringify({ success: true }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to delete contact:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}