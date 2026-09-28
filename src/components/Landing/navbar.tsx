'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Github, Linkedin, Mail, Menu, X } from 'lucide-react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ContactForm } from './contact-form'
import { EASE_OUT } from './motion'
import { SocialLink } from '../../payload-types'

const NAV_LINKS = [
  { label: 'ABOUT', href: '#about', section: 'about' },
  { label: 'PROJECTS', href: '#projects', section: 'projects' },
  { label: 'RESUME', href: '/resume', section: 'resume' },
  { label: 'GALLERY', href: '#gallery', section: 'gallery' },
]

const MENU_ORIGIN = 'at calc(100% - 2.25rem) 2.5rem'

export default function Navbar({ socialLinks }: { socialLinks: SocialLink }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20)
  })

  useEffect(() => {
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        })
        setActiveSection(NAV_LINKS.find((link) => visible.has(link.section))?.section ?? null)
      },
      { rootMargin: '-45% 0px -54% 0px' },
    )

    NAV_LINKS.forEach((link) => {
      const section = document.getElementById(link.section)
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    const desktopQuery = window.matchMedia('(min-width: 768px)')
    const handleDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    desktopQuery.addEventListener('change', handleDesktop)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      desktopQuery.removeEventListener('change', handleDesktop)
    }
  }, [isOpen])

  const socialItems = [
    { label: 'GitHub', href: socialLinks?.github, icon: Github },
    { label: 'LinkedIn', href: socialLinks?.linkedin, icon: Linkedin },
    { label: 'Email', href: socialLinks?.email, icon: Mail },
  ]

  return (
    <>
      <header
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300',
          scrolled ? 'bg-ultra-black/80 backdrop-blur-md py-3' : 'bg-transparent py-5',
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            <span className="text-ultra-orange">WAN </span>AQIM
          </Link>

          <nav aria-label="Primary" className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.section
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative py-1 text-sm transition-colors hover:text-ultra-orange',
                    'after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white/40 after:transition-transform after:duration-300 hover:after:scale-x-100',
                    isActive && 'text-ultra-orange',
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      className="absolute -bottom-1 left-0 right-0 z-10 h-0.5 rounded-full bg-ultra-orange"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </Link>
              )
            })}
            <Button
              variant="outline"
              className="rounded-full border-ultra-gray bg-ultra-gray/50 hover:bg-ultra-orange hover:text-black hover:border-ultra-orange transition-all duration-300"
              onClick={() => setContactOpen(true)}
            >
              Contact
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen(!isOpen)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isOpen ? 'close' : 'open'}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.span>
            </AnimatePresence>
          </Button>
        </div>

        <motion.div
          aria-hidden
          style={{ scaleX: progress }}
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-ultra-orange-dark via-ultra-orange to-ultra-orange-light"
        />
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 overflow-y-auto bg-ultra-black md:hidden"
            initial={{ clipPath: `circle(0% ${MENU_ORIGIN})` }}
            animate={{ clipPath: `circle(150% ${MENU_ORIGIN})` }}
            exit={{ clipPath: `circle(0% ${MENU_ORIGIN})` }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-ultra-orange/10 blur-3xl"
            />
            <nav
              aria-label="Mobile"
              className="relative flex min-h-full flex-col justify-center gap-10 px-8 pb-12 pt-28"
            >
              <ul className="space-y-5">
                {NAV_LINKS.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.15 + index * 0.07 }}
                  >
                    <Link
                      href={link.href}
                      className="group flex items-baseline gap-4"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-sm font-medium text-ultra-orange">0{index + 1}</span>
                      <span
                        className={cn(
                          'text-4xl font-bold tracking-tight transition-colors group-hover:text-ultra-orange',
                          activeSection === link.section && 'text-ultra-orange',
                        )}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.45 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-ultra-gray bg-ultra-gray/50 hover:bg-ultra-orange hover:text-black hover:border-ultra-orange transition-all duration-300"
                  onClick={() => {
                    setIsOpen(false)
                    setContactOpen(true)
                  }}
                >
                  Contact
                </Button>
                <div className="flex items-center gap-6 border-t border-ultra-gray pt-6">
                  {socialItems.map(({ label, href, icon: Icon }) => (
                    <Link
                      key={label}
                      href={href || '#'}
                      className="text-gray-400 transition-colors hover:text-ultra-orange"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{label}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Form Modal */}
      <ContactForm open={contactOpen} onOpenChange={setContactOpen} socialLinks={socialLinks} />
    </>
  )
}
