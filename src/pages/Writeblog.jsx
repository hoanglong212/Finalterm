import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUser, isBlogOwner } from '../auth'
import PreviewModal from '../components/PreviewModal'
import { BLOG_CATEGORIES } from '../constants/categories'
import { createBlog, getBlogById, updateBlog } from '../services/blogApi'
import { toEditableBlog, validateBlogDraft } from '../utils/blogForm'

const inputClass =
  'w-full border-2 border-black px-6 py-5 bg-white text-lg outline-none focus:border-red-600'

const initialForm = toEditableBlog()

export default function WriteBlog() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [user] = useState(() => getUser())
  const isEditMode = Boolean(id)

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [pageError, setPageError] = useState('')
  const [originalBlog, setOriginalBlog] = useState(null)
  const [thumbnailPreviewFailed, setThumbnailPreviewFailed] = useState(false)

  useEffect(() => {
    if (!isEditMode) return

    const loadBlogForEdit = async () => {
      setIsLoading(true)
      setPageError('')

      try {
        const existingBlog = await getBlogById(id)
        if (!isBlogOwner(user, existingBlog)) {
          setOriginalBlog(null)
          setPageError('You can only edit your own stories.')
          return
        }

        setOriginalBlog(existingBlog)
        setForm(toEditableBlog(existingBlog))
        setThumbnailPreviewFailed(false)
      } catch (error) {
        setPageError(error.message || 'Could not load this story.')
      } finally {
        setIsLoading(false)
      }
    }

    loadBlogForEdit()
  }, [id, isEditMode, user])

  const validateForm = () => {
    const validation = validateBlogDraft(form)
    setErrors(validation.errors)
    return validation
  }

  const handleChange = (field) => (event) => {
    const value = event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    if (field === 'thumbnail') {
      setThumbnailPreviewFailed(false)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (isEditMode && (!originalBlog || !isBlogOwner(user, originalBlog))) {
      setPageError('You can only edit your own stories.')
      return
    }

    const validation = validateForm()
    if (isSubmitting || !validation.isValid) return

    setIsSubmitting(true)
    setPageError('')

    try {
      const now = new Date().toISOString()
      const payload = {
        ...validation.values,
        status: 'published',
        authorId: user.id,
        authorName: user.name || user.email,
        authorEmail: user.email,
        updatedAt: now,
      }

      let savedBlog

      if (isEditMode) {
        savedBlog = await updateBlog(id, {
          ...originalBlog,
          ...payload,
        })
      } else {
        savedBlog = await createBlog({
          ...payload,
          createdAt: now,
          updatedAt: now,
        })
      }

      navigate(`/blog/${savedBlog.id}`)
    } catch (error) {
      setPageError(error.message || 'Could not save blog')
    } finally {
      setIsSubmitting(false)
    }
  }

  const shouldShowThumbnailPreview =
    Boolean(form.thumbnail.trim()) && !errors.thumbnail && !thumbnailPreviewFailed

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-16 text-black">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(isEditMode ? '/my-stories' : '/')}
          className="mb-10 text-red-600 hover:text-red-700 tracking-widest font-medium"
        >
          {isEditMode ? 'BACK TO MY STORIES' : 'BACK TO HOME'}
        </button>

        <div className="text-center mb-14">
          <h1 className="text-5xl font-serif font-bold">{isEditMode ? 'Edit Story' : 'Write a Story'}</h1>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            {isEditMode
              ? 'Update your article and publish the newest version.'
              : 'Share your honest story with the world.'}
          </p>
          <div className="border-b border-gray-400 mt-8" />
        </div>

        {isLoading && <p className="text-gray-600 mb-8">Loading story...</p>}
        {pageError && <p className="text-red-600 mb-8">{pageError}</p>}

        {!isLoading && !pageError && (
          <>
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
              {shouldShowThumbnailPreview && (
                <img
                  src={form.thumbnail.trim()}
                  alt="Preview"
                  className="mt-6 w-full h-96 object-cover border border-gray-300"
                  onError={() => setThumbnailPreviewFailed(true)}
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

            <div className="flex flex-wrap gap-6">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-black text-white px-10 py-4 tracking-widest font-semibold hover:bg-red-600 transition disabled:opacity-60"
              >
                {isSubmitting ? 'SAVING...' : isEditMode ? 'UPDATE STORY' : 'PUBLISH'}
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className="border border-gray-500 px-10 py-4 tracking-widest hover:border-black transition"
              >
                PREVIEW
              </button>
            </div>
          </>
        )}

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
