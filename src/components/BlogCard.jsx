function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString()
}

function BlogCardActions({ blogId, onEdit, onDelete }) {
  if (!onEdit && !onDelete) return null

  return (
    <div className="absolute right-3 top-3 z-20 flex gap-2">
      {onEdit && (
        <button
          onClick={(event) => {
            event.stopPropagation()
            onEdit(blogId)
          }}
          className="rounded-full border border-black/15 bg-white/95 px-3 py-1 text-[11px] font-semibold tracking-wide text-black shadow-sm transition hover:border-black hover:bg-black hover:text-white"
        >
          Edit
        </button>
      )}
      {onDelete && (
        <button
          onClick={(event) => {
            event.stopPropagation()
            onDelete(blogId)
          }}
          className="rounded-full border border-red-200 bg-white/95 px-3 py-1 text-[11px] font-semibold tracking-wide text-red-700 shadow-sm transition hover:border-red-600 hover:bg-red-600 hover:text-white"
        >
          Delete
        </button>
      )}
    </div>
  )
}

function CoverImage({ blog, className, lazy = true }) {
  if (blog.thumbnail) {
    return (
      <img
        src={blog.thumbnail}
        alt={blog.title}
        className={className}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        fetchPriority={lazy ? 'auto' : 'high'}
      />
    )
  }

  return (
    <div
      className={`${className} flex items-center justify-center bg-[linear-gradient(135deg,#f8f4ef,#e8ded2)] text-sm uppercase tracking-[0.18em] text-gray-500`}
    >
      No Image
    </div>
  )
}

/**
 * @param {{
 *  blog: { id: string, title: string, category: string, thumbnail?: string, content?: string, authorName?: string, createdAt?: string },
 *  variant?: 'featured' | 'secondary' | 'grid',
 *  onOpen?: (id: string) => void,
 *  onEdit?: (id: string) => void,
 *  onDelete?: (id: string) => void
 * }}
 */
export default function BlogCard({ blog, variant = 'grid', onOpen, onEdit, onDelete }) {
  if (!blog) return null

  const handleOpen = () => {
    if (onOpen) onOpen(blog.id)
  }

  if (variant === 'featured') {
    return (
      <article
        className="relative overflow-hidden border border-black/10 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition hover:shadow-[0_16px_48px_rgba(0,0,0,0.09)]"
        onClick={handleOpen}
      >
        <BlogCardActions blogId={blog.id} onEdit={onEdit} onDelete={onDelete} />

        <div className="grid cursor-pointer lg:grid-cols-5">
          <div className="relative lg:col-span-3 overflow-hidden">
            <CoverImage
              blog={blog}
              lazy={false}
              className="h-[320px] w-full object-cover transition duration-700 hover:scale-[1.04] md:h-[420px]"
            />
          </div>

          <div className="flex lg:col-span-2 flex-col px-8 py-8 md:px-10 md:py-10">
            <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-600">
              <span className="text-red-600">{blog.category}</span>
              <span className="text-gray-300">|</span>
              <span>{formatDate(blog.createdAt)}</span>
            </div>

            <h2 className="mb-4 text-2xl font-bold leading-tight md:text-3xl">{blog.title}</h2>
            <p className="line-clamp-6 whitespace-pre-line text-gray-600">{blog.content || 'No preview text.'}</p>

            <div className="mt-auto pt-6 text-xs uppercase tracking-[0.14em] text-gray-500">
              {blog.authorName || 'Anonymous Author'}
            </div>
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'secondary') {
    return (
      <article
        className="relative overflow-hidden border border-black/10 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
        onClick={handleOpen}
      >
        <BlogCardActions blogId={blog.id} onEdit={onEdit} onDelete={onDelete} />

        <div className="cursor-pointer">
          <CoverImage blog={blog} className="h-56 w-full object-cover" />

          <div className="p-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-red-600">{blog.category}</p>
            <h3 className="line-clamp-2 text-xl font-bold leading-snug">{blog.title}</h3>
            <p className="mt-3 line-clamp-2 text-sm text-gray-600">{blog.content || 'No preview text.'}</p>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      className="relative overflow-hidden border border-black/10 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
      onClick={handleOpen}
    >
      <BlogCardActions blogId={blog.id} onEdit={onEdit} onDelete={onDelete} />

      <div className="cursor-pointer">
        <CoverImage blog={blog} className="h-44 w-full object-cover" />

        <div className="p-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-red-600">{blog.category}</p>
          <h4 className="line-clamp-2 text-base font-bold">{blog.title}</h4>
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">{blog.content || 'No preview text.'}</p>
        </div>
      </div>
    </article>
  )
}
