'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContactForm } from './contact-form'
import { SocialLink } from '../../payload-types'

export default function Footer({ socialLinks }: { socialLinks: SocialLink }) {
  const [contactOpen, setContactOpen] = useState(false)
  const currentYear = new Date().getFullYear()
  return (
    <footer className="py-12 bg-ultra-black border-t border-ultra-gray">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-xl font-bold tracking-tighter">
              <span className="text-ultra-orange">ULTRA</span>FOLIO
            </Link>
            <p className="mt-2 text-sm text-gray-500">© {currentYear} All rights reserved.</p>
          </div>

          <div className="flex flex-col items-center mb-6 md:mb-0">
            <Button
              variant="outline"
              className="rounded-full border-ultra-gray bg-ultra-gray/50 hover:bg-ultra-orange hover:text-black hover:border-ultra-orange transition-all duration-300 mb-4"
              onClick={() => setContactOpen(true)}
            >
              Get in Touch
            </Button>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href={socialLinks?.github || '#'}
              className="text-gray-400 hover:text-ultra-orange transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href={socialLinks?.linkedin || '#'}
              className="text-gray-400 hover:text-ultra-orange transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href={socialLinks?.email || '#'}
              className="text-gray-400 hover:text-ultra-orange transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      <ContactForm open={contactOpen} onOpenChange={setContactOpen} />
    </footer>
  )
}
