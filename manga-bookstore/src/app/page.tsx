'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ShoppingCart, Menu } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs"
import MangaSearch from '@/components/MangaSearch'
import Pagination from '@/components/Pagination'

export default function MangaBookstore() {
  const { isSignedIn, user } = useUser()
  const [manga, setManga] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchManga()
  }, [page, search])

  const fetchManga = async () => {
    const response = await fetch(`/api/manga?page=${page}&limit=8&search=${search}`)
    const data = await response.json()
    setManga(data.manga)
    setTotalPages(data.totalPages)
  }

  return (
    <div className="flex flex-col min-h-screen">
      

      <main className="flex-grow">
        <section className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Manga Haven</h1>
            <p className="text-xl mb-8">Discover your next favorite manga series!</p>
            <MangaSearch onSearch={setSearch} />
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Manga Catalog</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {manga.map((item:any) => (
                <Card key={item.id}>
                  <CardHeader>
                    <Image
                      src={item.image || "/placeholder.svg?height=300&width=200"}
                      alt={item.title}
                      width={200}
                      height={300}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent>
                    <CardTitle>{item.title}</CardTitle>
                    <p className="text-sm text-gray-500">{item.author}</p>
                    <p className="text-lg font-bold mt-2">${item.price.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/manga/${item.id}`} className="w-full">
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:underline">Home</Link></li>
                <li><Link href="#" className="hover:underline">Catalog</Link></li>
                <li><Link href="#" className="hover:underline">About Us</Link></li>
                <li><Link href="#" className="hover:underline">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:underline">Shipping & Returns</Link></li>
                <li><Link href="#" className="hover:underline">FAQ</Link></li>
                <li><Link href="#" className="hover:underline">Terms of Service</Link></li>
                <li><Link href="#" className="hover:underline">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="mb-4">Stay updated with our latest releases and promotions!</p>
              <form className="flex">
                <Input type="email" placeholder="Enter your email" className="mr-2" />
                <Button type="submit">Subscribe</Button>
              </form>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Manga Haven. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}