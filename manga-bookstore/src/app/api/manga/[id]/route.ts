// app/api/manga/[id]/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const manga = await prisma.manga.findUnique({
    where: { id: parseInt(params.id) },
  })
  return NextResponse.json(manga)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json()
  const manga = await prisma.manga.update({
    where: { id: parseInt(params.id) },
    data,
  })
  return NextResponse.json(manga)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const manga = await prisma.manga.delete({
    where: { id: parseInt(params.id) },
  })
  return NextResponse.json(manga)
}