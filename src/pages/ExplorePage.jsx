import { useEffect, useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import BlogCard from '../components/BlogCard'

export default function ExplorePage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const applyBlogs = (data) => {
      if (data?.blogs?.length) {
        const published = data.blogs.filter((b) => b.status === 'published')
        const sorted = [...published].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        setBlogs(sorted)
      }
    }

    fetch('/api/blogs')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('API error'))))
      .then(applyBlogs)
      .catch(() => fetch('/db.json').then((res) => res.json()))
      .then(applyBlogs)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const featured = blogs[0]
  const secondary = blogs.slice(1, 4)
  const others = blogs.slice(4)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-black">
        <p className="text-lg">Loading stories...</p>
      </div>
    )
  }
  if (blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-black">
        <p className="text-lg">No blogs yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen text-black">
      <SiteHeader />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8 border-b border-black pb-10">
          <BlogCard blog={featured} variant="featured" />
        </div>
        <div className="grid md:grid-cols-3 gap-8 py-10 border-b border-black">
          {secondary.map((blog) => (
            <BlogCard key={blog.id} blog={blog} variant="secondary" />
          ))}
        </div>
        <div className="grid md:grid-cols-4 gap-8 py-10">
          {others.map((blog) => (
            <BlogCard key={blog.id} blog={blog} variant="grid" />
          ))}
        </div>
      </div>
    </div>
  )
}
