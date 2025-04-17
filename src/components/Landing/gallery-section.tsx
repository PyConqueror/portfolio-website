'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { X } from 'lucide-react'

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const images = [
    {
      id: 1,
      src: '/placeholder.svg?height=400&width=600',
      alt: 'Conference presentation',
      year: '2022',
      description: 'Speaking at Tech Conference',
    },
    {
      id: 2,
      src: '/placeholder.svg?height=400&width=600',
      alt: 'Award ceremony',
      year: '2021',
      description: 'Receiving Industry Award',
    },
    {
      id: 3,
      src: '/placeholder.svg?height=400&width=600',
      alt: 'Team collaboration',
      year: '2020',
      description: 'Leading Design Workshop',
    },
    {
      id: 4,
      src: '/placeholder.svg?height=400&width=600',
      alt: 'Project launch',
      year: '2019',
      description: 'Major Project Launch',
    },
    {
      id: 5,
      src: '/placeholder.svg?height=400&width=600',
      alt: 'Hackathon',
      year: '2018',
      description: 'Winning Hackathon',
    },
    {
      id: 6,
      src: '/placeholder.svg?height=400&width=600',
      alt: 'First job',
      year: '2017',
      description: 'First Professional Role',
    },
  ]

  return (
    <section id="gallery" className="py-24 bg-ultra-black">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Career <span className="text-ultra-orange">Highlights</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Visual moments from my professional journey and key milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative group cursor-pointer overflow-hidden rounded-lg border border-ultra-gray"
              onClick={() => setSelectedImage(index)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-ultra-black/80 via-transparent to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 w-1 h-1/3 bg-ultra-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              <Image
                src={image.src || '/placeholder.svg'}
                alt={image.alt}
                width={600}
                height={400}
                className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ultra-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-end z-20">
                <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-sm font-medium text-ultra-orange">{image.year}</span>
                  <h3 className="text-lg font-bold">{image.description}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl bg-ultra-gray-dark border-ultra-gray p-0">
            <DialogTitle className="sr-only">
              {selectedImage !== null && images[selectedImage]
                ? images[selectedImage].description
                : 'Gallery Image'}
            </DialogTitle>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 z-10 bg-ultra-black/50 rounded-full p-2 hover:bg-ultra-orange hover:text-black transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {selectedImage !== null && images[selectedImage] && (
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/3 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-ultra-black/80 via-transparent to-transparent pointer-events-none z-10"></div>
                  <Image
                    src={images[selectedImage].src || '/placeholder.svg'}
                    alt={images[selectedImage].alt}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full md:w-1/3 p-6 flex flex-col justify-center">
                  <span className="text-sm font-medium text-ultra-orange">
                    {images[selectedImage].year}
                  </span>
                  <h3 className="text-xl font-bold mb-3">{images[selectedImage].description}</h3>
                  <p className="text-gray-400">
                    A significant moment in my professional journey that showcases my growth and
                    expertise in the field.
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
