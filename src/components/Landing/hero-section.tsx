'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowDown } from 'lucide-react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'motion/react'
import { Magnetic, RollingText } from './motion'

// Segments wrapped in `*` render in italic.
const PHRASES = [
  ['Creat*i*ve,', 'Eng*i*neer'],
  ['AI agents,', 'Autom*a*tions'],
  ['D*i*gital', 'experiences'],
]
const PHRASE_INTERVAL = 4800
const STATUS_LABEL = 'Available for work'
const BADGE_TEXT = 'SCROLL DOWN · SCROLL DOWN · '
const EASE_EXPO = [0.19, 1, 0.22, 1] as const
const EASE_IN = [0.7, 0, 0.84, 0] as const

const lineVariants: Variants = {
  hidden: { y: '110%' },
  show: (index: number) => ({
    y: '0%',
    transition: { duration: 1.25, ease: EASE_EXPO, delay: 0.3 + index * 0.1 },
  }),
  exit: (index: number) => ({
    y: '-110%',
    transition: { duration: 0.7, ease: EASE_IN, delay: index * 0.06 },
  }),
}

function renderLine(line: string) {
  return line
    .split('*')
    .map((segment, index) => (index % 2 ? <em key={index}>{segment}</em> : segment))
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const interval = setInterval(
      () => setPhraseIndex((index) => (index + 1) % PHRASES.length),
      PHRASE_INTERVAL,
    )
    return () => clearInterval(interval)
  }, [reduceMotion])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '45%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0, 0])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4"
    >
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full text-center motion-reduce:!transform-none"
      >
        <h1 className="sr-only">Creative Engineer</h1>
        <p className="sr-only">Building AI agents, automations, and digital experiences.</p>
        <div
          aria-hidden
          className="text-[clamp(3rem,10.5vw,9rem)] font-normal leading-[1.04] tracking-[-0.03em] text-white"
        >
          <AnimatePresence mode="wait">
            <motion.div key={phraseIndex} initial="hidden" animate="show" exit="exit">
              {PHRASES[phraseIndex]?.map((line, index) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <motion.span custom={index} variants={lineVariants} className="inline-block">
                    {renderLine(line)}
                  </motion.span>
                </span>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity }}
        className="absolute inset-x-6 bottom-28 z-10 hidden md:inset-x-10 md:bottom-10 [@media(min-height:560px)]:block"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.25, ease: EASE_EXPO, delay: 1.1 }}
          className="flex items-end justify-between"
        >
          <Link
            href="#about"
            aria-label="Scroll to the about section"
            className="group relative flex h-24 w-24 items-center justify-center text-white md:h-28 md:w-28"
          >
            <svg
              aria-hidden
              viewBox="0 0 120 120"
              className="absolute inset-0 h-full w-full animate-spin-slow [animation-duration:18s]"
            >
              <defs>
                <path id="hero-badge-path" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <text className="fill-current text-[10px] tracking-[0.18em]">
                <textPath href="#hero-badge-path" textLength="286" lengthAdjust="spacing">
                  {BADGE_TEXT}
                </textPath>
              </text>
            </svg>
            <ArrowDown
              strokeWidth={1.25}
              className="h-5 w-5 transition-transform duration-700 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-1"
            />
          </Link>

          <div className="flex flex-col items-start gap-4">
            <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-white/70">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              {STATUS_LABEL}
            </span>
            <Magnetic>
              <Link
                href="#projects"
                className="group inline-flex items-center rounded-full border border-white/30 px-[33px] py-[11px] text-base text-white transition-colors duration-700 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] hover:border-white"
              >
                <RollingText text="Explore my work" />
              </Link>
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
