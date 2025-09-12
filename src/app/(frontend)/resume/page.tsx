import type { Metadata } from 'next'
import { getCachedGlobal, getGlobal } from '@/utilities/getGlobals'
import type { ResumeSection as ResumeSectionType } from '@/payload-types'
import { ResumeFullscreenViewer } from '@/components/resume-fullscreen-viewer'

export const metadata: Metadata = {
  title: 'Resume | Wan Aqim',
  description: 'View and download the full resume of Wan Aqim.',
}
const resumeSectionData = (await getGlobal('resume-section')) as ResumeSectionType

export default async function ResumePage() {
  const resumeSection = (await resumeSectionData) as ResumeSectionType
  const resumeUrl =
    typeof resumeSection.resumeFile === 'object' && resumeSection.resumeFile?.url
      ? resumeSection.resumeFile.url
      : ''

  return <ResumeFullscreenViewer resumeUrl={resumeUrl || ''} />
}
