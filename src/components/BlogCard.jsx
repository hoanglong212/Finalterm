/**
 * @param {{ blog: { id: string, title: string, category: string, thumbnail?: string, content?: string }, variant: 'featured' | 'secondary' | 'grid' }}
 */
export default function BlogCard({ blog, variant = 'grid' }) {
  if (variant === 'featured') {
    return [
      <div key="img" className="md:col-span-2">
        {blog.thumbnail && (
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-[450px] object-cover"
          />
        )}
      </div>,
      <div key="text" className="flex flex-col justify-center">
        <p className="text-sm text-red-600 font-semibold mb-2 uppercase">{blog.category}</p>
        <h2 className="text-3xl font-bold mb-4 leading-snug">{blog.title}</h2>
        <p className="text-gray-600 line-clamp-4">{blog.content}</p>
      </div>,
    ]
  }

  if (variant === 'secondary') {
    return (
      <div>
        {blog.thumbnail && (
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-60 object-cover mb-4"
          />
        )}
        <p className="text-xs text-red-600 font-semibold uppercase mb-2">{blog.category}</p>
        <h3 className="text-xl font-bold leading-snug">{blog.title}</h3>
      </div>
    )
  }

  // grid
  return (
    <div>
      {blog.thumbnail && (
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="w-full h-48 object-cover mb-3"
        />
      )}
      <p className="text-xs text-red-600 font-semibold uppercase mb-1">{blog.category}</p>
      <h4 className="font-bold leading-snug">{blog.title}</h4>
    </div>
  )
}
