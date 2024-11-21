'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

type CartItem = {
  id: number
  mangaId: number
  quantity: number
  manga: {
    id: number
    title: string
    price: number
    image: string
  }
}

export default function CartItems({ initialCartItems }: { initialCartItems: CartItem[] }) {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const { toast } = useToast()

  const updateQuantity = async (mangaId: number, newQuantity: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mangaId, quantity: newQuantity }),
      })

      if (!response.ok) {
        throw new Error('Failed to update cart')
      }

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.mangaId === mangaId ? { ...item, quantity: newQuantity } : item
        )
      )

      toast({
        title: "Cart updated",
        description: "The quantity has been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the cart.",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (mangaId: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mangaId }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove item from cart')
      }

      setCartItems(prevItems => prevItems.filter(item => item.mangaId !== mangaId))

      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove the item from your cart.",
        variant: "destructive",
      })
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.manga.price * item.quantity, 0)

  return (
    <div>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 mb-4">
              <Image
                src={item.manga.image}
                alt={item.manga.title}
                width={80}
                height={120}
                className="rounded-lg"
              />
              <div className="flex-grow">
                <h3 className="font-bold">{item.manga.title}</h3>
                <p>${item.manga.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.mangaId, parseInt(e.target.value))}
                  className="w-16"
                />
                <Button variant="destructive" onClick={() => removeItem(item.mangaId)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <div className="mt-8">
            <h3 className="text-xl font-bold">Total: ${total.toFixed(2)}</h3>
            <Button className="mt-4">Proceed to Checkout</Button>
          </div>
        </>
      )}
    </div>
  )
}