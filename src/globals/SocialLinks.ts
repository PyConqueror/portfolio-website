import { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const SocialLinks: GlobalConfig = {
  slug: 'social-links',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'github',
      type: 'text',
      required: true,
      defaultValue: 'https://github.com',
      admin: {
        description: 'Enter your GitHub profile URL',
      },
    },
    {
      name: 'linkedin',
      type: 'text',
      required: true,
      defaultValue: 'https://linkedin.com',
      admin: {
        description: 'Enter your LinkedIn profile URL',
      },
    },
    {
      name: 'email',
      type: 'text',
      required: true,
      defaultValue: 'mailto:your@email.com',
      admin: {
        description: 'Enter your email address with mailto: prefix',
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, req: { payload, context } }) => {
        if (!context.disableRevalidate) {
          payload.logger.info(`Revalidating Social Links`)
          revalidatePath('/')
        }
        return doc
      },
    ],
  },
}
