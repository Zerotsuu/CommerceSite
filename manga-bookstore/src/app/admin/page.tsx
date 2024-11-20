// app/admin/page.tsx

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminMangaList from '@/components/AdminMangaList'

export default async function AdminPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user?.isAdmin) {
    redirect('/')
  }

  const manga = await prisma.manga.findMany()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <AdminMangaList initialManga={manga} />
    </div>
  )
}