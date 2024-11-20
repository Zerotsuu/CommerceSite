// prisma/seed.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const mangas = [
    { title: "One Piece", author: "Eiichiro Oda", price: 9.99, image: "/placeholder.svg?height=300&width=200" },
    { title: "Naruto", author: "Masashi Kishimoto", price: 8.99, image: "/placeholder.svg?height=300&width=200" },
    { title: "Attack on Titan", author: "Hajime Isayama", price: 10.99, image: "/placeholder.svg?height=300&width=200" },
    { title: "My Hero Academia", author: "Kohei Horikoshi", price: 7.99, image: "/placeholder.svg?height=300&width=200" },
  ]

  for (const manga of mangas) {
    await prisma.manga.create({
      data: manga,
    })
  }

  console.log('Seed data inserted successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })