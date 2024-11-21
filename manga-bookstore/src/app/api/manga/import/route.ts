// app/api/manga/import/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { anilistService } from '@/lib/anilist';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    // Check auth
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Safely parse the request body
    let body;
    try {
      body = await request.json();
      console.log('Received request body:', body);
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Validate anilistId
    const anilistId = Number(body?.anilistId);
    if (!anilistId || isNaN(anilistId) || anilistId <= 0) {
      return NextResponse.json(
        { error: 'Invalid Anilist ID' },
        { status: 400 }
      );
    }

    console.log('Checking for existing manga with anilistId:', anilistId);

    // Check for existing manga
    const existingManga = await prisma.manga.findUnique({
      where: { anilistId }
    });

    if (existingManga) {
      return NextResponse.json(
        { error: 'Manga already exists in database' },
        { status: 409 }
      );
    }

    console.log('Fetching manga data from Anilist');

    // Fetch manga data from Anilist
    const anilistManga = await anilistService.getMangaById(anilistId);
    
    if (!anilistManga) {
      return NextResponse.json(
        { error: 'Manga not found on Anilist' },
        { status: 404 }
      );
    }

    console.log('Formatting manga data');

    // Format data for database
    const mangaData = {
      anilistId: anilistManga.id,
      title: anilistManga.title.english || anilistManga.title.romaji,
      author: anilistService.getAuthorFromStaff(anilistManga.staff),
      genres: anilistManga.genres,
      price: 9.99,
      image: anilistManga.coverImage.medium,
      anilistImage: anilistManga.coverImage.medium,
      coverImage: anilistManga.coverImage.large,
      description: anilistManga.description,
      averageScore: anilistManga.averageScore || 0,
      popularity: anilistManga.popularity || 0,
      status: anilistService.normalizeStatus(anilistManga.status)
    };

    console.log('Creating manga in database');

    // Create manga in database
    const manga = await prisma.manga.create({
      data: mangaData
    });

    console.log('Manga created successfully:', manga.id);

    return NextResponse.json(manga);
  } catch (error) {
    // Detailed error logging
    console.error('Import manga error details:', {
      name: error instanceof Error ? error.name : 'Unknown error',
      message: error instanceof Error ? error.message : 'Unknown error message',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred while importing manga' },
      { status: 500 }
    );
  }
}