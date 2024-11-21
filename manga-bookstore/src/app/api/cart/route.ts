import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { manga: true },
  })

  return NextResponse.json(cartItems)
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { mangaId } = await request.json()
  const cartItem = await prisma.cartItem.upsert({
    where: {
      userId_mangaId: {
        userId,
        mangaId,
      },
    },
    update: {
      quantity: { increment: 1 },
    },
    create: {
      userId,
      mangaId,
      quantity: 1,
    },
  })

  return NextResponse.json(cartItem)
}

export async function PUT(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { mangaId, quantity } = await request.json()
  const cartItem = await prisma.cartItem.update({
    where: {
      userId_mangaId: {
        userId,
        mangaId,
      },
    },
    data: { quantity },
  })

  return NextResponse.json(cartItem)
}

export async function DELETE(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { mangaId } = await request.json()
  await prisma.cartItem.delete({
    where: {
      userId_mangaId: {
        userId,
        mangaId,
      },
    },
  })

  return NextResponse.json({ success: true })
}