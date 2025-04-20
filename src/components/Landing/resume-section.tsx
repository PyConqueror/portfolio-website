'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { ResumeSection as ResumeSectionType, Media } from '../../payload-types'

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
  const [isLoading, setIsLoading] = useState(true)
  const resume = resumeSectionData.resumeFile as Media

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/pdfobject'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.PDFObject) {
        window.PDFObject.embed(resume.url as string, '#pdf-viewer')
        setIsLoading(false)
      }
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [resume.url])

  return (
    <section id="resume" className="py-24 bg-ultra-gray-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <span className="text-ultra-orange">Resume</span>
          </h2>
          <p className="text-gray-400 text-lg">
            My professional experience, skills, and qualifications.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              className="rounded-full bg-ultra-orange hover:bg-ultra-orange/90 text-black transition-all duration-300"
              onClick={() => window.open(resume.url as string, '_blank')}
            >
              <Download className="mr-2 h-4 w-4" /> Download Resume
            </Button>
          </div>
        </div>

        <div className="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden border border-ultra-gray shadow-xl bg-ultra-gray-dark">
          <div className="absolute inset-0 bg-gradient-to-t from-ultra-orange/5 to-transparent pointer-events-none"></div>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-ultra-gray-dark">
              <Loader2 className="h-8 w-8 animate-spin text-ultra-orange" />
            </div>
          )}
          <div id="pdf-viewer" className="aspect-[8.5/11] w-full"></div>
        </div>
      </div>
    </section>
  )
}
