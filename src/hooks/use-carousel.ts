'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface CarouselState {
  canPrev: boolean
  canNext: boolean
  pageCount: number
  activePage: number
}

const INITIAL_STATE: CarouselState = { canPrev: false, canNext: false, pageCount: 1, activePage: 0 }

function getScrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

export function useCarousel<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [state, setState] = useState<CarouselState>(INITIAL_STATE)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const measure = () => {
      const maxScroll = container.scrollWidth - container.clientWidth
      const pageCount =
        maxScroll > 1 ? Math.ceil(container.scrollWidth / container.clientWidth - 0.05) : 1
      const next: CarouselState = {
        canPrev: container.scrollLeft > 4,
        canNext: container.scrollLeft < maxScroll - 4,
        pageCount,
        activePage:
          pageCount > 1 ? Math.round((container.scrollLeft / maxScroll) * (pageCount - 1)) : 0,
      }
      setState((prev) =>
        prev.canPrev === next.canPrev &&
        prev.canNext === next.canNext &&
        prev.pageCount === next.pageCount &&
        prev.activePage === next.activePage
          ? prev
          : next,
      )
    }

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(container)
    container.addEventListener('scroll', measure, { passive: true })

    return () => {
      resizeObserver.disconnect()
      container.removeEventListener('scroll', measure)
    }
  }, [])

  const scrollByDirection = useCallback((direction: 'left' | 'right') => {
    const container = ref.current
    if (!container) return

    container.scrollBy({
      left: (direction === 'left' ? -1 : 1) * container.clientWidth * 0.9,
      behavior: getScrollBehavior(),
    })
  }, [])

  const scrollToPage = useCallback(
    (page: number) => {
      const container = ref.current
      if (!container || state.pageCount < 2) return

      const maxScroll = container.scrollWidth - container.clientWidth
      container.scrollTo({
        left: (maxScroll * page) / (state.pageCount - 1),
        behavior: getScrollBehavior(),
      })
    },
    [state.pageCount],
  )

  return { ref, ...state, scrollByDirection, scrollToPage }
}
