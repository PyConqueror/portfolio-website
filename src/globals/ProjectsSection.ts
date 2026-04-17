import { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
// import { revalidateTag } from 'next/cache'
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
          // revalidateTag('global_projects_section')
          revalidatePath('/')
        }
        return doc
      },
    ],
    afterRead: [
      async ({ doc, req }: { doc: any; req: PayloadRequest }) => {
        const rawSelectedProjects = Array.isArray(doc?.selectedProjects) ? doc.selectedProjects : []

        if (rawSelectedProjects.length > 0) {
          const projects = await req.payload.find({
            collection: 'projects',
            limit: 0,
            pagination: false,
            where: {
              id: {
                in: rawSelectedProjects,
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
