import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import CartItems from '@/components/CartItems'

export default async function CartPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { manga: true },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <CartItems initialCartItems={cartItems} />
    </div>
  )
}