'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import type { PointerEvent, ReactNode } from 'react'
import {
  MotionConfig,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from 'motion/react'
import type { LenisOptions } from 'lenis'
import { ReactLenis, useLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import { cn } from '@/lib/utils'

export const EASE_OUT = [0.22, 1, 0.36, 1] as const

const VIEWPORT = { once: true, margin: '0px 0px -10% 0px' } as const

const MAGNET_SPRING = { stiffness: 220, damping: 16, mass: 0.5 }
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const SCRAMBLE_DURATION = 700
const ROLL_STAGGER_MS = 18

const LENIS_OPTIONS: LenisOptions = { anchors: true, allowNestedScroll: true }

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
}

export const wipeVariants: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.12 },
  show: {
    clipPath: 'inset(0% 0% 0% 0%)',
    scale: 1,
    transition: { duration: 1.1, ease: EASE_OUT },
  },
}

// Radix dialogs mark the body with `data-scroll-locked`; the mobile menu sets `overflow: hidden`.
function ScrollLockSync() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    const body = document.body
    const sync = () => {
      if (body.hasAttribute('data-scroll-locked') || body.style.overflow === 'hidden') lenis.stop()
      else lenis.start()
    }
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(body, { attributes: true, attributeFilter: ['data-scroll-locked', 'style'] })
    return () => observer.disconnect()
  }, [lenis])

  return null
}

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={LENIS_OPTIONS}>
        <ScrollLockSync />
        {children}
      </ReactLenis>
    </MotionConfig>
  )
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  )
}

export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  )
}

export function Magnetic({
  children,
  className,
  strength = 0.3,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const reduceMotion = useReducedMotion()
  const x = useSpring(0, MAGNET_SPRING)
  const y = useSpring(0, MAGNET_SPRING)

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || reduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * strength)
    y.set((event.clientY - rect.top - rect.height / 2) * strength)
  }

  const handlePointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      className={cn('inline-block', className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div style={{ x, y }}>{children}</motion.div>
    </div>
  )
}

// Needs a `group` ancestor: hovering it rolls each letter up into its copy.
export function RollingText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn('relative inline-flex overflow-hidden', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-flex">
        {Array.from(text).map((letter, index) => (
          <span
            key={index}
            className="relative inline-block whitespace-pre transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:-translate-y-full"
            style={{ transitionDelay: `${index * ROLL_STAGGER_MS}ms` }}
          >
            {letter}
            <span className="absolute left-0 top-full">{letter}</span>
          </span>
        ))}
      </span>
    </span>
  )
}

export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: VIEWPORT.margin })
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    if (!inView || reduceMotion) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / SCRAMBLE_DURATION, 1)
      const revealed = Math.floor(progress * text.length)
      setDisplay(
        Array.from(text, (char, index) =>
          index < revealed || char === ' '
            ? char
            : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
        ).join(''),
      )
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduceMotion, text])

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{display}</span>
    </span>
  )
}

function ScrollWord({
  word,
  progress,
  range,
}: {
  word: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.2, 1])
  return (
    <motion.span style={{ opacity }} className="motion-reduce:!opacity-100">
      {word}
    </motion.span>
  )
}

export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = text.trim().split(/\s+/)

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <Fragment key={index}>
          <ScrollWord
            word={word}
            progress={scrollYProgress}
            range={[index / words.length, (index + 1) / words.length]}
          />
          {index < words.length - 1 && ' '}
        </Fragment>
      ))}
    </p>
  )
}
