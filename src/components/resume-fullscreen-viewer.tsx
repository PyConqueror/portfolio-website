'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'

declare global {
  interface Window {
    PDFObject: any
  }
}

export function ResumeFullscreenViewer({ resumeUrl }: { resumeUrl: string }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/pdfobject'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.PDFObject) {
        window.PDFObject.embed(resumeUrl, '#pdf-viewer-full')
        setIsLoading(false)
      }
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [resumeUrl])

  return (
    <div className="fixed inset-0 bg-ultra-gray-dark">
      <div className="absolute top-4 right-4 z-10">
        <Button
          className="rounded-full bg-ultra-orange hover:bg-ultra-orange/90 text-black"
          onClick={() => window.open(resumeUrl, '_blank')}
        >
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-ultra-orange" />
        </div>
      )}
      <div id="pdf-viewer-full" className="w-full h-full" />
    </div>
  )
}
