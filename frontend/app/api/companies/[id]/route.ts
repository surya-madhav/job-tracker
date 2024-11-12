import { NextResponse } from 'next/server';
import { CompanyService } from '@/services/company.service';
import { getSession } from '@/lib/auth';

const companyService = new CompanyService();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const company = await companyService.findById(params.id);
    
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Failed to fetch company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company' },
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

    const data = await request.json();
    const company = await companyService.update(params.id, data);
    
    return NextResponse.json(company);
  } catch (error) {
    console.error('Failed to update company:', error);
    return NextResponse.json(
      { error: 'Failed to update company' },
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

    await companyService.delete(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete company:', error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    );
  }
}