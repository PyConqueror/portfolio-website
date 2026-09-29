'use client'

import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'

const ResumePdfDocument = dynamic(() => import('@/components/resume-pdf-document'), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-[8.5/11] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-ultra-orange" />
    </div>
  ),
})

export function ResumeFullscreenViewer({ resumeUrl }: { resumeUrl: string }) {
  return (
    <div className="fixed inset-0 overflow-y-auto bg-ultra-gray-dark">
      <div className="fixed top-4 right-4 z-10">
        <Button
          asChild
          className="rounded-full bg-ultra-orange hover:bg-ultra-orange/90 text-black"
        >
          <a href={resumeUrl} download="Wan-Aqim-Resume.pdf">
            <Download className="mr-2 h-4 w-4" /> Download
          </a>
        </Button>
      </div>
      <div className="mx-auto w-full max-w-[900px] px-3 pt-20 pb-8 sm:px-6">
        <ResumePdfDocument src={resumeUrl} />
      </div>
    </div>
  )
}
