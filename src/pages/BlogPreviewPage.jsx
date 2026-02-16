import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BLOG_CATEGORIES } from '../constants/categories'

export default function BlogPreviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [blog, setBlog] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_ENDPOINT}/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => setBlog(data))
  }, [id])

  const handleSave = async () => {
    await fetch(`${import.meta.env.VITE_API_ENDPOINT}/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...blog,
        updatedAt: new Date().toISOString(),
      }),
    })

    setIsEditing(false)
  }

  if (!blog) return <div className="p-10 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-sm px-12 py-16">
        {/* 🔴 EDIT MODE */}
        {isEditing ? (
          <>
            {/* CATEGORY */}
            <select
              value={blog.category}
              onChange={(e) => setBlog({ ...blog, category: e.target.value })}
              className="border mb-6 px-4 py-2"
            >
              {BLOG_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* TITLE */}
            <input
              value={blog.title}
              onChange={(e) => setBlog({ ...blog, title: e.target.value })}
              className="w-full text-4xl font-serif font-bold border-b pb-4 mb-8 outline-none"
            />

            {/* THUMBNAIL */}
            <input
              value={blog.thumbnail || ''}
              onChange={(e) => setBlog({ ...blog, thumbnail: e.target.value })}
              placeholder="Thumbnail URL"
              className="w-full border px-4 py-2 mb-6"
            />

            {/* CONTENT */}
            <textarea
              rows={14}
              value={blog.content}
              onChange={(e) => setBlog({ ...blog, content: e.target.value })}
              className="w-full border p-4 leading-relaxed resize-none"
            />

            <div className="flex gap-6 mt-10">
              <button
                onClick={handleSave}
                className="bg-black text-white px-8 py-3 tracking-widest hover:bg-red-600 transition"
              >
                SAVE
              </button>

              <button
                onClick={() => setIsEditing(false)}
                className="border px-8 py-3 tracking-widest"
              >
                CANCEL
              </button>
            </div>
          </>
        ) : (
          <>
            {/* 📰 PREVIEW MODE */}

            {/* CATEGORY */}
            <p className="text-red-600 tracking-widest uppercase text-sm font-semibold mb-6 text-center">
              {blog.category}
            </p>

            {/* TITLE */}
            <h1 className="text-5xl font-serif font-bold text-center leading-tight mb-8">
              {blog.title}
            </h1>

            {/* META */}
            <p className="text-gray-400 text-center text-sm mb-10">
              Last updated {new Date(blog.updatedAt).toLocaleDateString()}
            </p>

            {/* IMAGE */}
            {blog.thumbnail && (
              <img src={blog.thumbnail} alt="" className="w-full h-[500px] object-cover mb-12" />
            )}

            {/* CONTENT */}
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

              <button
                onClick={() => navigate('/explore')}
                className="border px-8 py-3 tracking-widest"
              >
                BACK
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
