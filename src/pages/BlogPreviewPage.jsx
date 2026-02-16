import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

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

  if (!blog) return <div className="p-10">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white p-10 shadow">
        {/* 🔥 EDIT MODE */}
        {isEditing ? (
          <>
            <input
              value={blog.title}
              onChange={(e) => setBlog({ ...blog, title: e.target.value })}
              className="w-full border p-3 text-2xl font-bold mb-6"
            />

            <textarea
              rows={10}
              value={blog.content}
              onChange={(e) => setBlog({ ...blog, content: e.target.value })}
              className="w-full border p-3 mb-6"
            />

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="bg-black text-white px-6 py-2 hover:bg-red-600"
              >
                Save Changes
              </button>

              <button onClick={() => setIsEditing(false)} className="border px-6 py-2">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {/* 🔥 PREVIEW MODE */}
            <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>

            {blog.thumbnail && (
              <img src={blog.thumbnail} alt="" className="w-full h-96 object-cover mb-6" />
            )}

            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{blog.content}</p>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-black text-white px-6 py-2 hover:bg-red-600"
              >
                Edit
              </button>

              <button onClick={() => navigate('/explore')} className="border px-6 py-2">
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
