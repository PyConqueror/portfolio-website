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
      type: 'text',
      required: true,
    },
    {
      name: 'description2',
      type: 'text',
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
      label: 'Skills',
      fields: [
        {
          name: 'skill',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  timestamps: true,
}

export default AboutMe
