"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Github, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

export default function ProjectsSection() {
  const isMobile = useMobile()
  const [currentPage, setCurrentPage] = useState(0)
  const [projectsPerPage, setProjectsPerPage] = useState(3)

  // Update projects per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setProjectsPerPage(1)
      } else if (window.innerWidth < 1024) {
        setProjectsPerPage(2)
      } else {
        setProjectsPerPage(3)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const projects = [
    {
      id: 1,
      title: "Digital Experience Platform",
      description: "A comprehensive platform for creating immersive digital experiences with real-time analytics.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["Next.js", "React", "Node.js"],
      demoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 2,
      title: "E-Commerce Solution",
      description: "A modern e-commerce platform with seamless checkout and inventory management.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["React", "Stripe", "Tailwind"],
      demoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 3,
      title: "AI Content Generator",
      description: "An AI-powered tool that helps create engaging content for various platforms.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["Python", "TensorFlow", "React"],
      demoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 4,
      title: "Portfolio Generator",
      description: "A tool that helps professionals create stunning portfolios without coding knowledge.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["Vue.js", "Firebase", "SCSS"],
      demoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 5,
      title: "Blockchain Explorer",
      description: "A comprehensive tool for exploring and analyzing blockchain transactions and data.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["Web3.js", "React", "GraphQL"],
      demoUrl: "#",
      githubUrl: "#",
    },
    {
      id: 6,
      title: "Smart Home Dashboard",
      description: "An intuitive dashboard for controlling and monitoring smart home devices.",
      image: "/placeholder.svg?height=300&width=600",
      tags: ["IoT", "React", "Node.js"],
      demoUrl: "#",
      githubUrl: "#",
    },
  ]

  const totalPages = Math.ceil(projects.length / projectsPerPage)

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0))
  }

  const visibleProjects = projects.slice(currentPage * projectsPerPage, (currentPage + 1) * projectsPerPage)

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
          <div className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 z-10">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-ultra-gray-dark/80 backdrop-blur-sm hover:bg-ultra-orange hover:text-black border-ultra-gray"
              onClick={handlePrevPage}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous projects</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleProjects.map((project) => (
              <Card
                key={project.id}
                className="bg-ultra-gray-dark border-ultra-gray overflow-hidden hover:border-ultra-orange transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-ultra-black/80 to-transparent z-10"></div>
                  <Image
                    src={project.image || "/placeholder.svg"}
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
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-ultra-gray px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-full border-ultra-gray hover:bg-ultra-orange hover:text-black hover:border-ultra-orange"
                    >
                      <Link href={project.demoUrl}>
                        <ArrowUpRight className="mr-1 h-4 w-4" /> Demo
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-full border-ultra-gray hover:bg-ultra-orange hover:text-black hover:border-ultra-orange"
                    >
                      <Link href={project.githubUrl}>
                        <Github className="mr-1 h-4 w-4" /> Code
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 z-10">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-ultra-gray-dark/80 backdrop-blur-sm hover:bg-ultra-orange hover:text-black border-ultra-gray"
              onClick={handleNextPage}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next projects</span>
            </Button>
          </div>
        </div>

        {/* Pagination Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                currentPage === index ? "bg-ultra-orange w-4" : "bg-ultra-gray"
              }`}
              onClick={() => setCurrentPage(index)}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
