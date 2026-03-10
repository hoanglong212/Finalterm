import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PreviewModal from '../components/PreviewModal'
import { BLOG_CATEGORIES } from '../constants/categories'
import { createBlog } from '../services/blogApi'

const inputClass =
  'w-full border-2 border-black px-6 py-5 bg-white text-lg outline-none focus:border-red-600'

const initialForm = {
  title: '',
  category: '',
  thumbnail: '',
  content: '',
}

export default function WriteBlog() {
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!form.title.trim()) newErrors.title = 'Blog title is required'
    if (!form.category) newErrors.category = 'Please select a category'
    if (!form.content.trim()) newErrors.content = 'Content cannot be empty'
    if (form.thumbnail && !form.thumbnail.startsWith('http')) {
      newErrors.thumbnail = 'Thumbnail must be a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field) => (event) => {
    const value = event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (status) => {
    if (isSubmitting || !validateForm()) return

    setIsSubmitting(true)
    try {
      const now = new Date().toISOString()
      const payload = {
        title: form.title.trim(),
        category: form.category,
        thumbnail: form.thumbnail.trim(),
        content: form.content.trim(),
        status,
        createdAt: now,
        updatedAt: now,
      }

      await createBlog(payload)

      if (status === 'published') {
        navigate('/explore')
        return
      }

      window.alert('Draft saved to db.json')
      setForm(initialForm)
      setErrors({})
    } catch (error) {
      window.alert(error.message || 'Could not save blog')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-16 text-black">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-10 text-red-600 hover:text-red-700 tracking-widest font-medium"
        >
          BACK TO HOME
        </button>

        <div className="text-center mb-14">
          <h1 className="text-5xl font-serif font-bold">Write a Story</h1>
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
            value={form.title}
            onChange={handleChange('title')}
            placeholder="Enter your blog title"
            className={inputClass}
          />
          {errors.title && <p className="text-red-600 mt-2">{errors.title}</p>}
        </div>

        <div className="mb-10">
          <label className="block font-semibold mb-3">
            Category <span className="text-red-600">*</span>
          </label>
          <select value={form.category} onChange={handleChange('category')} className={inputClass}>
            <option value="">Select category</option>
            {BLOG_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-600 mt-2">{errors.category}</p>}
        </div>

        <div className="mb-10">
          <label className="block font-semibold mb-3">Thumbnail URL</label>
          <input
            type="text"
            value={form.thumbnail}
            onChange={handleChange('thumbnail')}
            placeholder="https://example.com/image.jpg"
            className={inputClass}
          />
          {errors.thumbnail && <p className="text-red-600 mt-2">{errors.thumbnail}</p>}
          {form.thumbnail && !errors.thumbnail && (
            <img
              src={form.thumbnail}
              alt="Preview"
              className="mt-6 w-full h-96 object-cover border border-gray-300"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          )}
        </div>

        <div className="mb-14">
          <label className="block font-semibold mb-3">
            Content <span className="text-red-600">*</span>
          </label>
          <textarea
            rows={12}
            value={form.content}
            onChange={handleChange('content')}
            placeholder="Write your story here..."
            className={`${inputClass} resize-none`}
          />
          {errors.content && <p className="text-red-600 mt-2">{errors.content}</p>}
        </div>

        <div className="flex gap-6">
          <button
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting}
            className="bg-black text-white px-10 py-4 tracking-widest font-semibold hover:bg-red-600 transition disabled:opacity-60"
          >
            {isSubmitting ? 'SAVING...' : 'PUBLISH'}
          </button>
          <button
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting}
            className="border-2 border-black px-10 py-4 tracking-widest hover:bg-black hover:text-white transition disabled:opacity-60"
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
            title={form.title}
            category={form.category}
            thumbnail={form.thumbnail}
            content={form.content}
          />
        )}
      </div>
    </div>
  )
}