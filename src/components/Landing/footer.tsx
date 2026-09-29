'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUp, ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'
import { motion, useMotionTemplate, useScroll, useTransform } from 'motion/react'
import { useLenis } from 'lenis/react'
import { Button } from '@/components/ui/button'
import { ContactForm } from './contact-form'
import { EASE_OUT, Magnetic, Reveal, RollingText } from './motion'
import { SocialLink } from '../../payload-types'

const socialLinkClassName =
  'text-gray-400 hover:text-ultra-orange transition-all duration-300 hover:-translate-y-0.5'

export default function Footer({ socialLinks }: { socialLinks: SocialLink }) {
  const [contactOpen, setContactOpen] = useState(false)
  const currentYear = new Date().getFullYear()
  const lenis = useLenis()
  const wordmarkRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: wordmarkRef, offset: ['start end', 'end end'] })
  // Finishes early: the negative bottom margin leaves the wordmark's bottom edge just past the page end.
  const fill = useTransform(scrollYProgress, [0, 0.9], ['0%', '100%'])
  const wordmarkFill = useMotionTemplate`linear-gradient(to right, #FFA500 ${fill}, transparent ${fill})`

  const scrollToTop = () => {
    if (lenis) lenis.scrollTo(0)
    else window.scrollTo({ top: 0 })
  }
  return (
    <footer className="relative overflow-hidden bg-ultra-black border-t border-ultra-gray">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-ultra-orange/10 blur-3xl"
      />

      <div className="container relative mx-auto px-4">
        <div className="py-20 md:py-28 text-center">
          <Reveal>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gray-400">
              Have a project in mind?
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-balance">
              Let&apos;s build something{' '}
              <span className="animate-shimmer bg-[linear-gradient(to_right,#FFA500_0%,#ffffff_50%,#FFA500_100%)] bg-[length:200%_auto] bg-clip-text text-transparent">
                together
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <Magnetic>
              <Button
                size="lg"
                className="group mt-10 rounded-full bg-ultra-orange text-black hover:bg-ultra-orange/90 transition-all duration-300 hover:shadow-[0_0_40px_-5px_rgba(255,165,0,0.6)]"
                onClick={() => setContactOpen(true)}
              >
                <RollingText text="Get in Touch" />
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Button>
            </Magnetic>
          </Reveal>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-ultra-gray py-8">
          <div className="text-center md:text-left">
            <Link href="/" className="text-xl font-bold tracking-tighter">
              <span className="text-ultra-orange">WAN </span>AQIM
            </Link>
            <p className="mt-2 text-sm text-gray-500">© {currentYear} All rights reserved.</p>
          </div>

          <div className="flex items-center space-x-6">
            <Magnetic strength={0.5}>
              <Link href={socialLinks?.github || '#'} className={socialLinkClassName}>
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Magnetic>
            <Magnetic strength={0.5}>
              <Link href={socialLinks?.linkedin || '#'} className={socialLinkClassName}>
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </Magnetic>
            <Magnetic strength={0.5}>
              <Link href={socialLinks?.email || '#'} className={socialLinkClassName}>
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-ultra-gray bg-ultra-gray/50 transition-all duration-300 hover:border-ultra-orange hover:bg-ultra-orange hover:text-black"
                onClick={scrollToTop}
              >
                <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span className="sr-only">Back to top</span>
              </button>
            </Magnetic>
          </div>
        </div>
      </div>

      <motion.div
        ref={wordmarkRef}
        aria-hidden
        className="select-none text-center leading-none -mb-[0.18em]"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: EASE_OUT }}
      >
        <motion.span
          style={{ backgroundImage: wordmarkFill }}
          className="text-outline bg-clip-text !text-transparent whitespace-nowrap font-bold tracking-tighter text-[clamp(3rem,17vw,15rem)] transition-colors duration-700 hover:!text-ultra-orange/90"
        >
          WAN AQIM
        </motion.span>
      </motion.div>

      {/* Contact Form Modal */}
      <ContactForm open={contactOpen} onOpenChange={setContactOpen} socialLinks={socialLinks} />
    </footer>
  )
}
