import { GlobalConfig } from 'payload'

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
}
