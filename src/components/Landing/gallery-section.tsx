'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GalleryGlobal as GalleryGlobalType, Media, Gallery as GalleryType } from '@/payload-types'

export default function GallerySection({
  gallerySectionData,
}: {
  gallerySectionData: GalleryGlobalType
}) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const desktopGalleryRef = useRef<HTMLDivElement>(null)
  const galleries = gallerySectionData.selectedGalleries as GalleryType[]

  const images = galleries

  const handleDesktopScroll = (direction: 'left' | 'right') => {
    const container = desktopGalleryRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.9
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section id="gallery" className="py-24 bg-ultra-black">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Career <span className="text-ultra-orange">Highlights</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Visual moments from my professional journey and key milestones.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <div className="hidden sm:block absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 z-10">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-ultra-gray-dark/80 backdrop-blur-sm hover:bg-ultra-orange hover:text-ultra-black border-ultra-gray-light"
              onClick={() => handleDesktopScroll('left')}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous images</span>
            </Button>
          </div>

          <div className="sm:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
            {galleries.map((gallery, index) => {
              const image = gallery.image as Media
              return (
                <div
                  key={gallery.id}
                  className="snap-start shrink-0 w-full relative group cursor-pointer overflow-hidden rounded-lg border border-ultra-gray"
                  onClick={() => setSelectedImage(index)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-ultra-black/80 via-transparent to-transparent z-10"></div>
                  <div className="absolute bottom-0 left-0 w-1 h-1/3 bg-ultra-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <Image
                    src={
                      (image && typeof image === 'object' && 'url' in image
                        ? image.url
                        : '/placeholder.svg') as string
                    }
                    alt={gallery.alt || 'Image'}
                    width={600}
                    height={400}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-ultra-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-end z-20">
                    <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-sm font-medium text-ultra-orange">{gallery.year}</span>
                      <h3 className="text-lg font-bold">{gallery.description}</h3>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div
            ref={desktopGalleryRef}
            className="hidden sm:flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {galleries.map((gallery, index) => {
              const image = gallery.image as Media
              return (
                <div
                  key={gallery.id}
                  className="snap-start shrink-0 sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)] relative group cursor-pointer overflow-hidden rounded-lg border border-ultra-gray"
                  onClick={() => setSelectedImage(index)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-ultra-black/80 via-transparent to-transparent z-10"></div>
                  <div className="absolute bottom-0 left-0 w-1 h-1/3 bg-ultra-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <Image
                    src={
                      (image && typeof image === 'object' && 'url' in image
                        ? image.url
                        : '/placeholder.svg') as string
                    }
                    alt={gallery.alt || 'Image'}
                    width={600}
                    height={400}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-ultra-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-end z-20">
                    <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-sm font-medium text-ultra-orange">{gallery.year}</span>
                      <h3 className="text-lg font-bold">{gallery.description}</h3>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="hidden sm:block absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 z-10">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-ultra-gray-dark/80 backdrop-blur-sm hover:bg-ultra-orange hover:text-ultra-black border-ultra-gray-light"
              onClick={() => handleDesktopScroll('right')}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next images</span>
            </Button>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-gray-400">
          Swipe left or right to browse more highlights
        </p>

        <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl bg-ultra-gray-dark border-ultra-gray p-0">
            <DialogTitle className="sr-only">Image Details</DialogTitle>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 z-10 bg-ultra-black/50 rounded-full p-2 hover:bg-ultra-orange hover:text-ultra-black transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {selectedImage !== null && (
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/3 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-ultra-black/80 via-transparent to-transparent pointer-events-none z-10"></div>
                  <Image
                    src={
                      (images[selectedImage]?.image &&
                      typeof images[selectedImage].image === 'object' &&
                      'url' in images[selectedImage].image
                        ? images[selectedImage].image.url
                        : '/placeholder.svg') as string
                    }
                    alt={images[selectedImage]?.alt || 'Image'}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full md:w-1/3 p-6 flex flex-col justify-center">
                  <span className="text-sm font-medium text-ultra-orange">
                    {images[selectedImage]?.year || ''}
                  </span>
                  <h3 className="text-xl font-bold mb-3">
                    {images[selectedImage]?.description || ''}
                  </h3>
                  <p className="text-gray-300">
                    {images[selectedImage]?.fullDescription || ''}

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
