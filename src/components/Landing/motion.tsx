'use client'

import type { ReactNode } from 'react'
import { MotionConfig, motion, type Variants } from 'motion/react'

export const EASE_OUT = [0.22, 1, 0.36, 1] as const

const VIEWPORT = { once: true, margin: '0px 0px -10% 0px' }

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
}

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
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
