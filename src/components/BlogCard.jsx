/**
 * @param {{
 *  blog: { id: string, title: string, category: string, thumbnail?: string, content?: string },
 *  variant: 'featured' | 'secondary' | 'grid',
 *  onEdit?: (id: string) => void,
 *  onDelete?: (id: string) => void
 * }}
 */
export default function BlogCard({ blog, variant = 'grid', onEdit, onDelete }) {
  if (!blog) return null

  const ActionButtons = () => (
    <div className="absolute top-2 right-2 flex gap-2 z-20">
      {onEdit && (
        <button
          onClick={() => onEdit(blog.id)}
          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
        >
          Edit
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => onDelete(blog.id)}
          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
        >
          Delete
        </button>
      )}
    </div>
  )

  if (variant === 'featured') {
    return [
      <div key="img" className="md:col-span-2 relative group overflow-hidden">
        <ActionButtons />

        {blog.thumbnail && (
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-[420px] md:h-[480px] object-cover transition duration-500 group-hover:scale-105"
          />
        )}
      </div>,

      <div key="text" className="flex flex-col justify-center px-0 md:px-4 lg:px-8">
        <p className="text-sm text-red-600 font-semibold mb-3 uppercase tracking-widest">
          {blog.category}
        </p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight tracking-tight">
          {blog.title}
        </h2>
        <p className="text-gray-600 leading-relaxed line-clamp-4 text-base">{blog.content}</p>
      </div>,
    ]
  }

  if (variant === 'secondary') {
    return (
      <article className="relative group border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition">
        <ActionButtons />

        <div className="relative overflow-hidden aspect-[16/10]">
          {blog.thumbnail && (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
            />
          )}
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold leading-snug line-clamp-2">{blog.title}</h3>
        </div>
      </article>
    )
  }

  // GRID
  return (
    <article className="relative group border border-gray-200 bg-white overflow-hidden hover:shadow-md transition">
      <ActionButtons />

      <div className="relative overflow-hidden aspect-video">
        {blog.thumbnail && (
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
      </div>

      <div className="p-4">
        <h4 className="font-bold text-sm md:text-base line-clamp-2">{blog.title}</h4>
      </div>
    </article>
  )
}
