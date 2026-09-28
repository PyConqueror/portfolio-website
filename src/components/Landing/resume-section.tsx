'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, ExternalLink, FileText, Loader2 } from 'lucide-react'
import { ResumeSection as ResumeSectionType, Media } from '../../payload-types'
import SectionHeading from './section-heading'
import { Reveal } from './motion'

declare global {
  interface Window {
    PDFObject: any
  }
}

export default function ResumeSection({
  resumeSectionData,
}: {
  resumeSectionData: ResumeSectionType
}) {
  const [status, setStatus] = useState<'loading' | 'embedded' | 'unsupported'>('loading')
  const resume = resumeSectionData.resumeFile as Media

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/pdfobject'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.PDFObject) {
        const embedded = window.PDFObject.embed(resume.url as string, '#pdf-viewer', {
          fallbackLink: false,
        })
        setStatus(embedded ? 'embedded' : 'unsupported')
      }
    }
    script.onerror = () => setStatus('unsupported')

    return () => {
      document.body.removeChild(script)
    }
  }, [resume.url])

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
          <Button
            className="rounded-full bg-ultra-orange hover:bg-ultra-orange/90 text-black transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(255,165,0,0.6)]"
            onClick={() => window.open(resume.url as string, '_blank')}
          >
            <Download className="mr-2 h-4 w-4" /> Download Resume
          </Button>
        </Reveal>

        <Reveal delay={0.2} className="w-full max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-xl bg-ultra-gray p-px shadow-[0_0_80px_-20px_rgba(255,165,0,0.25)]">
            <div
              aria-hidden
              className="absolute inset-[-50%] animate-spin-slow [animation-duration:6s] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,#FFA500_330deg,transparent_360deg)]"
            />
            <div className="relative overflow-hidden rounded-[11px] bg-ultra-gray-dark">
              <div className="absolute inset-0 bg-gradient-to-t from-ultra-orange/5 to-transparent pointer-events-none"></div>
              {status === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-ultra-gray-dark">
                  <Loader2 className="h-8 w-8 animate-spin text-ultra-orange" />
                </div>
              )}
              {status === 'unsupported' && (
                <div className="relative flex flex-col items-center gap-6 px-6 py-14 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ultra-black text-ultra-orange ring-1 ring-ultra-gray">
                    <FileText className="h-8 w-8" />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold">Resume preview</h3>
                    <p className="mt-2 text-sm text-gray-400">
                      This browser can&apos;t show the PDF inline. Open it in your PDF viewer instead.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-full border-ultra-gray transition-all duration-300 hover:border-ultra-orange hover:bg-ultra-orange hover:text-black"
                    onClick={() => window.open(resume.url as string, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> Open PDF
                  </Button>
                </div>
              )}
              <div
                id="pdf-viewer"
                className={status === 'unsupported' ? 'hidden' : 'aspect-[8.5/11] w-full'}
              ></div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
