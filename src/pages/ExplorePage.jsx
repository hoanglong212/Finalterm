import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getUser, isBlogOwner } from '../auth'
import BlogCard from '../components/BlogCard'
import SiteHeader from '../components/SiteHeader'
import { deleteBlog, getBlogs } from '../services/blogApi'

export default function ExplorePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [user] = useState(() => getUser())
  const canManage = Boolean(user)

  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all')

  useEffect(() => {
    const nextCategory = searchParams.get('category') || 'all'
    setActiveCategory(nextCategory)
  }, [searchParams])

  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true)
      setError('')

      try {
        const allBlogs = await getBlogs()
        const publishedBlogs = allBlogs.filter((blog) => blog.status === 'published')
        setBlogs(publishedBlogs)
      } catch (fetchError) {
        setError(fetchError.message || 'Could not load stories')
      } finally {
        setLoading(false)
      }
    }

    loadBlogs()
  }, [])

  const categories = useMemo(() => {
    const items = [...new Set(blogs.map((blog) => blog.category).filter(Boolean))].sort()

    if (activeCategory !== 'all' && !items.includes(activeCategory)) {
      items.unshift(activeCategory)
    }

    return ['all', ...items]
  }, [blogs, activeCategory])

  const filteredBlogs = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()

    const visible = blogs.filter((blog) => {
      const categoryPass = activeCategory === 'all' || blog.category === activeCategory
      if (!categoryPass) return false

      if (!keyword) return true

      const title = blog.title?.toLowerCase() || ''
      const content = blog.content?.toLowerCase() || ''
      return title.includes(keyword) || content.includes(keyword)
    })

    const sorted = [...visible]
    if (sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (sortBy === 'title') {
      sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    } else {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return sorted
  }, [blogs, activeCategory, searchTerm, sortBy])

  const canManageBlog = (blog) => isBlogOwner(user, blog)

  const handleDelete = async (id) => {
    const selectedBlog = blogs.find((blog) => String(blog.id) === String(id))

    if (!canManage) {
      navigate('/login')
      return
    }

    if (!selectedBlog || !canManageBlog(selectedBlog)) {
      window.alert('You can only delete your own stories.')
      return
    }

    if (!window.confirm('Are you sure you want to delete this blog?')) return

    try {
      await deleteBlog(id)
      setBlogs((prev) => prev.filter((blog) => blog.id !== id))
    } catch (deleteError) {
      window.alert(deleteError.message || 'Delete failed')
    }
  }

  const handleEdit = (id) => {
    const selectedBlog = blogs.find((blog) => String(blog.id) === String(id))

    if (!canManage) {
      navigate('/login')
      return
    }

    if (!selectedBlog || !canManageBlog(selectedBlog)) {
      window.alert('You can only edit your own stories.')
      return
    }

    navigate(`/edit/${id}`)
  }

  const handleOpen = (id) => {
    navigate(`/blog/${id}`)
  }

  const applyCategory = (category) => {
    setActiveCategory(category)

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (category === 'all') {
        next.delete('category')
      } else {
        next.set('category', category)
      }
      return next
    })
  }

  const featured = filteredBlogs[0]
  const secondary = filteredBlogs.slice(1, 3)
  const others = filteredBlogs.slice(3)

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-black">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-6 pb-14 pt-10">
        <section className="mb-8 border-b border-black/10 pb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-red-600">Explore Blog</p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Latest Stories and Insights</h1>
          <p className="mt-3 max-w-3xl text-gray-600">
            Discover featured writing, explore by category, and open any story to read full details.
          </p>
        </section>

        <section className="mb-8 rounded-xl border border-black/10 bg-white p-4 md:p-5">
          <div className="grid gap-3 md:grid-cols-4">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search title or content"
              className="md:col-span-2 rounded-lg border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-red-400"
            />

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-lg border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-red-400"
            >
              <option value="latest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm('')
                setSortBy('latest')
                applyCategory('all')
              }}
              className="rounded-lg border border-black/20 px-4 py-2.5 text-sm font-semibold tracking-wide transition hover:bg-black hover:text-white"
            >
              Reset Filters
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => {
              const active = category === activeCategory
              return (
                <button
                  key={category}
                  onClick={() => applyCategory(category)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                    active
                      ? 'bg-black text-white'
                      : 'border border-black/15 bg-white text-gray-700 hover:border-black hover:text-black'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </section>

        <div className="mb-6 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing <strong className="text-black">{filteredBlogs.length}</strong> published stories
          </span>
          {activeCategory !== 'all' && (
            <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs uppercase tracking-[0.14em] text-red-700">
              {activeCategory}
            </span>
          )}
        </div>

        {loading && (
          <div className="rounded-xl border border-black/10 bg-white px-6 py-16 text-center text-gray-600">
            Loading stories...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-14 text-center text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && filteredBlogs.length === 0 && (
          <div className="rounded-xl border border-black/10 bg-white px-6 py-14 text-center">
            <p className="text-lg font-semibold">No stories found</p>
            <p className="mt-2 text-gray-600">Try another keyword or reset your filters.</p>
          </div>
        )}

        {!loading && !error && filteredBlogs.length > 0 && (
          <>
            {featured && (
              <section className="mb-10">
                <BlogCard
                  blog={featured}
                  variant="featured"
                  onOpen={handleOpen}
                  onEdit={canManageBlog(featured) ? handleEdit : undefined}
                  onDelete={canManageBlog(featured) ? handleDelete : undefined}
                />
              </section>
            )}

            {secondary.length > 0 && (
              <section className="mb-10 grid gap-6 md:grid-cols-2">
                {secondary.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    variant="secondary"
                    onOpen={handleOpen}
                    onEdit={canManageBlog(blog) ? handleEdit : undefined}
                    onDelete={canManageBlog(blog) ? handleDelete : undefined}
                  />
                ))}
              </section>
            )}

            {others.length > 0 && (
              <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {others.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    variant="grid"
                    onOpen={handleOpen}
                    onEdit={canManageBlog(blog) ? handleEdit : undefined}
                    onDelete={canManageBlog(blog) ? handleDelete : undefined}
                  />
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
