'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs"
import { BookOpen, ShoppingCart, Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Navigation() {
  const { isSignedIn, user } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Catalog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  const NavigationItems = () => (
    <>
      {navigationLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="text-sm font-medium hover:underline"
        >
          {link.label}
        </Link>
      ))}
    </>
  )

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-xl font-bold">Manga Haven</span>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <NavigationItems />
            {user?.publicMetadata?.role === 'admin' && (
              <Link href="/admin" className="text-sm font-medium text-purple-600 hover:underline">
                Admin Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="sm">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Shopping Cart</span>
              </Button>
            </Link>

            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <span className="hidden md:inline text-sm">
                  Welcome, {user.firstName}!
                </span>
                <SignOutButton>
                  <Button variant="outline" size="sm">
                    Sign out
                  </Button>
                </SignOutButton>
              </div>
            ) : (
              <SignInButton>
                <Button variant="outline" size="sm">
                  Sign in
                </Button>
              </SignInButton>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <nav className="flex flex-col space-y-4 mt-6">
                  <NavigationItems />
                  {user?.publicMetadata?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="text-sm font-medium text-purple-600 hover:underline"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}