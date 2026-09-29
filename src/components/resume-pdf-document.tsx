'use client'

import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ExternalLink, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Must be set in the same module that renders <Document>, or react-pdf's default overwrites it.
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const loadingState = (
  <div className="flex aspect-[8.5/11] w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-ultra-orange" />
  </div>
)

export default function ResumePdfDocument({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [numPages, setNumPages] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(() => setWidth(container.clientWidth))
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const errorState = (
    <div className="relative flex flex-col items-center gap-6 px-6 py-14 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ultra-black text-ultra-orange ring-1 ring-ultra-gray">
        <FileText className="h-8 w-8" />
      </span>
      <div>
        <h3 className="text-xl font-semibold">Resume preview</h3>
        <p className="mt-2 text-sm text-gray-400">
          The preview couldn&apos;t load. Open the PDF instead.
        </p>
      </div>
      <Button
        asChild
        variant="outline"
        className="rounded-full border-ultra-gray transition-all duration-300 hover:border-ultra-orange hover:bg-ultra-orange hover:text-black"
      >
        <a href={src} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-2 h-4 w-4" /> Open PDF
        </a>
      </Button>
    </div>
  )

  return (
    <div ref={containerRef} className="w-full">
      {width === 0 ? (
        loadingState
      ) : (
        <Document
          file={src}
          suspense={false}
          loading={loadingState}
          error={errorState}
          externalLinkTarget="_blank"
          onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}
          className="flex flex-col items-center gap-4"
        >
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              width={width}
              suspense={false}
              loading={<div className="aspect-[8.5/11]" style={{ width }} />}
            />
          ))}
        </Document>
      )}
    </div>
  )
}
