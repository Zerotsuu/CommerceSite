// app/api/manga/[id]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const manga = await prisma.manga.findUnique({
      where: { id: parseInt(params.id) }
    });
    
    if (!manga) {
      return NextResponse.json(
        { error: 'Manga not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(manga);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch manga' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const mangaId = parseInt(params.id);
    const data = await request.json();

    // Validate the manga exists
    const existingManga = await prisma.manga.findUnique({
      where: { id: mangaId }
    });

    if (!existingManga) {
      return NextResponse.json(
        { error: 'Manga not found' },
        { status: 404 }
      );
    }

    // Remove any undefined values from the update data
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    // Validate numeric fields
    if ('price' in updateData) {
      const price = parseFloat(String(updateData.price));
      if (isNaN(price) || price < 0) {
        return NextResponse.json(
          { error: 'Invalid price' },
          { status: 400 }
        );
       
      }
      updateData.price = price;
    }

    if ('volumes' in updateData) {
      const volumes = parseInt(String(updateData.volumes));
      if (isNaN(volumes) || volumes < 0) {
        return NextResponse.json(
          { error: 'Invalid volumes' },
          { status: 400 }
        );
      }
      updateData.volumes = volumes;
    }

    if ('chapters' in updateData) {
      const chapters = parseInt(String(updateData.volumes));
      if (isNaN(chapters) || chapters < 0) {
        return NextResponse.json(
          { error: 'Invalid chapters' },
          { status: 400 }
        );
      }
      updateData.chapters = chapters;
    }

    // Update the manga
    const updatedManga = await prisma.manga.update({
      where: { id: mangaId },
      data: updateData
    });

    return NextResponse.json(updatedManga);
  } catch (error) {
    console.error('Update manga error:', error);
    return NextResponse.json(
      { error: 'Failed to update manga' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const mangaId = parseInt(params.id);

    // Validate the manga exists
    const existingManga = await prisma.manga.findUnique({
      where: { id: mangaId }
    });

    if (!existingManga) {
      return NextResponse.json(
        { error: 'Manga not found' },
        { status: 404 }
      );
    }

    // Delete the manga
    await prisma.manga.delete({
      where: { id: mangaId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete manga error:', error);
    return NextResponse.json(
      { error: 'Failed to delete manga' },
      { status: 500 }
    );
  }
}