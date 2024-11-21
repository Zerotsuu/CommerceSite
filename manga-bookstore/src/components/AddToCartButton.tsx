'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function AddToCartButton({ mangaId }: { mangaId: number }) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const addToCart = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mangaId }),
      })

      if (!response.ok) {
        throw new Error('Failed to add to cart')
      }

      toast({
        title: "Added to cart",
        description: "The manga has been added to your cart.",
      })
    } catch{
      toast({
        title: "Error",
        description: "Failed to add the manga to your cart.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={addToCart} disabled={isLoading}>
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </Button>
  )
}