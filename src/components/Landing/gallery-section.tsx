'use client'

import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import Image from 'next/image'
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type PanInfo,
  type Variants,
} from 'motion/react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCarousel } from '@/hooks/use-carousel'
import { cn } from '@/lib/utils'
import { GalleryGlobal as GalleryGlobalType, Media, Gallery as GalleryType } from '@/payload-types'
import { AuroraBackdrop } from './aurora-backdrop'
import SectionHeading, { sectionLabelClassName } from './section-heading'
import { EASE_OUT, wipeVariants } from './motion'

const EASE_EXPO = [0.19, 1, 0.22, 1] as const
const SWIPE_OFFSET = 80
const SWIPE_VELOCITY = 500
const DESKTOP_COLUMNS = 3
// Each column drifts by a different amount over the section's scroll, so they slide past each other.
const COLUMN_DRIFT = [40, 140, 80] as const
const ASPECTS = ['aspect-[4/5]', 'aspect-[4/3]', 'aspect-[3/4]']

const slideVariants: Variants = {
  enter: (direction: number) => ({ x: direction >= 0 ? '30%' : '-30%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction >= 0 ? '-30%' : '30%', opacity: 0 }),
}

const captionVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE_EXPO, delay: 0.15 } },
}

const roundButtonClassName =
  'flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition-colors duration-500 hover:border-white'
const arrowClassName =
  'flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-500 hover:border-white disabled:pointer-events-none disabled:opacity-30'

const pad = (value: number) => String(value).padStart(2, '0')

function getImageUrl(gallery?: GalleryType) {
  const image = gallery?.image as Media | string | undefined
  return (
    image && typeof image === 'object' && 'url' in image ? image.url : '/placeholder.svg'
  ) as string
}

function GalleryItem({
  gallery,
  index,
  aspectClassName,
  sizes,
  className,
  onOpen,
}: {
  gallery: GalleryType
  index: number
  aspectClassName: string
  sizes: string
  className?: string
  onOpen: (index: number) => void
}) {
  return (
    <motion.button
      type="button"
      data-cursor="View"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      onClick={() => onOpen(index)}
      className={cn(
        'group block w-full text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black',
        className,
      )}
    >
      <motion.div
        variants={wipeVariants}
        className={cn('relative w-full overflow-hidden bg-white/5', aspectClassName)}
      >
        <Image
          src={getImageUrl(gallery)}
          alt={gallery.alt || 'Image'}
          fill
          sizes={sizes}
          className="object-cover transition-transform [transition-duration:1250ms] [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
        />
      </motion.div>
      <motion.div variants={captionVariants} className="mt-4 flex items-baseline gap-4">
        <span className={cn(sectionLabelClassName, 'shrink-0')}>({gallery.year})</span>
        <h3 className="text-sm leading-relaxed text-white/75 transition-colors duration-500 group-hover:text-white">
          {gallery.description}
        </h3>
      </motion.div>
    </motion.button>
  )
}

