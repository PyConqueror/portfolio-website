'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'

const CURSOR_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
const RING_SPRING = { stiffness: 350, damping: 30, mass: 0.5 }
const INTERACTIVE_SELECTOR = 'a, button, [role="button"]'
const HIDDEN_SELECTOR = 'iframe, embed, object, input, textarea, select'
const RING_SIZE = { idle: 32, hover: 48, label: 72 }

function subscribe(callback: () => void) {
  const query = window.matchMedia(CURSOR_QUERY)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

export default function CustomCursor() {
  const enabled = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(CURSOR_QUERY).matches,
    () => false,
  )
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [label, setLabel] = useState<string | null>(null)
  const visibleRef = useRef(false)
  const suppressedRef = useRef(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, RING_SPRING)
  const ringY = useSpring(y, RING_SPRING)

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    const show = (next: boolean) => {
      visibleRef.current = next
      setVisible(next)
    }

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      x.set(event.clientX)
      y.set(event.clientY)
      if (suppressedRef.current || visibleRef.current) return
      ringX.jump(event.clientX)
      ringY.jump(event.clientY)
      show(true)
    }

    const handleOver = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return
      suppressedRef.current = Boolean(event.target.closest(HIDDEN_SELECTOR))
      if (suppressedRef.current) {
        show(false)
        return
      }
      setLabel(event.target.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? null)
      setHovering(Boolean(event.target.closest(INTERACTIVE_SELECTOR)))
    }

    const handleOut = (event: PointerEvent) => {
      if (!event.relatedTarget) show(false)
    }

    document.addEventListener('pointermove', handleMove)
    document.addEventListener('pointerover', handleOver)
    document.addEventListener('pointerout', handleOut)
    return () => {
      root.classList.remove('has-custom-cursor')
      document.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerover', handleOver)
      document.removeEventListener('pointerout', handleOut)
    }
  }, [enabled, x, y, ringX, ringY])

  if (!enabled) return null

  const ringSize = label ? RING_SIZE.label : hovering ? RING_SIZE.hover : RING_SIZE.idle

  return (
    <>
      <motion.div aria-hidden style={{ x, y }} className="pointer-events-none fixed left-0 top-0 z-[100]">
        <motion.span
          className="block h-1.5 w-1.5 rounded-full bg-ultra-orange"
          style={{ translateX: '-50%', translateY: '-50%' }}
          animate={{ opacity: visible && !label ? 1 : 0, scale: hovering ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0 z-[100]"
      >
        <motion.div
          className="flex items-center justify-center rounded-full border border-ultra-orange/60"
          style={{ translateX: '-50%', translateY: '-50%' }}
          animate={{
            width: ringSize,
            height: ringSize,
            opacity: visible ? 1 : 0,
            backgroundColor: label ? 'rgba(255, 165, 0, 0.95)' : 'rgba(255, 165, 0, 0)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        >
          <AnimatePresence>
            {label && (
              <motion.span
                key={label}
                className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-black"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  )
}
