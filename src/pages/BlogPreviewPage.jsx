import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BLOG_CATEGORIES } from '../constants/categories'
import { getBlogById, updateBlog } from '../services/blogApi'

export default function BlogPreviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [blog, setBlog] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBlog = async () => {
      setIsLoading(true)
      setError('')

      try {
        const blogData = await getBlogById(id)
        setBlog(blogData)
      } catch (loadError) {
        setError(loadError.message || 'Could not load this blog')
      } finally {
        setIsLoading(false)
      }
    }

    loadBlog()
  }, [id])

  const handleSave = async () => {
    if (!blog?.title?.trim() || !blog?.content?.trim()) {
      window.alert('Title and content are required.')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const payload = {
        ...blog,
        title: blog.title.trim(),
        content: blog.content.trim(),
        thumbnail: (blog.thumbnail || '').trim(),
        updatedAt: new Date().toISOString(),
      }

      const updatedBlog = await updateBlog(id, payload)
      setBlog(updatedBlog)
      setIsEditing(false)
    } catch (saveError) {
      setError(saveError.message || 'Could not save changes')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>
  }

  if (error && !blog) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-16 text-center">
        <p className="text-red-600 mb-6">{error}</p>
        <button onClick={() => navigate('/explore')} className="border px-6 py-3 tracking-widest">
          BACK
        </button>
      </div>
    )
  }

  if (!blog) {
    return <div className="p-10 text-center">Blog not found.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-sm px-12 py-16">
        {error && <p className="text-red-600 mb-6">{error}</p>}

        {isEditing ? (
          <>
            <select
              value={blog.category}
              onChange={(event) => setBlog({ ...blog, category: event.target.value })}
              className="border mb-6 px-4 py-2"
            >
              {BLOG_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              value={blog.title}
              onChange={(event) => setBlog({ ...blog, title: event.target.value })}
              className="w-full text-4xl font-serif font-bold border-b pb-4 mb-8 outline-none"
            />

            <input
              value={blog.thumbnail || ''}
              onChange={(event) => setBlog({ ...blog, thumbnail: event.target.value })}
              placeholder="Thumbnail URL"
              className="w-full border px-4 py-2 mb-6"
            />

            <textarea
              rows={14}
              value={blog.content}
              onChange={(event) => setBlog({ ...blog, content: event.target.value })}
              className="w-full border p-4 leading-relaxed resize-none"
            />

            <div className="flex gap-6 mt-10">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-black text-white px-8 py-3 tracking-widest hover:bg-red-600 transition disabled:opacity-60"
              >
                {isSaving ? 'SAVING...' : 'SAVE'}
              </button>

              <button
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="border px-8 py-3 tracking-widest"
              >
                CANCEL
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-red-600 tracking-widest uppercase text-sm font-semibold mb-6 text-center">
              {blog.category}
            </p>

            <h1 className="text-5xl font-serif font-bold text-center leading-tight mb-8">{blog.title}</h1>

            <p className="text-gray-400 text-center text-sm mb-10">
              Last updated {new Date(blog.updatedAt).toLocaleDateString()}
            </p>

            {blog.thumbnail && (
              <img src={blog.thumbnail} alt={blog.title} className="w-full h-[500px] object-cover mb-12" />
            )}

            <div className="prose max-w-none text-lg leading-relaxed whitespace-pre-line text-gray-800">
              {blog.content}
            </div>

            <div className="flex justify-center gap-6 mt-16">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-black text-white px-8 py-3 tracking-widest hover:bg-red-600 transition"
              >
                EDIT STORY
              </button>

              <button onClick={() => navigate('/explore')} className="border px-8 py-3 tracking-widest">
                BACK
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}