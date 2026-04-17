'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Github, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProjectsGlobal, Project, Media } from '@/payload-types'

function isProject(item: string | Project): item is Project {
  return (item as Project).title !== undefined
}

export default function ProjectsSection({
  projectSectionData,
}: {
  projectSectionData: ProjectsGlobal
}) {
  const desktopProjectsRef = useRef<HTMLDivElement>(null)

  const projects = projectSectionData.selectedProjects

  const filteredProjects = projects.filter(isProject)

  const handleDesktopScroll = (direction: 'left' | 'right') => {
    const container = desktopProjectsRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.9
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section id="projects" className="py-24 bg-ultra-black">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Featured <span className="text-ultra-orange">Projects</span>
          </h2>
          <p className="text-gray-400 text-lg">
            A selection of my most significant work across various domains and technologies.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <div className="hidden md:block absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 z-10">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-ultra-gray-dark/80 backdrop-blur-sm hover:bg-ultra-orange hover:text-black border-ultra-gray"
              onClick={() => handleDesktopScroll('left')}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous projects</span>
            </Button>
          </div>

          <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
            {filteredProjects.map((project) => {
              const demoUrl = project.demoUrl?.trim()
              return (
                <Card
                  key={project.id}
                  className="snap-start shrink-0 w-full bg-ultra-gray-dark border-ultra-gray overflow-hidden hover:border-ultra-orange transition-all duration-300"
                >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-ultra-black/80 to-transparent z-10"></div>
                  <Image
                    src={(project.image as Media).url || '/placeholder.svg'}
                    alt={project.title}
                    width={600}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => {
                      if (typeof tag === 'string') return null
                      return (
                        <span key={tag.id} className="text-xs bg-ultra-gray px-2 py-1 rounded-full">
                          {tag.name}
                        </span>
                      )
                    })}
                  </div>

                  <div className="flex items-center gap-3">
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
            })}
          </div>
          <div
            ref={desktopProjectsRef}
            className="hidden md:flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
          >
            {filteredProjects.map((project) => {
              const demoUrl = project.demoUrl?.trim()
              return (
                <Card
                  key={project.id}
                  className="snap-start shrink-0 w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)] bg-ultra-gray-dark border-ultra-gray overflow-hidden hover:border-ultra-orange transition-all duration-300"
                >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-ultra-black/80 to-transparent z-10"></div>
                  <Image
                    src={(project.image as Media).url || '/placeholder.svg'}
                    alt={project.title}
                    width={600}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => {
                      if (typeof tag === 'string') return null
                      return (
                        <span key={tag.id} className="text-xs bg-ultra-gray px-2 py-1 rounded-full">
                          {tag.name}
                        </span>
                      )
                    })}
                  </div>

                  <div className="flex items-center gap-3">
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
            })}
          </div>

          <div className="hidden md:block absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 z-10">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-ultra-gray-dark/80 backdrop-blur-sm hover:bg-ultra-orange hover:text-black border-ultra-gray"
              onClick={() => handleDesktopScroll('right')}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next projects</span>
            </Button>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-gray-400">
          Swipe left or right to browse more projects
        </p>
      </div>
    </section>
  )
}
