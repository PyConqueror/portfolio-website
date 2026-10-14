'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Loader2 } from 'lucide-react'
import { useCarousel } from '@/hooks/use-carousel'
import { HalftoneBackdrop } from './halftone-backdrop'
import SectionHeading, { sectionLabelClassName } from './section-heading'
import { Magnetic, RollingText, wipeVariants } from './motion'

const RESUME_PDF = '/resume.pdf'
const MAX_PAGE_WIDTH = 440

const ResumePdfDocument = dynamic(() => import('@/components/resume-pdf-document'), {
  ssr: false,
  loading: () => (
    <div className="flex h-40 items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-white/40" />
    </div>
  ),
})

const trackInsetClassName = 'px-6 lg:px-[max(1.5rem,calc((100vw-1078px)/2+1.5rem))]'
const pillClassName =
  'group inline-flex items-center gap-2 rounded-full border border-white/30 px-[33px] py-[11px] text-base text-white transition-colors duration-700 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] hover:border-white'
const linkClassName =
  'inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.12em] text-white/70 transition-colors duration-500 hover:text-white'
const arrowClassName =
  'flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-500 hover:border-white disabled:pointer-events-none disabled:opacity-30'

const pad = (value: number) => String(value).padStart(2, '0')

function getPageWidth(viewportWidth: number) {
  if (viewportWidth < 640) return Math.round(viewportWidth * 0.78)
  if (viewportWidth < 1024) return Math.round(viewportWidth * 0.44)
  return Math.min(Math.round(viewportWidth * 0.32), MAX_PAGE_WIDTH)
}

export default function ResumeSection() {
  const viewerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(viewerRef, { once: true, margin: '400px 0px' })
  const { ref: carouselRef, ...carousel } = useCarousel()
  const [pageWidth, setPageWidth] = useState(0)
  const [pageCount, setPageCount] = useState(0)

  useEffect(() => {
    const container = carouselRef.current
    if (!container) return
    const observer = new ResizeObserver(() => setPageWidth(getPageWidth(container.clientWidth)))
    observer.observe(container)
    return () => observer.disconnect()
  }, [carouselRef])

  const { scrollXProgress } = useScroll({ container: carouselRef, axis: 'x' })
  const counter = useTransform(scrollXProgress, (progress) =>
    pad(pageCount ? Math.round(progress * (pageCount - 1)) + 1 : 1),
  )

  return (
    <section
      id="resume"
      className="relative overflow-hidden bg-ultra-black py-28 text-white md:py-40"
    >
      <HalftoneBackdrop progress={scrollXProgress} className="absolute inset-0" />

      <div className="relative mx-auto max-w-[1078px] px-6">
        <SectionHeading
          index="03"
          label="Resume"
          meta="Experience"
          lines={[
            <>
              Exper<em>i</em>ence
            </>,
          ]}
          description="My professional experience, skills, and qualifications."
          aside={
            <div className="flex flex-col items-start gap-4">
              <Magnetic>
                <a href={RESUME_PDF} download="Wan-Aqim-Resume.pdf" className={pillClassName}>
                  <RollingText text="Download resume" />
                  <ArrowDown className="h-4 w-4" strokeWidth={1.25} />
                </a>
              </Magnetic>
              <a
                href={RESUME_PDF}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                Open in new tab <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          }
        />
      </div>

      <div
        ref={carouselRef}
        className="relative mt-16 snap-x snap-mandatory scroll-px-6 overflow-x-auto overscroll-x-contain [scrollbar-width:none] md:mt-20 lg:scroll-px-[max(1.5rem,calc((100vw-1078px)/2+1.5rem))] [&::-webkit-scrollbar]:hidden"
      >
        <motion.div
          ref={viewerRef}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          className={`w-max ${trackInsetClassName}`}
        >
          <motion.div variants={wipeVariants}>
            {inView && pageWidth > 0 ? (
              <ResumePdfDocument
                src={RESUME_PDF}
                pageWidth={pageWidth}
                pageClassName="shrink-0 snap-start border border-white/15 bg-white/[0.03] p-2"
                onPageCount={setPageCount}
              />
            ) : (
              <div className="aspect-[8.5/11]" style={{ width: pageWidth || undefined }} />
            )}
          </motion.div>
        </motion.div>
      </div>

      <div className="relative mx-auto mt-12 flex max-w-[1078px] items-center gap-4 px-6">
        <span className={sectionLabelClassName}>
          <motion.span>{counter}</motion.span> / {pad(pageCount || 1)}
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
            <span className="sr-only">Previous page</span>
          </button>
          <button
            type="button"
            className={arrowClassName}
            onClick={() => carousel.scrollByDirection('right')}
            disabled={!carousel.canNext}
          >
            <ArrowRight className="h-4 w-4" strokeWidth={1.25} />
            <span className="sr-only">Next page</span>
          </button>
        </div>
      </div>
    </section>
  )
}
