  // app/api/manga/search/route.ts
  import { NextResponse } from 'next/server';
  import { prisma } from '@/lib/prisma';
  import type { MangaSearchParams } from '@/lib/manga';
  
  export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') as MangaSearchParams['sortBy'] || 'title';
    const sortOrder = searchParams.get('sortOrder') as MangaSearchParams['sortOrder'] || 'asc';
  
    const skip = (page - 1) * limit;
  
    try {
      const [manga, total] = await Promise.all([
        prisma.manga.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { author: { contains: query, mode: 'insensitive' } },
              { genres: { hasSome: [query] } }
            ]
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        prisma.manga.count({
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { author: { contains: query, mode: 'insensitive' } },
              { genres: { hasSome: [query] } }
            ]
          },
        })
      ]);
  
      return NextResponse.json({
        manga,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error('Manga search error:', error);
      return NextResponse.json({ error: 'Failed to search manga' }, { status: 500 });
    }
  }