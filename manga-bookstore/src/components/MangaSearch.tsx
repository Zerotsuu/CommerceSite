'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function MangaSearch({ onSearch }: { onSearch: (search: string) => void }) {
  const [search, setSearch] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(search)
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
      <Button type="submit">Search</Button>
    </form>
  )
}