"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2, Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ContactFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactForm({ open, onOpenChange }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Form submitted:", data)
    setIsSubmitting(false)
    setIsSuccess(true)

    // Reset form after 2 seconds
    setTimeout(() => {
      reset()
      setIsSuccess(false)
      onOpenChange(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-ultra-gray-dark border-ultra-gray">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Get in touch</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill out the form below and I'll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-ultra-orange" />
            <h3 className="text-xl font-medium">Message sent successfully!</h3>
            <p className="text-gray-400 text-center">Thanks for reaching out. I'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-ultra-orange">*</span>
              </Label>
              <Input
                id="name"
                className="bg-ultra-gray border-ultra-gray-light focus-visible:ring-ultra-orange/50 focus-visible:border-ultra-orange/50"
                {...register("name")}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-ultra-orange">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                className="bg-ultra-gray border-ultra-gray-light focus-visible:ring-ultra-orange/50 focus-visible:border-ultra-orange/50"
                {...register("email")}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  className="bg-ultra-gray border-ultra-gray-light focus-visible:ring-ultra-orange/50 focus-visible:border-ultra-orange/50"
                  {...register("phone")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company (optional)</Label>
                <Input
                  id="company"
                  className="bg-ultra-gray border-ultra-gray-light focus-visible:ring-ultra-orange/50 focus-visible:border-ultra-orange/50"
                  {...register("company")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Why are you contacting? (optional)</Label>
              <Textarea
                id="message"
                className="min-h-[120px] bg-ultra-gray border-ultra-gray-light focus-visible:ring-ultra-orange/50 focus-visible:border-ultra-orange/50"
                placeholder="Tell me about your project, questions, or anything else..."
                {...register("message")}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-full border-ultra-gray"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-ultra-orange text-black hover:bg-ultra-orange/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
