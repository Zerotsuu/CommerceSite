import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import AddToCartButton from '@/components/AddToCartButton'
import MangaPages from '@/components/MangaPages'

export default async function MangaPage({ params }: { params: { id: string } }) {
  const manga = await prisma.manga.findUnique({
    where: { id: parseInt(params.id) },
  })

  if (!manga) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Image
            src={manga.image}
            alt={manga.title}
            width={400}
            height={600}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{manga.title}</h1>
          <p className="text-xl mb-2">By {manga.author}</p>
          <p className="text-2xl font-bold mb-4">${manga.price.toFixed(2)}</p>
          <p className="mb-6">{manga.description}</p>
          <AddToCartButton mangaId={manga.id} />
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Preview Pages</h2>
        <MangaPages />
      </div>
    </div>
  )
}