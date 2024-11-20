// components/AdminMangaList.tsx

'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type Manga = {
  id: number
  title: string
  author: string
  price: number
  image: string
  description: string
}

export default function AdminMangaList({ initialManga }: { initialManga: Manga[] }) {
  const [manga, setManga] = useState(initialManga)
  const [newManga, setNewManga] = useState({ title: '', author: '', price: 0, image: '', description: '' })

  const handleCreate = async () => {
    const response = await fetch('/api/manga', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newManga),
    })
    const createdManga = await response.json()
    setManga([...manga, createdManga])
    setNewManga({ title: '', author: '', price: 0, image: '', description: '' })
  }

  const handleUpdate = async (id: number, updatedManga: Partial<Manga>) => {
    const response = await fetch(`/api/manga/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedManga),
    })
    const updated = await response.json()
    setManga(manga.map(m => m.id === id ? updated : m))
  }

  const handleDelete = async (id: number) => {
    await fetch(`/api/manga/${id}`, { method: 'DELETE' })
    setManga(manga.filter(m => m.id !== id))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Manga</h2>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Manga</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={newManga.title}
              onChange={(e) => setNewManga({ ...newManga, title: e.target.value })}
            />
            <Input
              placeholder="Author"
              value={newManga.author}
              onChange={(e) => setNewManga({ ...newManga, author: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Price"
              value={newManga.price}
              onChange={(e) => setNewManga({ ...newManga, price: parseFloat(e.target.value) })}
            />
            <Input
              placeholder="Image URL"
              value={newManga.image}
              onChange={(e) => setNewManga({ ...newManga, image: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={newManga.description}
              onChange={(e) => setNewManga({ ...newManga, description: e.target.value })}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreate}>Add Manga</Button>
        </CardFooter>
      </Card>
      <div className="space-y-4">
        {manga.map((m) => (
          <Card key={m.id}>
            <CardHeader>
              <CardTitle>{m.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Author: {m.author}</p>
              <p>Price: ${m.price.toFixed(2)}</p>
              <img src={m.image} alt={m.title} className="w-32 h-48 object-cover mt-2" />
              <p className="mt-2">{m.description}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleUpdate(m.id, { price: m.price + 1 })} className="mr-2">
                Increase Price
              </Button>
              <Button onClick={() => handleDelete(m.id)} variant="destructive">
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}