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
    <Loader2 className="h-6 w-6 animate-spin text-white/40" />
  </div>
)

// With `pageWidth`, pages render side by side at that width for the caller's horizontal scroller;
// otherwise they stack at the container's width.
export default function ResumePdfDocument({
  src,
  pageWidth,
  pageClassName,
  onPageCount,
}: {
  src: string
  pageWidth?: number
  pageClassName?: string
  onPageCount?: (count: number) => void
}) {
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
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 text-white">
        <FileText className="h-6 w-6" strokeWidth={1.25} />
      </span>
      <div>
        <h3 className="text-xl font-light">Resume preview</h3>
        <p className="mt-2 text-sm text-white/55">
          The preview couldn&apos;t load. Open the PDF instead.
        </p>
      </div>
      <Button
        asChild
        variant="outline"
        className="rounded-full border-white/30 bg-transparent transition-colors duration-500 hover:border-white hover:bg-transparent"
      >
        <a href={src} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-2 h-4 w-4" /> Open PDF
        </a>
      </Button>
    </div>
  )

  if (pageWidth !== undefined) {
    const rowLoadingState = (
      <div
        className="flex aspect-[8.5/11] items-center justify-center"
        style={{ width: pageWidth }}
      >
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    )

    return (
      <Document
        file={src}
        suspense={false}
        loading={rowLoadingState}
        error={<div style={{ width: pageWidth }}>{errorState}</div>}
        externalLinkTarget="_blank"
        onLoadSuccess={(pdf) => {
          setNumPages(pdf.numPages)
          onPageCount?.(pdf.numPages)
        }}
        className="flex gap-6 md:gap-10"
      >
        {Array.from({ length: numPages }, (_, index) => (
          <div key={index} className={pageClassName}>
            <Page
              pageNumber={index + 1}
              width={pageWidth}
              suspense={false}
              loading={<div className="aspect-[8.5/11]" style={{ width: pageWidth }} />}
            />
          </div>
        ))}
      </Document>
    )
  }

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
