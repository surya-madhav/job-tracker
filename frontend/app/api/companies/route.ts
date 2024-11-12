import { NextResponse } from 'next/server';
import { CompanyService } from '@/services/company.service';
import { getSession } from '@/lib/auth';

const companyService = new CompanyService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const industry = searchParams.get('industry') || undefined;

    const companies = await companyService.findMany({ search, industry });
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
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

    const data = await request.json();
    const company = await companyService.create(data);
    
    return NextResponse.json(company);
  } catch (error) {
    console.error('Failed to create company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}