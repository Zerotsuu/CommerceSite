// components/MangaSearch.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'

export default function MangaSearch() {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/?search=${encodeURIComponent(search)}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex justify-center">
      <Input 
        type="search" 
        placeholder="Search for manga..." 
        className="w-full max-w-sm mr-2 bg-white text-gray-900"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button type="submit">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  )
}