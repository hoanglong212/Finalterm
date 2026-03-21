import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import { getUser, isBlogOwner } from '../auth'
import { BLOG_CATEGORIES } from '../constants/categories'
import { deleteBlog, getBlogs } from '../services/blogApi'

export default function MyStoriesPage() {
  const navigate = useNavigate()
  const [user] = useState(() => getUser())

  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadMyStories = async () => {
      setLoading(true)
      setError('')

      try {
        const allBlogs = await getBlogs()
        const ownBlogs = allBlogs
          .filter((blog) => isBlogOwner(user, blog))
          .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))

        setBlogs(ownBlogs)
      } catch (loadError) {
        setError(loadError.message || 'Could not load your stories.')
      } finally {
        setLoading(false)
      }
    }

    loadMyStories()
  }, [user])

  const filteredBlogs = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    return blogs.filter((blog) => {
      const categoryOk = categoryFilter === 'all' || blog.category === categoryFilter
      const searchOk =
        !normalizedSearch ||
        blog.title?.toLowerCase().includes(normalizedSearch) ||
        blog.content?.toLowerCase().includes(normalizedSearch)

      return categoryOk && searchOk
    })
  }, [blogs, categoryFilter, searchQuery])

  const stats = useMemo(() => {
    const categoryCount = new Set(blogs.map((blog) => blog.category).filter(Boolean)).size

    return {
      total: blogs.length,
      categories: categoryCount,
    }
  }, [blogs])

  const handleDelete = async (blogId) => {
    const selectedBlog = blogs.find((blog) => String(blog.id) === String(blogId))

    if (!selectedBlog || !isBlogOwner(user, selectedBlog)) {
      window.alert('You can only delete your own stories.')
      return
    }

    if (!window.confirm('Delete this story?')) return

    try {
      await deleteBlog(blogId)
      setBlogs((prev) => prev.filter((blog) => blog.id !== blogId))
    } catch (deleteError) {
      window.alert(deleteError.message || 'Delete failed')
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 text-black">
      <SiteHeader />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">My Stories</h1>
            <p className="text-gray-600 mt-2">Manage your published stories.</p>
          </div>

          <button
            onClick={() => navigate('/write')}
            className="bg-black text-white px-6 py-3 tracking-widest hover:bg-red-600 transition"
          >
            NEW STORY
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="border bg-white p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Total Stories</p>
            <p className="text-3xl font-bold mt-1">{stats.total}</p>
          </div>
          <div className="border bg-white p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Categories</p>
            <p className="text-3xl font-bold mt-1">{stats.categories}</p>
          </div>
        </div>

        <div className="bg-white border p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search title or content"
            className="border px-4 py-2 md:col-span-2"
          />

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="border px-4 py-2"
          >
            <option value="all">All categories</option>
            {BLOG_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="text-gray-600">Loading your stories...</p>}
        {!loading && error && <p className="text-red-600">{error}</p>}

        {!loading && !error && filteredBlogs.length === 0 && (
          <p className="text-gray-600">
            {blogs.length === 0 ? 'You have not published any stories yet.' : 'No stories match your filters.'}
          </p>
        )}

        {!loading && !error && filteredBlogs.length > 0 && (
          <div className="space-y-4">
            {filteredBlogs.map((blog) => (
              <article key={blog.id} className="bg-white border p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-xs tracking-widest uppercase text-red-600">{blog.category}</span>

                    <h2
                      className="text-2xl font-bold cursor-pointer hover:text-red-600 mt-2"
                      onClick={() => navigate(`/blog/${blog.id}`)}
                    >
                      {blog.title}
                    </h2>

                    <p className="text-gray-600 mt-2 line-clamp-2 whitespace-pre-line">{blog.content}</p>
                    <p className="text-xs text-gray-500 mt-3">
                      Updated {new Date(blog.updatedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/edit/${blog.id}`)}
                      className="border px-4 py-2 text-xs tracking-widest hover:bg-gray-100"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="border border-red-400 text-red-600 px-4 py-2 text-xs tracking-widest hover:bg-red-50"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
