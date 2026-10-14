'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { motion, useMotionTemplate, useScroll, useTransform } from 'motion/react'
import { useLenis } from 'lenis/react'
import { ContactForm } from './contact-form'
import { LiquidRise } from './liquid-backdrop'
import { EASE_OUT, Magnetic, RollingText } from './motion'
import SectionHeading, { sectionLabelClassName } from './section-heading'
import { SocialLink } from '../../payload-types'

const pillClassName =
  'group inline-flex items-center gap-2 rounded-full border border-white/30 px-[33px] py-[11px] text-base text-white transition-colors duration-700 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] hover:border-white'
const linkClassName =
  'inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.12em] text-white/70 transition-colors duration-500 hover:text-white'

export default function Footer({ socialLinks }: { socialLinks: SocialLink }) {
  const [contactOpen, setContactOpen] = useState(false)
  const currentYear = new Date().getFullYear()
  const lenis = useLenis()
  const footerRef = useRef<HTMLElement>(null)
  const wordmarkRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: footerProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  })
  const { scrollYProgress } = useScroll({ target: wordmarkRef, offset: ['start end', 'end end'] })
  // Finishes early: the negative bottom margin leaves the wordmark's bottom edge just past the page end.
  const fill = useTransform(scrollYProgress, [0, 0.9], ['0%', '100%'])
  const wordmarkFill = useMotionTemplate`linear-gradient(to right, #ffffff ${fill}, transparent ${fill})`

  const socialItems = [
    { label: 'GitHub', href: socialLinks?.github },
    { label: 'LinkedIn', href: socialLinks?.linkedin },
    { label: 'Email', href: socialLinks?.email },
  ]

  const scrollToTop = () => {
    if (lenis) lenis.scrollTo(0)
    else window.scrollTo({ top: 0 })
  }

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-ultra-black text-white">
      <LiquidRise
        progress={footerProgress}
        className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_30%)]"
      />

      <div className="relative mx-auto max-w-[1078px] px-6 pt-28 md:pt-40">
        <SectionHeading
          index="05"
          label="Contact"
          meta="Available for work"
          lines={[
            'Let’s build ',
            'something ',
            <>
              <em>t</em>ogether
            </>,
          ]}
          description="Have a project in mind?"
          aside={
            <Magnetic>
              <button type="button" className={pillClassName} onClick={() => setContactOpen(true)}>
                <RollingText text="Get in touch" />
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} />
              </button>
            </Magnetic>
          }
        />

        <div className="mt-28 pb-28 md:mt-40 md:pb-10">
          <div className="flex flex-col gap-8 border-t border-white/15 pt-6 md:flex-row md:items-center md:justify-between">
            <span className={sectionLabelClassName}>
              © {currentYear} Wan Aqim. All rights reserved.
            </span>
            <nav aria-label="Social" className="flex gap-6">
              {socialItems.map((item) => (
                <Link key={item.label} href={item.href || '#'} className={linkClassName}>
                  {item.label} <ArrowUpRight className="h-3 w-3" />
                </Link>
              ))}
            </nav>
            <Magnetic>
              <button
                type="button"
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition-colors duration-500 hover:border-white"
                onClick={scrollToTop}
              >
                <ArrowUp
                  className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5"
                  strokeWidth={1.25}
                />
                <span className="sr-only">Back to top</span>
              </button>
            </Magnetic>
          </div>
        </div>
      </div>

      <motion.div
        ref={wordmarkRef}
        aria-hidden
        className="relative -mb-[0.18em] select-none text-center leading-none"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: EASE_OUT }}
      >
        <motion.span
          style={{ backgroundImage: wordmarkFill }}
          className="text-outline whitespace-nowrap bg-clip-text text-[clamp(3rem,17vw,15rem)] font-normal tracking-tighter !text-transparent"
        >
          WAN AQIM
        </motion.span>
      </motion.div>

      <ContactForm open={contactOpen} onOpenChange={setContactOpen} socialLinks={socialLinks} />
    </footer>
  )
}
