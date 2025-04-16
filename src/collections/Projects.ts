import { CollectionConfig } from 'payload'

const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'githubLink',
      type: 'text',
      required: false,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Hobby',
          value: 'hobby',
        },
        {
          label: 'Professional',
          value: 'professional',
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'technologies',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'technology',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  timestamps: true,
}

export default Projects
