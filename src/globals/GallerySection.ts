import { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { PayloadRequest } from 'payload'

const GallerySection: GlobalConfig = {
  slug: 'gallery-global',
  label: 'Gallery Global',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'selectedGalleries',
      type: 'relationship',
      relationTo: 'gallery',
      hasMany: true,
      required: true,
      label: 'Select Galleries',
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, req: { payload, context } }) => {
        if (!context.disableRevalidate) {
          payload.logger.info(`Revalidating Gallery Section`)
          revalidateTag('global_gallery_section')
        }
        return doc
      },
    ],
    afterRead: [
      async ({ doc, req }: { doc: any; req: PayloadRequest }) => {
        if (doc.selectedGalleries && Array.isArray(doc.selectedGalleries)) {
          const galleries = await req.payload.find({
            collection: 'gallery',
            where: {
              id: {
                in: doc.selectedGalleries,
              },
            },
          })
          doc.selectedGalleries = galleries.docs.sort((a: any, b: any) => a.order - b.order)
        }
        return doc
      },
    ],
  },
}

export default GallerySection
