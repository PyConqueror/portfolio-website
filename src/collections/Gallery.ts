import { CollectionConfig } from 'payload'

const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'description',
    defaultColumns: ['description', 'year', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Gallery Image',
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      label: 'Short Description',
    },
    {
      name: 'year',
      type: 'text',
      required: true,
      label: 'Year',
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text',
    },
    {
      name: 'fullDescription',
      type: 'textarea',
      required: false,
      label: 'Full Description (shown in modal)',
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
      },
    },
  ],
  timestamps: true,
}

export default Gallery
