import { CollectionConfig } from 'payload'

const HeroSection: CollectionConfig = {
  slug: 'hero-section',
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
      defaultValue: 'Creative Developer',
    },
    {
      name: 'subtitle',
      type: 'text',
      required: true,
      defaultValue: 'Building digital experiences that matter',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Background Image',
    },
  ],
  timestamps: true,
}

export default HeroSection
