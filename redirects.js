const redirects = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  const redirects = [internetExplorerRedirect]

  const blobStoreId = process.env.BLOB_READ_WRITE_TOKEN?.match(
    /^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i,
  )?.[1]?.toLowerCase()

  if (blobStoreId) {
    redirects.push({
      destination: `https://${blobStoreId}.public.blob.vercel-storage.com/:path*`,
      permanent: false,
      source: '/api/media/file/:path*',
    })
  }

  return redirects
}

export default redirects
