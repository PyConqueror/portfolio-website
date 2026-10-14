'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
  type Variants,
} from 'motion/react'
import { useCarousel } from '@/hooks/use-carousel'
import { ProjectsGlobal, Project, Media, Technology } from '@/payload-types'
import { ContourBackdrop } from './contour-backdrop'
import { Reveal, wipeVariants } from './motion'

const EASE_EXPO = [0.19, 1, 0.22, 1] as const
const SKEW_SPRING = { stiffness: 200, damping: 30 }
const IMAGE_DRIFT = 48
const HEADING_LINES = [
  'Selected ',
  <>
    w<em>o</em>rk
  </>,
]

const lineVariants: Variants = {
  hidden: { y: '110%' },
  show: (index: number) => ({
    y: '0%',
    transition: { duration: 1.25, ease: EASE_EXPO, delay: index * 0.1 },
  }),
}

const cardTextVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE_EXPO, delay: 0.15 } },
}

const trackInsetClassName = 'px-6 lg:px-[max(1.5rem,calc((100vw-1078px)/2+1.5rem))]'
const labelClassName = 'text-[11px] uppercase tracking-[0.12em] text-white/50'
const linkClassName =
  'inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.12em] text-white/70 transition-colors duration-500 hover:text-white'
const arrowClassName =
  'flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-500 hover:border-white disabled:pointer-events-none disabled:opacity-30'

const pad = (value: number) => String(value).padStart(2, '0')

function isProject(item: string | Project): item is Project {
  return (item as Project).title !== undefined
}

function ProjectCard({
  project,
  index,
  scrollX,
}: {
  project: Project
  index: number
  scrollX: MotionValue<number>
}) {
  const cardRef = useRef<HTMLElement>(null)
  const imageX = useTransform(scrollX, () => {
    const card = cardRef.current
    if (!card) return 0
    const rect = card.getBoundingClientRect()
    const center = rect.left + rect.width / 2
    return ((center - window.innerWidth / 2) / window.innerWidth) * -IMAGE_DRIFT
  })
  const demoUrl = project.demoUrl?.trim()
  const githubUrl = project.githubUrl?.trim()
  const tags = project.tags.filter((tag): tag is Technology => typeof tag !== 'string')

  return (
    <motion.article
      ref={cardRef}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="group w-[78vw] shrink-0 snap-start sm:w-[48vw] lg:w-[min(34vw,480px)]"
    >
      <motion.div
        variants={wipeVariants}
        className="relative aspect-[4/3] w-full overflow-hidden bg-white/5"
      >
        <motion.div
          style={{ x: imageX }}
          className="absolute inset-y-0 -inset-x-[8%] motion-reduce:!transform-none"
        >
          <Image
            src={(project.image as Media).url || '/placeholder.svg'}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 34vw, (min-width: 640px) 48vw, 78vw"
            className="object-cover transition-transform [transition-duration:1250ms] [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
          />
        </motion.div>
      </motion.div>
      <motion.div variants={cardTextVariants} className="mt-5">
        <div className="flex items-baseline justify-between gap-4">
          <span className={labelClassName}>({pad(index + 1)})</span>
          <span className={`${labelClassName} truncate`}>
            {tags
              .slice(0, 3)
              .map((tag) => tag.name)
              .join(' / ')}
          </span>
        </div>
        <h3 className="mt-3 text-[clamp(1.5rem,2.4vw,2.25rem)] font-light leading-[1.1] tracking-[-0.02em]">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/55">
          {project.description}
        </p>
        <div className="mt-4 flex gap-5">
          {demoUrl && (
            <Link href={demoUrl} className={linkClassName}>
              Demo <ArrowUpRight className="h-3 w-3" />
            </Link>
          )}
          {githubUrl && (
            <Link href={githubUrl} className={linkClassName}>
              Code <ArrowUpRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </motion.div>
    </motion.article>
  )
}

export default function ProjectsSection({
  projectSectionData,
}: {
  projectSectionData: ProjectsGlobal
}) {
  const projects = projectSectionData.selectedProjects.filter(isProject)
  const reduceMotion = useReducedMotion()
  const { ref: carouselRef, ...carousel } = useCarousel()

  const { scrollX, scrollXProgress } = useScroll({ container: carouselRef, axis: 'x' })
  const skew = useSpring(
    useTransform(useVelocity(scrollX), [-3000, 3000], [3, -3], { clamp: true }),
    SKEW_SPRING,
  )
  const counter = useTransform(scrollXProgress, (progress) =>
    pad(Math.round(progress * (projects.length - 1)) + 1),
  )

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-ultra-black py-28 text-white md:py-40"
    >
      <ContourBackdrop progress={scrollXProgress} className="absolute inset-0" />

      <div className="relative mx-auto max-w-[1078px] px-6">
        <Reveal className="flex items-baseline justify-between border-t border-white/30 pt-4">
          <span className={labelClassName}>(02)</span>
          <span className={labelClassName}>Projects</span>
          <span className={labelClassName}>({pad(projects.length)})</span>
        </Reveal>

        <div className="mt-16 flex flex-col gap-10 md:mt-24 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.h2
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-[clamp(3rem,9vw,8rem)] font-light leading-[0.95] tracking-[-0.03em]"
            >
              {HEADING_LINES.map((line, index) => (
                <span key={index} className="block overflow-hidden pb-[0.08em]">
                  <motion.span custom={index} variants={lineVariants} className="inline-block">
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-xs text-white/60">
                A selection of my most significant work across various domains and technologies.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.3} className="flex gap-3">
            <button
              type="button"
              className={arrowClassName}
              onClick={() => carousel.scrollByDirection('left')}
              disabled={!carousel.canPrev}
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.25} />
              <span className="sr-only">Previous projects</span>
            </button>
            <button
              type="button"
              className={arrowClassName}
              onClick={() => carousel.scrollByDirection('right')}
              disabled={!carousel.canNext}
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.25} />
              <span className="sr-only">Next projects</span>
            </button>
          </Reveal>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="relative mt-16 snap-x snap-mandatory scroll-px-6 overflow-x-auto overscroll-x-contain [scrollbar-width:none] md:mt-20 lg:scroll-px-[max(1.5rem,calc((100vw-1078px)/2+1.5rem))] [&::-webkit-scrollbar]:hidden"
      >
        <motion.div
          style={{ skewX: reduceMotion ? 0 : skew }}
          className={`flex w-max gap-6 md:gap-10 ${trackInsetClassName}`}
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} scrollX={scrollX} />
          ))}
        </motion.div>
      </div>

      <div className="relative mx-auto mt-12 flex max-w-[1078px] items-center gap-4 px-6">
        <span className={labelClassName}>
          <motion.span>{counter}</motion.span> / {pad(projects.length)}
        </span>
        <span className="relative h-px flex-1 bg-white/15">
          <motion.span
            style={{ scaleX: scrollXProgress }}
            className="absolute inset-0 origin-left bg-white"
          />
        </span>
        <span className={`${labelClassName} md:hidden`}>(Swipe)</span>
      </div>
    </section>
  )
}
