import { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { PayloadRequest } from 'payload'

const AboutSection: GlobalConfig = {
  slug: 'about-section',
  label: 'About Section',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'aboutMe',
      type: 'relationship',
      relationTo: 'about-me',
      hasMany: false,
      required: true,
      label: 'About Me',
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
        if (doc.aboutMe) {
          const aboutMe = await req.payload.findByID({
            collection: 'about-me',
            id: doc.aboutMe,
          })
          doc.aboutMe = aboutMe
        }
        return doc
      },
    ],
  },
}

export default AboutSection
