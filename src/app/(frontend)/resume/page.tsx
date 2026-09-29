import type { Metadata } from 'next'
import { ResumeFullscreenViewer } from '@/components/resume-fullscreen-viewer'

export const metadata: Metadata = {
  title: 'Resume | Wan Aqim',
  description: 'View and download the full resume of Wan Aqim.',
}

export default function ResumePage() {
  return <ResumeFullscreenViewer resumeUrl="/resume.pdf" />
}
