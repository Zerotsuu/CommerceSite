'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

// In a real application, you'd fetch these from an API
const dummyPages = [
  '/placeholder.svg?height=600&width=400&text=Page 1',
  '/placeholder.svg?height=600&width=400&text=Page 2',
  '/placeholder.svg?height=600&width=400&text=Page 3',
]

export default function MangaPages({ mangaId }: { mangaId: number }) {
  const [currentPage, setCurrentPage] = useState(0)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % dummyPages.length)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + dummyPages.length) % dummyPages.length)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-lg">
        <Image
          src={dummyPages[currentPage]}
          alt={`Page ${currentPage + 1}`}
          width={400}
          height={600}
          className="w-full h-auto rounded-lg shadow-lg"
        />
        <Button
          variant="outline"
          size="sm"
          className="absolute top-1/2 left-2 transform -translate-y-1/2"
          onClick={prevPage}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="absolute top-1/2 right-2 transform -translate-y-1/2"
          onClick={nextPage}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
      <p className="mt-4 text-lg">
        Page {currentPage + 1} of {dummyPages.length}
      </p>
    </div>
  )
}