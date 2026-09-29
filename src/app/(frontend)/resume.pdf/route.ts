import { getGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'
import type { ResumeSection } from '@/payload-types'

export const dynamic = 'force-static'

export async function GET() {
  const { resumeFile } = (await getGlobal('resume-section')) as ResumeSection
  const url = typeof resumeFile === 'object' ? resumeFile?.url : null
  if (!url) return new Response('Not found', { status: 404 })

  const res = await fetch(new URL(url, getServerSideURL()))
  if (!res.ok) return new Response('Not found', { status: 404 })

  return new Response(await res.arrayBuffer(), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="Wan-Aqim-Resume.pdf"',
    },
  })
}
