import { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { PayloadRequest } from 'payload'

const AboutSection: GlobalConfig = {
  slug: 'about-section',
  label: 'About Section',
  fields: [
    {
      name: 'Paragrah 1',
      type: 'text',
      label: 'Paragrah 1',
      required: true,
    },
    {
      name: 'Paragrah 2',
      type: 'text',
      label: 'Paragrah 2',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
    },
    {
      name: 'skillsAndExpertise',
      type: 'array',
      label: 'Skills & Expertise',
      fields: [
        {
          name: 'skill',
          type: 'text',
          label: 'Skill',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, req: { payload, context } }) => {
        if (!context.disableRevalidate) {
          payload.logger.info(`Revalidating about section`)
          revalidateTag('global_about_section')
        }
        return doc
      },
    ],
    afterRead: [
      async ({ doc, req }: { doc: any; req: PayloadRequest }) => {
        if (doc.image) {
          const media = await req.payload.findByID({
            collection: 'media',
            id: doc.image,
          })
          doc.image = media.url
        }
        return doc
      },
    ],
  },
}

export default AboutSection
