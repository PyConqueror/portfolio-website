'use client'

import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { Reveal } from './motion'

const EASE_EXPO = [0.19, 1, 0.22, 1] as const

const lineVariants: Variants = {
  hidden: { y: '110%' },
  show: (index: number) => ({
    y: '0%',
    transition: { duration: 1.25, ease: EASE_EXPO, delay: index * 0.1 },
  }),
}

export const sectionLabelClassName = 'text-[11px] uppercase tracking-[0.12em] text-white/50'

// Hairline label row, then a masked multi-line headline. End each non-final line with a
// trailing space so the heading's accessible name keeps its word breaks.
export default function SectionHeading({
  index,
  label,
  meta,
  lines,
  description,
  aside,
  className,
}: {
  index: string
  label: string
  meta?: string
  lines: ReactNode[]
  description?: string
  aside?: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <Reveal className="flex items-baseline justify-between border-t border-white/30 pt-4">
        <span className={sectionLabelClassName}>({index})</span>
        <span className={sectionLabelClassName}>{label}</span>
        <span className={sectionLabelClassName}>{meta}</span>
      </Reveal>

      <div className="mt-16 flex flex-col gap-10 md:mt-24 md:flex-row md:items-end md:justify-between">
        <div>
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-[clamp(3rem,9vw,8rem)] font-light leading-[0.95] tracking-[-0.03em]"
          >
            {lines.map((line, lineIndex) => (
              <span key={lineIndex} className="block overflow-hidden pb-[0.08em]">
                <motion.span custom={lineIndex} variants={lineVariants} className="inline-block">
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h2>
          {description && (
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-xs text-white/60">{description}</p>
            </Reveal>
          )}
        </div>
        {aside && (
          <Reveal delay={0.3} className="shrink-0">
            {aside}
          </Reveal>
        )}
      </div>
    </div>
  )
}
