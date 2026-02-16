import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBlog } from '../Blogaction'
import PreviewModal from '../components/PreviewModal'
import { BLOG_CATEGORIES } from '../constants/categories'
import { logout } from '../auth'

const inputClass =
  'w-full border-2 border-black px-6 py-5 bg-white text-lg outline-none focus:border-red-600'

export default function WriteBlog() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState({})
  const [showPreview, setShowPreview] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!title.trim()) newErrors.title = 'Blog title is required'
    if (!category) newErrors.category = 'Please select a category'
    if (!content.trim()) newErrors.content = 'Content cannot be empty'
    if (thumbnail && !thumbnail.startsWith('http')) {
      newErrors.thumbnail = 'Thumbnail must be a valid URL'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (status) => {
    if (!validateForm()) return
    const blog = {
      title,
      category,
      thumbnail,
      content,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const success = await createBlog(blog, status === 'published')
    if (success && status === 'published') {
      navigate('/explore')
      return
    }
    setTitle('')
    setCategory('')
    setThumbnail('')
    setContent('')
    setErrors({})
  }

  const handleChange = (setter, field) => (e) => {
    setter(e.target.value)
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-16 text-black">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => {
            navigate('/')
          }}
          className="mb-10 text-red-600 hover:text-red-700 tracking-widest font-medium"
        >
          ← BACK TO HOME
        </button>

        <div className="text-center mb-14">
          <h1 className="text-5xl font-serif font-bold flex items-center justify-center gap-3">
            ✏ Write a Story
          </h1>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Share your honest story with the world. Fill out the form below to submit your article
            for publication.
          </p>
          <div className="border-b border-gray-400 mt-8" />
        </div>

        <div className="mb-10">
          <label className="block font-semibold mb-3">
            Article Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={handleChange(setTitle, 'title')}
            placeholder="Enter your blog title"
            className={inputClass}
          />
          {errors.title && <p className="text-red-600 mt-2">{errors.title}</p>}
        </div>

        <div className="mb-10">
          <label className="block font-semibold mb-3">
            Category <span className="text-red-600">*</span>
          </label>
          <select
            value={category}
            onChange={handleChange(setCategory, 'category')}
            className={inputClass}
          >
            <option value="">Select category</option>
            {BLOG_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-600 mt-2">{errors.category}</p>}
        </div>

        <div className="mb-10">
          <label className="block font-semibold mb-3">Thumbnail URL</label>
          <input
            type="text"
            value={thumbnail}
            onChange={handleChange(setThumbnail, 'thumbnail')}
            placeholder="https://example.com/image.jpg"
            className={inputClass}
          />
          {errors.thumbnail && <p className="text-red-600 mt-2">{errors.thumbnail}</p>}
          {thumbnail && !errors.thumbnail && (
            <img
              src={thumbnail}
              alt="Preview"
              className="mt-6 w-full h-96 object-cover border border-gray-300"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          )}
        </div>

        <div className="mb-14">
          <label className="block font-semibold mb-3">
            Content <span className="text-red-600">*</span>
          </label>
          <textarea
            rows={12}
            value={content}
            onChange={handleChange(setContent, 'content')}
            placeholder="Write your story here..."
            className={`${inputClass} resize-none`}
          />
          {errors.content && <p className="text-red-600 mt-2">{errors.content}</p>}
        </div>

        <div className="flex gap-6">
          <button
            onClick={() => handleSubmit('published')}
            className="bg-black text-white px-10 py-4 tracking-widest font-semibold hover:bg-red-600 transition"
          >
            PUBLISH
          </button>
          <button
            onClick={() => handleSubmit('draft')}
            className="border-2 border-black px-10 py-4 tracking-widest hover:bg-black hover:text-white transition"
          >
            SAVE DRAFT
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="border border-gray-500 px-10 py-4 tracking-widest hover:border-black transition"
          >
            PREVIEW
          </button>
        </div>

        {showPreview && (
          <PreviewModal
            onClose={() => setShowPreview(false)}
            title={title}
            category={category}
            thumbnail={thumbnail}
            content={content}
          />
        )}
      </div>
    </div>
  )
}
