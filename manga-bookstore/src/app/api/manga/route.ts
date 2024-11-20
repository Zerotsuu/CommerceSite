// app/api/manga/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const search = searchParams.get('search') || ''

  const skip = (page - 1) * limit

  const manga = await prisma.manga.findMany({
    where: {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ],
    },
    skip,
    take: limit,
  })

  const total = await prisma.manga.count({
    where: {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ],
    },
  })

  return NextResponse.json({ manga, total, page, limit })
}

export async function POST(request: Request) {
  const data = await request.json()
  const manga = await prisma.manga.create({ data })
  return NextResponse.json(manga)
}