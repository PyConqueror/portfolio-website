'use client'

import type { PointerEvent } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { Reveal } from './motion'

const TILT_SPRING = { stiffness: 150, damping: 18, mass: 0.6 }

export default function AboutPhoto({ src, alt }: { src: string; alt: string }) {
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [10, -10]), TILT_SPRING)
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-12, 12]), TILT_SPRING)

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || reduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const handlePointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <Reveal className="w-full md:w-1/2 relative">
      <div
        className="aspect-square max-w-md mx-auto relative [perspective:1000px]"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative h-full w-full"
        >
          <div aria-hidden className="absolute -inset-3 overflow-hidden rounded-[1.75rem] opacity-70 blur-md">
            <div className="absolute inset-[-30%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0deg,#FFA500_70deg,transparent_150deg,transparent_360deg)]" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-ultra-gray to-ultra-black rounded-2xl transform rotate-3"></div>
          <div className="absolute inset-0 border-2 border-ultra-orange/20 rounded-2xl transform rotate-3"></div>
          <Image
            src={src}
            alt={alt}
            width={400}
            height={400}
            sizes="(min-width: 768px) 448px, 90vw"
            className="rounded-2xl relative z-10 h-full w-full object-cover [transform:translateZ(16px)]"
          />
          <div className="absolute -bottom-4 -right-4 z-20 h-24 w-24 bg-ultra-orange/20 rounded-full blur-xl animate-pulse [transform:translateZ(32px)]"></div>
        </motion.div>
      </div>
    </Reveal>
  )
}
