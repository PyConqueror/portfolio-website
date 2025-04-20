import { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { PayloadRequest } from 'payload'

const ResumeSection: GlobalConfig = {
  slug: 'resume-section',
  label: 'Resume Section',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'resumeFile',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Resume PDF',
      validate: (value: any) => {
        if (value && value.mimeType == 'application/pdf') {
          return 'Only PDF files are allowed.'
        }
        return true
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, req: { payload, context } }) => {
        if (!context.disableRevalidate) {
          payload.logger.info(`Revalidating Resume Section`)
          revalidateTag('global_resume_section')
        }
        return doc
      },
    ],
    afterRead: [
      async ({ doc, req }: { doc: any; req: PayloadRequest }) => {
        if (doc.resumeFile) {
          const resume = await req.payload.findByID({
            collection: 'media',
            id: doc.resumeFile,
          })
          doc.resumeFile = resume
        }
        return doc
      },
    ],
  },
}

export default ResumeSection
