"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ContactForm } from "./contact-form"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-ultra-black/80 backdrop-blur-md py-3" : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tighter">
          <span className="text-ultra-orange">ULTRA</span>FOLIO
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#about" className="text-sm hover:text-ultra-orange transition-colors">
            ABOUT
          </Link>
          <Link href="#projects" className="text-sm hover:text-ultra-orange transition-colors">
            PROJECTS
          </Link>
          <Link href="#resume" className="text-sm hover:text-ultra-orange transition-colors">
            RESUME
          </Link>
          <Link href="#gallery" className="text-sm hover:text-ultra-orange transition-colors">
            GALLERY
          </Link>
          <Button
            variant="outline"
            className="rounded-full border-ultra-gray bg-ultra-gray/50 hover:bg-ultra-orange hover:text-black hover:border-ultra-orange transition-all duration-300"
            onClick={() => setContactOpen(true)}
          >
            Contact
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed inset-0 bg-ultra-black z-40 pt-20">
          <nav className="flex flex-col items-center justify-center h-full space-y-8">
            <Link href="#about" className="text-2xl font-medium" onClick={() => setIsOpen(false)}>
              ABOUT
            </Link>
            <Link href="#projects" className="text-2xl font-medium" onClick={() => setIsOpen(false)}>
              PROJECTS
            </Link>
            <Link href="#resume" className="text-2xl font-medium" onClick={() => setIsOpen(false)}>
              RESUME
            </Link>
            <Link href="#gallery" className="text-2xl font-medium" onClick={() => setIsOpen(false)}>
              GALLERY
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="mt-4 rounded-full border-ultra-gray bg-ultra-gray/50 hover:bg-ultra-orange hover:text-black hover:border-ultra-orange transition-all duration-300"
              onClick={() => {
                setIsOpen(false)
                setContactOpen(true)
              }}
            >
              Contact
            </Button>
          </nav>
        </div>
      )}

      {/* Contact Form Modal */}
      <ContactForm open={contactOpen} onOpenChange={setContactOpen} />
    </header>
  )
}
