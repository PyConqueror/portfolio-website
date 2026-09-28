'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { EASE_OUT, Reveal } from './motion'

export default function SectionHeading({
  index,
  eyebrow,
  title,
  highlight,
  description,
  align = 'center',
  className,
}: {
  index: string
  eyebrow: string
  title?: string
  highlight: string
  description?: string
  align?: 'center' | 'left'
  className?: string
}) {
  const centered = align === 'center'

  return (
    <Reveal className={cn(centered ? 'mx-auto max-w-3xl text-center' : 'max-w-xl', className)}>
      <p
        className={cn(
          'mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em]',
          centered && 'justify-center',
        )}
      >
        <span className="text-ultra-orange">{index}</span>
        <span className="h-px w-8 bg-ultra-orange/60" />
        <span className="text-gray-400">{eyebrow}</span>
      </p>
      <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
        {title && <>{title} </>}
        <span className="text-ultra-orange">{highlight}</span>
      </h2>
      <motion.span
        aria-hidden
        className={cn(
          'mt-5 block h-0.5 rounded-full bg-gradient-to-r',
          centered
            ? 'mx-auto w-24 from-transparent via-ultra-orange to-transparent'
            : 'w-16 origin-left from-ultra-orange to-transparent',
        )}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.2 }}
      />
      {description && <p className="mt-5 text-lg text-gray-400">{description}</p>}
    </Reveal>
  )
}
