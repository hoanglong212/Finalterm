import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BlogCard from '../components/BlogCard'
import SiteHeader from '../components/SiteHeader'
import { deleteBlog, getBlogs } from '../services/blogApi'

export default function ExplorePage() {
  const navigate = useNavigate()

  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const allBlogs = await getBlogs()
        const publishedBlogs = allBlogs.filter((blog) => blog.status === 'published')
        const sortedBlogs = [...publishedBlogs].sort(
          (left, right) => new Date(right.createdAt) - new Date(left.createdAt)
        )
        setBlogs(sortedBlogs)
      } catch (fetchError) {
        setError(fetchError.message || 'Could not load stories')
      } finally {
        setLoading(false)
      }
    }

    loadBlogs()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return

    try {
      await deleteBlog(id)
      setBlogs((prev) => prev.filter((blog) => blog.id !== id))
    } catch (deleteError) {
      window.alert(deleteError.message || 'Delete failed')
    }
  }

  const handleEdit = (id) => {
    navigate(`/preview/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading stories...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
        <p className="text-red-600 text-lg text-center">{error}</p>
      </div>
    )
  }

  if (blogs.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">No stories yet.</p>
      </div>
    )
  }

  const featured = blogs[0]
  const secondary = blogs.slice(1, 4)
  const others = blogs.slice(4)

  return (
    <div className="min-h-screen bg-stone-50 text-black">
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {featured && (
          <section className="mb-16">
            <BlogCard
              blog={featured}
              variant="featured"
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </section>
        )}

        {secondary.length > 0 && (
          <section className="mb-16 grid md:grid-cols-3 gap-6">
            {secondary.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                variant="secondary"
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </section>
        )}

        {others.length > 0 && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {others.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                variant="grid"
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  )
}