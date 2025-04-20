import { CollectionConfig } from 'payload'

const Resume: CollectionConfig = {
  slug: 'resume',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'resumeFile',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Resume PDF',
    },
    {
      name: 'resumeUrl',
      type: 'text',
      required: false,
      label: 'External Resume URL',
      admin: {
        description: 'URL to external resume page (used if no file is uploaded)',
      },
    }
  ],
  timestamps: true,
}

export default Resume
