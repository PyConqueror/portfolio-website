import { GlobalConfig } from 'payload'

const ProjectsSection: GlobalConfig = {
  slug: 'projects-global',
  label: 'Projects Global',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'selectedProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      required: true,
      label: 'Select Projects',
    },
  ],
}

export default ProjectsSection
