// src/app/api/jobs/magic-scrape/route.ts
import { NextResponse } from 'next/server'
import { JobService } from '@/services/job.service'
import { z } from 'zod'
import { getSession } from '@/lib/auth';

const magicScrapeSchema = z.object({
  url: z.string().url(),
  resumeId: z.string().uuid().optional(),
  notes: z.string().optional()
});

const SCRAPER_API_URL = process.env.SCRAPER_API_URL || 'http://0.0.0.0:8000';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const  userId  = session?.id;
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const validatedData = magicScrapeSchema.parse(body);

    // Call the scraper API
    const scrapeResponse = await fetch(`${SCRAPER_API_URL}/scrape/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: validatedData.url,
      }),
    });

    if (!scrapeResponse.ok) {
      const error = await scrapeResponse.text();
      throw new Error(`Scraper API error: ${error}`);
    }

    const scrapedData = await scrapeResponse.json();

    // Create job from scraped data
    const jobService = new JobService();
    const job = await jobService.createFromScrape(userId, scrapedData, validatedData);

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error('Magic scrape error:', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }
    return new NextResponse(
      'Internal Server Error', 
      { status: 500 }
    );
  }
}

