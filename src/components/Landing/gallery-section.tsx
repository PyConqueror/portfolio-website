'use client'

import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, type PanInfo, type Variants } from 'motion/react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCarousel } from '@/hooks/use-carousel'
import { GalleryGlobal as GalleryGlobalType, Media, Gallery as GalleryType } from '@/payload-types'
import CarouselControls from './carousel-controls'
import SectionHeading from './section-heading'
import { EASE_OUT, Stagger, StaggerItem } from './motion'

const SWIPE_OFFSET = 80
const SWIPE_VELOCITY = 500

const slideVariants: Variants = {
  enter: (direction: number) => ({ x: direction >= 0 ? '30%' : '-30%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction >= 0 ? '-30%' : '30%', opacity: 0 }),
}

const lightboxArrowClassName =
  'absolute top-1/2 z-20 -translate-y-1/2 rounded-full bg-ultra-black/60 p-2 backdrop-blur-sm transition-colors hover:bg-ultra-orange hover:text-ultra-black'

function getImageUrl(gallery?: GalleryType) {
  const image = gallery?.image as Media | string | undefined
  return (image && typeof image === 'object' && 'url' in image ? image.url : '/placeholder.svg') as string
}

export default function GallerySection({
  gallerySectionData,
}: {
  gallerySectionData: GalleryGlobalType
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const { ref: carouselRef, ...carousel } = useCarousel()
  const galleries = gallerySectionData.selectedGalleries as GalleryType[]
  const activeGallery = galleries[activeIndex]

  const openLightbox = (index: number) => {
    setDirection(0)
    setActiveIndex(index)
    setLightboxOpen(true)
  }

  const showAdjacent = (step: 1 | -1) => {
    if (galleries.length < 2) return
    setDirection(step)
    setActiveIndex((index) => (index + step + galleries.length) % galleries.length)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') showAdjacent(1)
    if (event.key === 'ArrowLeft') showAdjacent(-1)
  }

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) showAdjacent(1)
    else if (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY) showAdjacent(-1)
  }

  return (
    <section id="gallery" className="py-24 md:py-32 bg-ultra-black">
      <div className="container mx-auto px-4">
        <SectionHeading
          index="04"
          eyebrow="Milestones"
          title="Career"
          highlight="Highlights"
          description="Visual moments from my professional journey and key milestones."
          className="mb-16"
        />

        <div
          ref={carouselRef}
          className="overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <Stagger className="flex gap-4">
            {galleries.map((gallery, index) => (
              <StaggerItem
                key={gallery.id}
                className="snap-start shrink-0 w-[85%] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
              >
                <button
                  type="button"
                  className="relative block w-full group cursor-pointer overflow-hidden rounded-lg border border-ultra-gray text-left transition-colors duration-300 hover:border-ultra-orange/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ultra-orange"
                  onClick={() => openLightbox(index)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-ultra-black/80 via-transparent to-transparent z-10"></div>
                  <div className="absolute bottom-0 left-0 w-1 h-0 bg-ultra-orange transition-all duration-500 group-hover:h-1/3 z-30"></div>
                  <Image
                    src={getImageUrl(gallery)}
                    alt={gallery.alt || 'Image'}
                    width={600}
                    height={400}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-ultra-black/0 group-hover:bg-ultra-black/60 transition-colors duration-300 flex items-end z-20">
                    <div className="p-4 transition-transform duration-300 [@media(hover:hover)]:translate-y-full [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-focus-visible:translate-y-0">
                      <span className="text-sm font-medium text-ultra-orange">{gallery.year}</span>
                      <h3 className="text-lg font-bold">{gallery.description}</h3>
                    </div>
                  </div>
                </button>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <CarouselControls
          label="highlights"
          canPrev={carousel.canPrev}
          canNext={carousel.canNext}
          pageCount={carousel.pageCount}
          activePage={carousel.activePage}
          onPrev={() => carousel.scrollByDirection('left')}
          onNext={() => carousel.scrollByDirection('right')}
          onSelectPage={carousel.scrollToPage}
        />
        <p className="mt-3 text-center text-xs text-gray-400 md:hidden">
          Swipe left or right to browse more highlights
        </p>

        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent
            aria-describedby={undefined}
            onKeyDown={handleKeyDown}
            className="w-[calc(100%-1.5rem)] max-w-4xl max-h-[90svh] overflow-y-auto overflow-x-hidden gap-0 rounded-xl bg-ultra-gray-dark border-ultra-gray p-0 [&>button:last-child]:z-30 [&>button:last-child]:rounded-full [&>button:last-child]:bg-ultra-black/60 [&>button:last-child]:p-2 [&>button:last-child]:opacity-100 [&>button:last-child]:backdrop-blur-sm [&>button:last-child]:transition-colors [&>button:last-child:hover]:bg-ultra-orange [&>button:last-child:hover]:text-ultra-black [&>button:last-child>svg]:h-5 [&>button:last-child>svg]:w-5"
          >
            {activeGallery && (
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-ultra-black md:w-2/3">
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                      key={activeIndex}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.45, ease: EASE_OUT }}
                      drag={galleries.length > 1 ? 'x' : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.6}
                      onDragEnd={handleDragEnd}
                      className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    >
                      <Image
                        src={getImageUrl(activeGallery)}
                        alt={activeGallery.alt || 'Image'}
                        fill
                        sizes="(min-width: 768px) 600px, 100vw"
                        draggable={false}
                        className="pointer-events-none select-none object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-ultra-black/80 via-transparent to-transparent pointer-events-none z-10"></div>

                  {galleries.length > 1 && (
                    <>
                      <button
                        type="button"
                        className={`${lightboxArrowClassName} left-3`}
                        onClick={() => showAdjacent(-1)}
                      >
                        <ChevronLeft className="h-5 w-5" />
                        <span className="sr-only">Previous image</span>
                      </button>
                      <button
                        type="button"
                        className={`${lightboxArrowClassName} right-3`}
                        onClick={() => showAdjacent(1)}
                      >
                        <ChevronRight className="h-5 w-5" />
                        <span className="sr-only">Next image</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="w-full md:w-1/3 p-6 flex flex-col justify-center">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25, ease: EASE_OUT }}
                    >
                      <span className="block mb-4 text-xs font-medium tracking-[0.3em] text-gray-500">
                        {String(activeIndex + 1).padStart(2, '0')} / {String(galleries.length).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-medium text-ultra-orange">
                        {activeGallery.year || ''}
                      </span>
                      <DialogTitle className="text-xl font-bold mb-3 leading-snug">
                        {activeGallery.description || ''}
                      </DialogTitle>
                      <p className="text-gray-300">{activeGallery.fullDescription || ''}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
