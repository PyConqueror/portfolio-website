import { CollectionConfig } from 'payload'

const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['name', 'type', 'featured', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
    },

    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
      },
    },
    {
      name: 'demoUrl',
      type: 'text',
      required: false,
      label: 'Demo URL',
    },
    {
      name: 'githubUrl',
      type: 'text',
      required: false,
      label: 'GitHub Repository URL',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
      required: true,
      label: 'Technologies',
    },
  ],
  timestamps: true,
}

export default Projects
