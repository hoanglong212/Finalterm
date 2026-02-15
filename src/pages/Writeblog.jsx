import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBlog } from '../Blogaction'

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

    if (!title.trim()) {
      newErrors.title = 'Blog title is required'
    }

    if (!category) {
      newErrors.category = 'Please select a category'
    }

    if (!content.trim()) {
      newErrors.content = 'Content cannot be empty'
    }

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

    // Reset form
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
        {/* Back */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/')}
            className="mb-10 text-red-600 hover:text-red-700 tracking-widest font-medium"
          >
            ← BACK TO HOME
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-serif font-bold flex items-center justify-center gap-3">
            ✏ Write a Story
          </h1>

          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Share your honest story with the world. Fill out the form below to submit your article
            for publication.
          </p>

          <div className="border-b border-gray-400 mt-8"></div>
        </div>

        {/* Title */}
        <div className="mb-10">
          <label className="block font-semibold mb-3">
            Article Title <span className="text-red-600">*</span>
          </label>

          <input
            type="text"
            value={title}
            onChange={handleChange(setTitle, 'title')}
            placeholder="Enter your blog title"
            className="w-full border-2 border-black px-6 py-5 bg-white text-lg outline-none focus:border-red-600"
          />

          {errors.title && <p className="text-red-600 mt-2">{errors.title}</p>}
        </div>

        {/* Category */}
        <div className="mb-10">
          <label className="block font-semibold mb-3">
            Category <span className="text-red-600">*</span>
          </label>

          <select
            value={category}
            onChange={handleChange(setCategory, 'category')}
            className="w-full border-2 border-black px-6 py-5 bg-white text-lg outline-none focus:border-red-600"
          >
            <option value="">Select category</option>
            <option value="News">News</option>
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
            <option value="Sport">Sport</option>
            <option value="Health">Health</option>
          </select>

          {errors.category && <p className="text-red-600 mt-2">{errors.category}</p>}
        </div>

        {/* Thumbnail */}
        <div className="mb-10">
          <label className="block font-semibold mb-3">Thumbnail URL</label>

          <input
            type="text"
            value={thumbnail}
            onChange={handleChange(setThumbnail, 'thumbnail')}
            placeholder="https://example.com/image.jpg"
            className="w-full border-2 border-black px-6 py-5 bg-white text-lg outline-none focus:border-red-600"
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

        {/* Content */}
        <div className="mb-14">
          <label className="block font-semibold mb-3">
            Content <span className="text-red-600">*</span>
          </label>

          <textarea
            rows={12}
            value={content}
            onChange={handleChange(setContent, 'content')}
            placeholder="Write your story here..."
            className="w-full border-2 border-black px-6 py-5 bg-white text-lg outline-none resize-none focus:border-red-600"
          />

          {errors.content && <p className="text-red-600 mt-2">{errors.content}</p>}
        </div>

        {/* Buttons */}
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

        {/* Preview modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-6">
            <div className="bg-white text-black max-w-3xl w-full max-h-[90vh] overflow-y-auto p-10 relative">
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-5 right-5 text-gray-500 hover:text-black"
              >
                ✕
              </button>

              {thumbnail && (
                <img src={thumbnail} alt="Preview" className="w-full h-72 object-cover mb-6" />
              )}

              {category && <p className="text-sm text-red-600 font-semibold mb-2">{category}</p>}

              <h1 className="text-4xl font-serif font-bold mb-4">{title || 'Untitled Blog'}</h1>

              <p className="text-sm text-gray-500 mb-6">
                Preview mode • {new Date().toLocaleDateString()}
              </p>

              <p className="whitespace-pre-line leading-relaxed text-gray-800">
                {content || 'No content yet...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
