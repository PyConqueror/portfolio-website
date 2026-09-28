import Navbar from '@/components/Landing/navbar'
import HeroSection from '@/components/Landing/hero-section'
import AboutSection from '@/components/Landing/about-section'
import ProjectsSection from '@/components/Landing/projects-section'
import GallerySection from '@/components/Landing/gallery-section'
import ResumeSection from '@/components/Landing/resume-section'
import Footer from '@/components/Landing/footer'
import { MotionProvider } from '@/components/Landing/motion'
import { getGlobal } from '@/utilities/getGlobals'
import {
  SocialLink,
  AboutSection as AboutSectionType,
  ProjectsGlobal,
  ResumeSection as ResumeSectionType,
  GalleryGlobal,
} from '../../payload-types'
const socialLinks = (await getGlobal('social-links')) as SocialLink
const aboutSectionData = (await getGlobal('about-section')) as AboutSectionType
const projectsSectionData = (await getGlobal('projects-global')) as ProjectsGlobal
const resumeSectionData = (await getGlobal('resume-section')) as ResumeSectionType
const gallerySectionData = (await getGlobal('gallery-global')) as GalleryGlobal

export default function Home() {
  return (
    <MotionProvider>
      <div className="min-h-screen bg-ultra-black text-white">
        <Navbar socialLinks={socialLinks} />

        <HeroSection />

        <AboutSection aboutSectionData={aboutSectionData} />

        <ProjectsSection projectSectionData={projectsSectionData} />

        <ResumeSection resumeSectionData={resumeSectionData} />

        <GallerySection gallerySectionData={gallerySectionData} />

        <Footer socialLinks={socialLinks} />
      </div>
    </MotionProvider>
  )
}
