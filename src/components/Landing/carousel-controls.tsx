'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MAX_DOTS = 8

const arrowClassName =
  'rounded-full border-ultra-gray bg-ultra-gray-dark/80 backdrop-blur-sm transition-all duration-300 hover:border-ultra-orange hover:bg-ultra-orange hover:text-black disabled:opacity-30'

export default function CarouselControls({
  label,
  canPrev,
  canNext,
  pageCount,
  activePage,
  onPrev,
  onNext,
  onSelectPage,
}: {
  label: string
  canPrev: boolean
  canNext: boolean
  pageCount: number
  activePage: number
  onPrev: () => void
  onNext: () => void
  onSelectPage: (page: number) => void
}) {
  if (pageCount < 2) return null

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="icon"
        className={arrowClassName}
        onClick={onPrev}
        disabled={!canPrev}
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Previous {label}</span>
      </Button>

      {pageCount > MAX_DOTS ? (
        <div className="flex items-center gap-3" aria-live="polite">
          <span className="relative block h-1 w-28 overflow-hidden rounded-full bg-ultra-gray-light">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-ultra-orange transition-all duration-300"
              style={{ width: `${((activePage + 1) / pageCount) * 100}%` }}
            />
          </span>
          <span className="font-mono text-xs font-medium tabular-nums tracking-widest text-gray-400">
            {String(activePage + 1).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {Array.from({ length: pageCount }, (_, page) => (
            <button
              key={page}
              type="button"
              className="p-1.5"
              aria-label={`Go to ${label} page ${page + 1}`}
              aria-current={page === activePage}
              onClick={() => onSelectPage(page)}
            >
              <span
                className={cn(
                  'block h-1.5 rounded-full transition-all duration-300',
                  page === activePage ? 'w-6 bg-ultra-orange' : 'w-1.5 bg-ultra-gray-light hover:bg-gray-400',
                )}
              />
            </button>
          ))}
        </div>
      )}

      <Button
        variant="outline"
        size="icon"
        className={arrowClassName}
        onClick={onNext}
        disabled={!canNext}
      >
        <ChevronRight className="h-5 w-5" />
        <span className="sr-only">Next {label}</span>
      </Button>
    </div>
  )
}
