'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { useInView } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import SectionHeading from './section-heading'
import { Magnetic, Reveal, RollingText } from './motion'

const RESUME_PDF = '/resume.pdf'

const ResumePdfDocument = dynamic(() => import('@/components/resume-pdf-document'), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-[8.5/11] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-ultra-orange" />
    </div>
  ),
})

export default function ResumeSection() {
  const viewerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(viewerRef, { once: true, margin: '400px 0px' })

  return (
    <section id="resume" className="relative overflow-hidden py-24 md:py-32 bg-ultra-gray-dark">
      <div
        aria-hidden
        className="bg-dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_bottom_left,black,transparent_60%)]"
      />
      <div className="container relative mx-auto px-4">
        <SectionHeading
          index="03"
          eyebrow="Experience"
          highlight="Resume"
          description="My professional experience, skills, and qualifications."
        />
        <Reveal delay={0.15} className="flex justify-center gap-4 mt-8 mb-12">
          <Magnetic>
            <Button
              asChild
              className="group rounded-full bg-ultra-orange hover:bg-ultra-orange/90 text-black transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(255,165,0,0.6)]"
            >
              <a href={RESUME_PDF} download="Wan-Aqim-Resume.pdf">
                <Download className="mr-2 h-4 w-4" /> <RollingText text="Download Resume" />
              </a>
            </Button>
          </Magnetic>
        </Reveal>

        <Reveal delay={0.2} className="w-full max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-xl bg-ultra-gray p-px shadow-[0_0_80px_-20px_rgba(255,165,0,0.25)]">
            <div
              aria-hidden
              className="absolute inset-[-50%] animate-spin-slow [animation-duration:6s] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,#FFA500_330deg,transparent_360deg)]"
            />
            <div ref={viewerRef} className="relative overflow-hidden rounded-[11px] bg-ultra-gray-dark">
              <div className="absolute inset-0 bg-gradient-to-t from-ultra-orange/5 to-transparent pointer-events-none"></div>
              {inView ? (
                <ResumePdfDocument src={RESUME_PDF} />
              ) : (
                <div className="aspect-[8.5/11] w-full" />
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
