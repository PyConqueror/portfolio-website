'use client'

import type { PointerEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Github } from 'lucide-react'
import { motion, useMotionTemplate, useMotionValue } from 'motion/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCarousel } from '@/hooks/use-carousel'
import { ProjectsGlobal, Project, Media } from '@/payload-types'
import CarouselControls from './carousel-controls'
import SectionHeading from './section-heading'
import { Stagger, StaggerItem, wipeVariants } from './motion'

function isProject(item: string | Project): item is Project {
  return (item as Project).title !== undefined
}

function ProjectCard({ project }: { project: Project }) {
  const demoUrl = project.demoUrl?.trim()
  const glowX = useMotionValue(-400)
  const glowY = useMotionValue(-400)
  const spotlight = useMotionTemplate`radial-gradient(360px circle at ${glowX}px ${glowY}px, rgba(255, 165, 0, 0.14), transparent 65%)`

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    glowX.set(event.clientX - rect.left)
    glowY.set(event.clientY - rect.top)
  }

  return (
    <Card
      onPointerMove={handlePointerMove}
      className="group relative flex h-full flex-col bg-ultra-gray-dark border-ultra-gray overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-ultra-orange hover:shadow-[0_20px_50px_-20px_rgba(255,165,0,0.35)] motion-reduce:hover:translate-y-0"
    >
      <motion.div
        aria-hidden
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-ultra-black/80 to-transparent z-10"></div>
        <motion.div variants={wipeVariants} className="h-full w-full motion-reduce:![clip-path:none]">
          <Image
            src={(project.image as Media).url || '/placeholder.svg'}
            alt={project.title}
            width={600}
            height={300}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          />
        </motion.div>
      </div>
      <CardContent className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-ultra-orange">
          {project.title}
        </h3>
        <p className="text-gray-400 mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => {
            if (typeof tag === 'string') return null
            return (
              <span key={tag.id} className="font-mono text-xs bg-ultra-gray px-2 py-1 rounded-full">
                {tag.name}
              </span>
            )
          })}
        </div>

        <div className="relative z-30 mt-auto flex items-center gap-3">
          {demoUrl && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full border-ultra-gray hover:bg-ultra-orange hover:text-black hover:border-ultra-orange"
            >
              <Link href={demoUrl}>
                <ArrowUpRight className="mr-1 h-4 w-4" /> Demo
              </Link>
            </Button>
          )}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full border-ultra-gray hover:bg-ultra-orange hover:text-black hover:border-ultra-orange"
          >
            <Link href={project.githubUrl || ''}>
              <Github className="mr-1 h-4 w-4" /> Code
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProjectsSection({
  projectSectionData,
}: {
  projectSectionData: ProjectsGlobal
}) {
  const { ref: carouselRef, ...carousel } = useCarousel()

  const projects = projectSectionData.selectedProjects

  const filteredProjects = projects.filter(isProject)

  return (
    <section id="projects" className="relative overflow-hidden py-24 md:py-32 bg-ultra-black">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-ultra-orange/5 blur-3xl"
      />
      <div className="container relative mx-auto px-4">
        <SectionHeading
          index="02"
          eyebrow="Selected work"
          title="Featured"
          highlight="Projects"
          description="A selection of my most significant work across various domains and technologies."
          className="mb-16"
        />

        <div
          ref={carouselRef}
          className="overflow-x-auto snap-x snap-mandatory pt-3 pb-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <Stagger className="flex gap-4 sm:gap-6">
            {filteredProjects.map((project) => (
              <StaggerItem
                key={project.id}
                className="snap-start shrink-0 w-[85%] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
              >
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <CarouselControls
          label="projects"
          canPrev={carousel.canPrev}
          canNext={carousel.canNext}
          pageCount={carousel.pageCount}
          activePage={carousel.activePage}
          onPrev={() => carousel.scrollByDirection('left')}
          onNext={() => carousel.scrollByDirection('right')}
          onSelectPage={carousel.scrollToPage}
        />
        <p className="mt-3 text-center text-xs text-gray-400 md:hidden">
          Swipe left or right to browse more projects
        </p>
      </div>
    </section>
  )
}
