// app/page.tsx

import { Button } from "../components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ShoppingCart, Menu, Search } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs"
import { prisma } from '../lib/prisma'
import MangaSearch from '../components/MangaSearch'
import Pagination from '../components/Pagination'

async function getManga(page = 1, limit = 8, search = '') {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search: search
    });

    const response = await fetch(`/api/manga?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching manga:', error);
    return { manga: [], total: 0, limit };
  }
}

export default async function MangaBookstore({ searchParams }: { searchParams: { page?: string, search?: string } }) {
  const page = parseInt(searchParams.page || '1')
  const search = searchParams.search || ''
  const { manga, total, limit } = await getManga(page, 8, search)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-xl font-bold">Manga Haven</span>
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link href="/" className="text-sm font-medium hover:underline">Home</Link>
            <Link href="/catalog" className="text-sm font-medium hover:underline">Catalog</Link>
            <Link href="/about" className="text-sm font-medium hover:underline">About</Link>
            <Link href="/contact" className="text-sm font-medium hover:underline">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <UserButton afterSignOutUrl="/" />
            <Button variant="ghost" size="sm">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Shopping Cart</span>
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Manga Haven</h1>
            <p className="text-xl mb-8">Discover your next favorite manga series!</p>
            <MangaSearch />
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Manga Catalog</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {manga.map((manga: {
                id: string;
                image: string;
                title: string;
                author: string;
                price: number;
              }) => (
                <Card key={manga.id}>
                  <CardHeader>
                    <Image
                      src={manga.image}
                      alt={manga.title}
                      width={200}
                      height={300}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent>
                    <CardTitle>{manga.title}</CardTitle>
                    <p className="text-sm text-gray-500">{manga.author}</p>
                    <p className="text-lg font-bold mt-2">${manga.price.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Add to Cart</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <Pagination currentPage={page} totalPages={Math.ceil(total / limit)} />
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:underline">Home</Link></li>
                <li><Link href="/catalog" className="hover:underline">Catalog</Link></li>
                <li><Link href="/about" className="hover:underline">About Us</Link></li>
                <li><Link href="/contact" className="hover:underline">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><Link href="/shipping" className="hover:underline">Shipping & Returns</Link></li>
                <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
                <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
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