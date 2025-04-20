import { CollectionConfig } from 'payload'

const AboutMe: CollectionConfig = {
  slug: 'about-me',
  admin: {
    useAsTitle: 'Paragrah 1',
  },
  access: {
    read: () => true,
  },
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
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
      required: true,
      label: 'Skills & Expertise',
    },
  ],
  timestamps: true,
}

export default AboutMe
