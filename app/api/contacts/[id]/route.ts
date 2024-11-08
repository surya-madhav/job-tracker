import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getContactById, updateContact, deleteContact } from '@/lib/db';

export const dynamic = 'force-dynamic';


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