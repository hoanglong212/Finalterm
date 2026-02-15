/**
 * @param {{ blog: { id: string, title: string, category: string, thumbnail?: string, content?: string }, variant: 'featured' | 'secondary' | 'grid' }}
 */
export default function BlogCard({ blog, variant = 'grid' }) {
  if (variant === 'featured') {
    return [
      <div key="img" className="md:col-span-2 relative group overflow-hidden">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-600" />
          <span className="text-xs font-semibold tracking-widest uppercase text-white drop-shadow-md bg-black/40 px-3 py-1">
            Featured
          </span>
        </div>
        {blog.thumbnail && (
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-[420px] md:h-[480px] object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      </div>,
      <div key="text" className="flex flex-col justify-center px-0 md:px-4 lg:px-8">
        <p className="text-sm text-red-600 font-semibold mb-3 uppercase tracking-widest">
          {blog.category}
        </p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight tracking-tight">
          {blog.title}
        </h2>
        <p className="text-gray-600 leading-relaxed line-clamp-4 text-base">
          {blog.content}
        </p>
        <div className="mt-6 flex items-center gap-2">
          <span className="w-8 h-px bg-red-600" />
          <span className="text-xs text-gray-500 uppercase tracking-wider">Read story</span>
        </div>
      </div>,
    ]
  }

  if (variant === 'secondary') {
    return (
      <article className="group group/card border border-gray-200 bg-white overflow-hidden transition duration-300 hover:border-red-600/50 hover:shadow-lg">
        <div className="relative overflow-hidden aspect-[16/10]">
          {blog.thumbnail && (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-full object-cover transition duration-500 group-hover/card:scale-105"
            />
          )}
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-red-600 bg-white/95 px-2 py-1">
              {blog.category}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold leading-snug group-hover/card:text-red-600 transition-colors line-clamp-2">
            {blog.title}
          </h3>
        </div>
      </article>
    )
  }

  // grid
  return (
    <article className="group group/card border border-gray-200 bg-white overflow-hidden transition duration-300 hover:border-red-600/50 hover:shadow-md">
      <div className="relative overflow-hidden aspect-video">
        {blog.thumbnail && (
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-full object-cover transition duration-500 group-hover/card:scale-105"
          />
        )}
        <div className="absolute top-2 left-2">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-red-600 bg-white/95 px-2 py-0.5">
            {blog.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold leading-snug text-sm md:text-base group-hover/card:text-red-600 transition-colors line-clamp-2">
          {blog.title}
        </h4>
      </div>
    </article>
  )
}
