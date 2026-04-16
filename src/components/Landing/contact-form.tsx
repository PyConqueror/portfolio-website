"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Github, Linkedin, Mail, Phone, type LucideIcon } from "lucide-react"
import { SocialLink } from "../../payload-types"

interface ContactFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  socialLinks: SocialLink
}

interface ContactItem {
  label: string
  value: string
  href: string
  icon: LucideIcon
  external?: boolean
}

export function ContactForm({ open, onOpenChange, socialLinks }: ContactFormProps) {
  const contactName = socialLinks.name.trim()
  const emailAddress = socialLinks.email.replace(/^mailto:/, "")
  const phoneNumber = socialLinks.phone?.trim()
  const contactCard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${contactName}`,
    `EMAIL;TYPE=INTERNET:${emailAddress}`,
    ...(phoneNumber ? [`TEL;TYPE=CELL:${phoneNumber}`] : []),
    `URL:${socialLinks.github}`,
    `URL:${socialLinks.linkedin}`,
    "END:VCARD",
  ].join("\r\n")
  const contactCardHref = `data:text/vcard;charset=utf-8,${encodeURIComponent(contactCard)}`
  const contactCardFileName =
    `${contactName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "contact"}.vcf`
  const contactItems: ContactItem[] = [
    {
      label: "Email",
      value: emailAddress,
      href: socialLinks.email,
      icon: Mail,
    },
    ...(phoneNumber
      ? [{
          label: "Phone",
          value: phoneNumber,
          href: `tel:${phoneNumber}`,
          icon: Phone,
        }]
      : []),
    {
      label: "GitHub",
      value: socialLinks.github.replace(/^https?:\/\//, ""),
      href: socialLinks.github,
      icon: Github,
      external: true,
    },
    {
      label: "LinkedIn",
      value: socialLinks.linkedin.replace(/^https?:\/\//, ""),
      href: socialLinks.linkedin,
      icon: Linkedin,
      external: true,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-ultra-gray-dark border-ultra-gray">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Get in touch</DialogTitle>
          <DialogDescription className="text-gray-400">
            Reach out to {contactName} directly using any of the contact details below.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border border-ultra-gray bg-ultra-gray/40 p-5">
          <p className="text-sm text-gray-400">Contact</p>
          <p className="mt-1 text-xl font-semibold text-white">{contactName}</p>
        </div>

        <div className="space-y-3">
          {contactItems.map((item) => {
            const Icon = item.icon

            return (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="flex items-center gap-4 rounded-2xl border border-ultra-gray bg-ultra-gray/40 p-4 transition-colors hover:border-ultra-orange hover:bg-ultra-gray"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ultra-black text-ultra-orange">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-gray-400">{item.label}</span>
                  <span className="block break-all text-white">{item.value}</span>
                </span>
              </a>
            )
          })}
        </div>

        <DialogFooter>
          <Button
            type="button"
            asChild
            className="rounded-full bg-ultra-orange text-black hover:bg-ultra-orange/90"
          >
            <a href={contactCardHref} download={contactCardFileName}>
              Save Contact
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full border-ultra-gray"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
