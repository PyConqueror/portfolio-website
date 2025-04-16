import { CollectionConfig } from 'payload'

const AboutMe: CollectionConfig = {
  slug: 'about-me',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'About Me',
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'skills',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'category',
          type: 'text',
          required: true,
        },
        {
          name: 'items',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'skill',
              type: 'text',
              required: true,
            },
            {
              name: 'proficiency',
              type: 'select',
              required: true,
              options: [
                {
                  label: 'Beginner',
                  value: 'beginner',
                },
                {
                  label: 'Intermediate',
                  value: 'intermediate',
                },
                {
                  label: 'Advanced',
                  value: 'advanced',
                },
                {
                  label: 'Expert',
                  value: 'expert',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            {
              label: 'GitHub',
              value: 'github',
            },
            {
              label: 'LinkedIn',
              value: 'linkedin',
            },
            {
              label: 'Twitter',
              value: 'twitter',
            },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  timestamps: true,
}

export default AboutMe
