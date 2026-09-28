'use client'

import { useRef } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown } from 'lucide-react'
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { Button } from '@/components/ui/button'
import { EASE_OUT } from './motion'

const HEADLINE = ['Creative', 'Engineer']
const GLOW_SPRING = { stiffness: 140, damping: 22, mass: 0.6 }

// Each word shows one slice of a shared white-orange-white gradient that spans
// 2x the headline, so the words read as one continuous gradient while shimmering.
const SHIMMER_PERIOD = HEADLINE.length * 2

function getShimmerStyle(index: number) {
  const from = `${(index / (SHIMMER_PERIOD - 1)) * 100}%`
  const to = `${(-(SHIMMER_PERIOD - index) / (SHIMMER_PERIOD - 1)) * 100}%`
  return {
    backgroundSize: `${SHIMMER_PERIOD * 100}% 100%`,
    backgroundPosition: `${from} center`,
    '--shimmer-from': from,
    '--shimmer-to': to,
  } as CSSProperties
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '45%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0, 0])

  const glowX = useSpring(0, GLOW_SPRING)
  const glowY = useSpring(0, GLOW_SPRING)
  const glowOpacity = useSpring(0, { stiffness: 80, damping: 20 })
  const glowBackground = useMotionTemplate`radial-gradient(520px circle at ${glowX}px ${glowY}px, rgba(255, 165, 0, 0.16), transparent 70%)`

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || reduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    if (glowOpacity.get() < 0.05) {
      glowX.jump(x)
      glowY.jump(y)
    } else {
      glowX.set(x)
      glowY.set(y)
    }
    glowOpacity.set(1)
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => glowOpacity.set(0)}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4"
    >
      <motion.div
        aria-hidden
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 will-change-transform motion-reduce:!transform-none"
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: EASE_OUT }}
        >
          <Image
            src="/background.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
      </motion.div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -inset-x-1/4 animate-fog-drift bg-[radial-gradient(ellipse_at_30%_65%,rgba(255,255,255,0.16),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -inset-x-1/4 animate-fog-drift-slow bg-[radial-gradient(ellipse_at_70%_80%,rgba(255,255,255,0.12),transparent_50%)]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.2)_45%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ultra-gray-dark"
      />

      <motion.div
        aria-hidden
        style={{ background: glowBackground, opacity: glowOpacity }}
        className="pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden
        className="bg-grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay [mask-image:linear-gradient(to_bottom,black_65%,transparent)]"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto max-w-3xl space-y-6 text-center motion-reduce:!transform-none"
      >
        <h1 className="text-5xl font-bold tracking-tighter md:text-7xl">
          <span className="sr-only">{HEADLINE.join(' ')}</span>
          <span aria-hidden>
            {HEADLINE.map((word, index) => (
              <span key={word}>
                <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                  <motion.span
                    className="inline-block animate-shimmer bg-[linear-gradient(to_right,#ffffff_0%,#FFA500_50%,#ffffff_100%)] bg-clip-text text-transparent"
                    style={getShimmerStyle(index)}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1, ease: EASE_OUT, delay: 0.3 + index * 0.14 }}
                  >
                    {word}
                  </motion.span>
                </span>
                {index < HEADLINE.length - 1 && ' '}
              </span>
            ))}
          </span>
        </h1>

        <motion.p
          className="text-xl text-gray-200 md:text-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.75 }}
        >
          Building digital experiences that matter
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.95 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="group mt-8 rounded-full border-ultra-gray bg-ultra-black/30 text-white backdrop-blur-sm transition-all duration-300 hover:border-ultra-orange hover:bg-ultra-orange hover:text-black"
            asChild
          >
            <Link href="#about">
              Explore My Work
              <ArrowDown className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity }}
        className="absolute bottom-8 left-0 right-0 z-10 hidden flex-col items-center gap-2 [@media(min-height:560px)]:flex"
      >
        <Link
          href="#about"
          aria-label="Scroll to the about section"
          className="flex h-10 w-6 justify-center rounded-full border-2 border-white/40 pt-2 transition-colors hover:border-ultra-orange"
        >
          <span className="h-2 w-1 animate-scroll-dot rounded-full bg-ultra-orange" />
        </Link>
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Scroll</span>
      </motion.div>
    </section>
  )
}
