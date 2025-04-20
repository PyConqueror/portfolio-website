import { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'


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
  hooks: {
    afterChange: [
      ({ doc, req: { payload, context } }) => {
        if (!context.disableRevalidate) {
          payload.logger.info(`Revalidating Projects Section`)
          revalidateTag('global_projects_section')
        }
        return doc
      },
    ],
  },
}

export default ProjectsSection
