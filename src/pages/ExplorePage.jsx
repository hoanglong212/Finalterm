import { useEffect, useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import BlogCard from '../components/BlogCard'
import { useNavigate } from 'react-router-dom'

export default function ExplorePage() {
  const navigate = useNavigate()

  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  // DELETE BLOG
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return

    try {
      await fetch(`${import.meta.env.VITE_API_ENDPOINT}/blogs/${id}`, {
        method: 'DELETE',
      })

      // update UI without reload
      setBlogs((prev) => prev.filter((b) => b.id !== id))
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  // EDIT BLOG
  const handleEdit = (id) => {
    navigate(`/preview/${id}`)
  }

  // FETCH BLOGS FROM JSON SERVER
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_ENDPOINT}/blogs`)
      .then((res) => res.json())
      .then((data) => {
        const published = data.filter((b) => b.status === 'published')
        const sorted = [...published].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setBlogs(sorted)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const featured = blogs[0]
  const secondary = blogs.slice(1, 4)
  const others = blogs.slice(4)

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading stories...</p>
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

  return (
    <div className="min-h-screen bg-stone-50 text-black">
      <SiteHeader />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Featured */}
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

        {/* Secondary */}
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

        {/* Others */}
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
