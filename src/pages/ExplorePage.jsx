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

    // 1) Always try static first (bundled with the app — no 404 when deployed). API is in-memory and empty on Vercel.
    fetch('/db.json')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('No static data'))))
      .then((data) => {
        if (data?.blogs?.length) applyBlogs(data)
      })
      .catch(() => {
        // 2) Fallback to API only if static failed (e.g. local dev without public/db.json)
        return fetch('/api/blogs')
          .then((res) => (res.ok ? res.json() : Promise.reject(new Error('API error'))))
          .then(applyBlogs)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const featured = blogs[0]
  const secondary = blogs.slice(1, 4)
  const others = blogs.slice(4)

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center text-black gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
        </div>
        <p className="text-lg text-gray-600 tracking-wide">Loading stories...</p>
      </div>
    )
  }
  if (blogs.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center text-black gap-6 px-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-red-600" />
          <span className="text-2xl font-serif font-bold">No stories yet</span>
          <span className="w-2 h-2 bg-red-600" />
        </div>
        <p className="text-gray-600 max-w-sm text-center">
          Be the first to share an honest story with the world.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 text-black">
      <SiteHeader />

      {/* Page intro */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-2 h-2 bg-red-600" />
            <span className="text-sm text-gray-500 tracking-widest uppercase">Explore</span>
            <span className="w-2 h-2 bg-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-center tracking-tight">
            Stories That Matter
          </h1>
          <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
            Honest journalism and the voices behind the headlines.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Featured story */}
        <section className="mb-16 md:mb-24">
          <div className="grid md:grid-cols-3 gap-6 md:gap-10 bg-white border border-gray-200 shadow-sm overflow-hidden">
            <BlogCard blog={featured} variant="featured" />
          </div>
        </section>

        {/* Latest three */}
        {secondary.length > 0 && (
          <section className="mb-16 md:mb-24">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2 h-2 bg-red-600" />
              <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
                Latest
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {secondary.map((blog) => (
                <BlogCard key={blog.id} blog={blog} variant="secondary" />
              ))}
            </div>
          </section>
        )}

        {/* More stories grid */}
        {others.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2 h-2 bg-red-600" />
              <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
                More stories
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {others.map((blog) => (
                <BlogCard key={blog.id} blog={blog} variant="grid" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
