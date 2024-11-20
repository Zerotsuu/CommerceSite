// app/api/wishlist/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { userId },
    include: { manga: true },
  })

  return NextResponse.json(wishlistItems)
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { mangaId } = await request.json()
  const wishlistItem = await prisma.wishlistItem.create({
    data: { userId, mangaId },
  })

  return NextResponse.json(wishlistItem)
}