export default function GallerySection({
  gallerySectionData,
}: {
  gallerySectionData: GalleryGlobalType
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const galleries = gallerySectionData.selectedGalleries as GalleryType[]
  const activeGallery = galleries[activeIndex]

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const columnY = [
    useTransform(scrollYProgress, [0, 1], [COLUMN_DRIFT[0], -COLUMN_DRIFT[0]]),
    useTransform(scrollYProgress, [0, 1], [COLUMN_DRIFT[1], -COLUMN_DRIFT[1]]),
    useTransform(scrollYProgress, [0, 1], [COLUMN_DRIFT[2], -COLUMN_DRIFT[2]]),
  ]

  const columns = Array.from({ length: DESKTOP_COLUMNS }, (_, column) =>
    galleries.flatMap((gallery, index) =>
      index % DESKTOP_COLUMNS === column ? [{ gallery, index }] : [],
    ),
  )

  const { ref: carouselRef, ...carousel } = useCarousel()
  const { scrollXProgress } = useScroll({ container: carouselRef, axis: 'x' })
  const counter = useTransform(scrollXProgress, (progress) =>
    pad(Math.round(progress * (galleries.length - 1)) + 1),
  )

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
    <section
      id="gallery"
      ref={sectionRef}
      className="relative overflow-clip bg-ultra-black py-28 text-white md:py-40"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="sticky top-0 h-[100lvh]">
          <AuroraBackdrop progress={scrollYProgress} className="absolute inset-0" />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1078px] px-6">
        <SectionHeading
          index="04"
          label="Gallery"
          meta={`(${pad(galleries.length)})`}
          lines={[
            'Career ',
            <>
              h<em>i</em>ghlights
            </>,
          ]}
          description="Visual moments from my professional journey and key milestones."
        />

        <div className="mt-28 hidden grid-cols-3 gap-8 md:grid">
          {columns.map((items, column) => (
            <motion.div
              key={column}
              style={{ y: columnY[column] }}
              className={cn(
                'flex flex-col gap-16 motion-reduce:!transform-none',
                column === 1 && 'pt-24',
              )}
            >
              {items.map(({ gallery, index }) => (
                <GalleryItem
                  key={gallery.id}
                  gallery={gallery}
                  index={index}
                  aspectClassName={ASPECTS[index % ASPECTS.length] ?? 'aspect-[4/5]'}
                  sizes="33vw"
                  onOpen={openLightbox}
                />
              ))}
            </motion.div>
          ))}
        </div>

        <div
          ref={carouselRef}
          className="-mx-6 mt-16 snap-x snap-mandatory scroll-px-6 overflow-x-auto overscroll-x-contain [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max gap-6 px-6">
            {galleries.map((gallery, index) => (
              <GalleryItem
                key={gallery.id}
                gallery={gallery}
                index={index}
                aspectClassName="aspect-[4/5]"
                sizes="78vw"
                className="w-[78vw] shrink-0 snap-start"
                onOpen={openLightbox}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center gap-4 md:hidden">
          <span className={sectionLabelClassName}>
            <motion.span>{counter}</motion.span> / {pad(galleries.length)}
          </span>
          <span className="relative h-px flex-1 bg-white/15">
            <motion.span
              style={{ scaleX: scrollXProgress }}
              className="absolute inset-0 origin-left bg-white"
            />
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              className={arrowClassName}
              onClick={() => carousel.scrollByDirection('left')}
              disabled={!carousel.canPrev}
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.25} />
              <span className="sr-only">Previous highlights</span>
            </button>
            <button
              type="button"
              className={arrowClassName}
              onClick={() => carousel.scrollByDirection('right')}
              disabled={!carousel.canNext}
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.25} />
              <span className="sr-only">Next highlights</span>
            </button>
          </div>
        </div>

        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent
            aria-describedby={undefined}
            onKeyDown={handleKeyDown}
            className="max-h-[90svh] w-[calc(100%-1.5rem)] max-w-5xl gap-0 overflow-y-auto overflow-x-hidden rounded-none border-white/15 bg-ultra-black p-0 text-white sm:rounded-none [&>button:last-child]:z-30 [&>button:last-child]:flex [&>button:last-child]:h-10 [&>button:last-child]:w-10 [&>button:last-child]:items-center [&>button:last-child]:justify-center [&>button:last-child]:rounded-full [&>button:last-child]:border [&>button:last-child]:border-white/30 [&>button:last-child]:bg-black/40 [&>button:last-child]:opacity-100 [&>button:last-child]:backdrop-blur-sm [&>button:last-child]:transition-colors [&>button:last-child:hover]:border-white"
          >
            {activeGallery && (
              <div className="flex flex-col md:flex-row">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black md:w-2/3">
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
                        sizes="(min-width: 768px) 680px, 100vw"
                        draggable={false}
                        className="pointer-events-none select-none object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {galleries.length > 1 && (
                    <>
                      <button
                        type="button"
                        className={cn(
                          roundButtonClassName,
                          'absolute left-3 top-1/2 z-20 -translate-y-1/2',
                        )}
                        onClick={() => showAdjacent(-1)}
                      >
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.25} />
                        <span className="sr-only">Previous image</span>
                      </button>
                      <button
                        type="button"
                        className={cn(
                          roundButtonClassName,
                          'absolute right-3 top-1/2 z-20 -translate-y-1/2',
                        )}
                        onClick={() => showAdjacent(1)}
                      >
                        <ArrowRight className="h-4 w-4" strokeWidth={1.25} />
                        <span className="sr-only">Next image</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="flex w-full flex-col justify-end p-6 md:w-1/3 md:p-8">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25, ease: EASE_OUT }}
                    >
                      <div className="mb-6 flex items-baseline justify-between border-t border-white/20 pt-3">
                        <span className={sectionLabelClassName}>
                          {pad(activeIndex + 1)} / {pad(galleries.length)}
                        </span>
                        <span className={sectionLabelClassName}>({activeGallery.year || ''})</span>
                      </div>
                      <DialogTitle className="mb-3 text-2xl font-light leading-snug tracking-[-0.01em]">
                        {activeGallery.description || ''}
                      </DialogTitle>
                      <p className="text-sm leading-relaxed text-white/65">
                        {activeGallery.fullDescription || ''}
                      </p>
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
