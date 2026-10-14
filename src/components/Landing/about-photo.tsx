'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'motion/react'
import { wipeVariants } from './motion'

export default function AboutPhoto({
  src,
  alt,
  caption,
  className,
}: {
  src: string
  alt: string
  caption: [string, string]
  className?: string
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <motion.figure
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      className={className}
    >
      <motion.div
        ref={frameRef}
        variants={wipeVariants}
        className="relative aspect-[4/5] overflow-hidden bg-white/5"
      >
        <motion.div
          style={{ y: imageY }}
          className="absolute inset-x-0 -inset-y-[10%] motion-reduce:!transform-none"
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>
      <figcaption className="mt-3 flex justify-between text-[11px] uppercase tracking-[0.12em] text-white/50">
        <span>{caption[0]}</span>
        <span>{caption[1]}</span>
      </figcaption>
    </motion.figure>
  )
}
