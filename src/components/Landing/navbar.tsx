'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { FileText, FolderGit2, Images, Mail, UserRound } from 'lucide-react'
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { Button } from '@/components/ui/button'
import { LiquidGlass } from '@/components/ui/liquid-glass'
import { cn } from '@/lib/utils'
import { ContactForm } from './contact-form'
import { Magnetic, RollingText } from './motion'
import { NavSlider } from './nav-slider'
import { SocialLink } from '../../payload-types'

const NAV_LINKS = [
  { label: 'ABOUT', href: '#about', section: 'about', icon: UserRound },
  { label: 'PROJECTS', href: '#projects', section: 'projects', icon: FolderGit2 },
  { label: 'RESUME', href: '#resume', section: 'resume', icon: FileText },
  { label: 'GALLERY', href: '#gallery', section: 'gallery', icon: Images },
]

// Keeps the lens on a chosen section while the page scrolls past the sections in between.
const PIN_TIMEOUT = 2500

export default function Navbar({ socialLinks }: { socialLinks: SocialLink }) {
  const [scrolled, setScrolled] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [pinnedSection, setPinnedSection] = useState<string | null>(null)
  const pinTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  useMotionValueEvent(scrollY, 'change', (latest) => setScrolled(latest > 20))

  useEffect(() => {
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        })
        const next = NAV_LINKS.find((link) => visible.has(link.section))?.section ?? null
        setActiveSection(next)
        setPinnedSection((pinned) => (pinned === next ? null : pinned))
      },
      { rootMargin: '-45% 0px -54% 0px' },
    )

    NAV_LINKS.forEach((link) => {
      const section = document.getElementById(link.section)
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const pinSection = (section: string) => {
    setPinnedSection(section)
    clearTimeout(pinTimeoutRef.current)
    pinTimeoutRef.current = setTimeout(() => setPinnedSection(null), PIN_TIMEOUT)
  }

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-ultra-orange-dark via-ultra-orange to-ultra-orange-light"
      />

      <header className="fixed inset-x-0 top-3 z-50 hidden px-3 md:block">
        <LiquidGlass
          className={cn(
            'mx-auto flex items-center justify-between rounded-full py-2 pl-5 pr-2 transition-all duration-500',
            scrolled ? 'max-w-4xl' : 'max-w-6xl',
          )}
        >
          <Link href="/" className="text-xl font-bold tracking-tighter">
            <span className="text-ultra-orange">WAN </span>AQIM
          </Link>

          <nav aria-label="Primary" className="hidden md:flex items-center space-x-8">
            <NavSlider
              links={NAV_LINKS}
              activeSection={pinnedSection ?? activeSection}
              onSelect={pinSection}
            />
            <Magnetic>
              <Button
                variant="outline"
                className="group rounded-full border-ultra-gray bg-ultra-gray/50 hover:bg-ultra-orange hover:text-black hover:border-ultra-orange transition-all duration-300"
                onClick={() => setContactOpen(true)}
              >
                <RollingText text="Contact" />
              </Button>
            </Magnetic>
          </nav>
        </LiquidGlass>
      </header>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-3 z-50 flex items-center gap-2 px-3 md:hidden"
      >
        <LiquidGlass className="min-w-0 flex-1 rounded-full p-1">
          <NavSlider
            variant="tabs"
            links={NAV_LINKS}
            activeSection={pinnedSection ?? activeSection}
            onSelect={pinSection}
          />
        </LiquidGlass>
        <LiquidGlass className="shrink-0 rounded-full">
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="flex h-[60px] w-[60px] flex-col items-center justify-center gap-1 text-[10px] font-medium leading-3 tracking-wider"
          >
            <Mail className="h-5 w-5" />
            CONTACT
          </button>
        </LiquidGlass>
      </nav>

      {/* Contact Form Modal */}
      <ContactForm open={contactOpen} onOpenChange={setContactOpen} socialLinks={socialLinks} />
    </>
  )
}
