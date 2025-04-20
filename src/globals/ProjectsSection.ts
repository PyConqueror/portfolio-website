import { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { PayloadRequest } from 'payload'

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
    afterRead: [
      async ({ doc, req }: { doc: any; req: PayloadRequest }) => {
        if (doc.selectedProjects && Array.isArray(doc.selectedProjects)) {
          const projects = await req.payload.find({
            collection: 'projects',
            where: {
              id: {
                in: doc.selectedProjects,
              },
            },
          })
          doc.selectedProjects = projects.docs.sort((a: any, b: any) => a.order - b.order)
        }
        return doc
      },
    ],
  },
}

export default ProjectsSection
