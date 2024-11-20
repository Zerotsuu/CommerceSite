// components/Pagination.tsx

import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Pagination({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  return (
    <div className="flex justify-center space-x-2 mt-8">
      {currentPage > 1 && (
        <Link href={`/?page=${currentPage - 1}`} passHref>
          <Button variant="outline">Previous</Button>
        </Link>
      )}
      {currentPage < totalPages && (
        <Link href={`/?page=${currentPage + 1}`} passHref>
          <Button variant="outline">Next</Button>
        </Link>
      )}
    </div>
  )
}