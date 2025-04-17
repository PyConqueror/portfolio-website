import { ArrowDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Landing/navbar'
import AboutSection from '@/components/Landing/about-section'
import ProjectsSection from '@/components/Landing/projects-section'
import GallerySection from '@/components/Landing/gallery-section'
import ResumeSection from '@/components/Landing/resume-section'
import Footer from '@/components/Landing/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-ultra-black text-white">
      <Navbar />

      <section
        className="relative h-screen flex flex-col items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-ultra-orange">
              Creative Developer
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-black">Building digital experiences that matter</p>
          <Button
            variant="outline"
            size="lg"
            className="mt-8 rounded-full border-ultra-gray text-white hover:bg-ultra-orange hover:text-black hover:border-ultra-orange transition-all duration-300"
            asChild
          >
            <Link href="#about">
              Explore My Work <ArrowDown className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
          <ArrowDown className="h-6 w-6 text-ultra-orange" />
        </div>
      </section>

      <AboutSection />

      <ProjectsSection />

      <ResumeSection />

      <GallerySection />

      <Footer />
    </div>
  )
}
