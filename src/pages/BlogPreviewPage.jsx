import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUser, isBlogOwner } from '../auth'
import SiteHeader from '../components/SiteHeader'
import { BLOG_CATEGORIES } from '../constants/categories'
import { deleteBlog, getBlogById, updateBlog } from '../services/blogApi'
import { toEditableBlog, validateBlogDraft } from '../utils/blogForm'

function formatDate(value) {
  if (!value) return 'Unknown date'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Unknown date'
  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function estimateReadMinutes(text) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return { words, minutes }
}

function contentParagraphs(text) {
  return (text || '')
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
}

export default function BlogPreviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user] = useState(() => getUser())

  const [blog, setBlog] = useState(null)
  const [draftBlog, setDraftBlog] = useState(null)
  const [editErrors, setEditErrors] = useState({})
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
        setDraftBlog(null)
        setEditErrors({})
        setIsEditing(false)
      } catch (loadError) {
        setError(loadError.message || 'Could not load this blog')
      } finally {
        setIsLoading(false)
      }
    }

    loadBlog()
  }, [id])

  const isOwner = isBlogOwner(user, blog)

  const readingStats = useMemo(() => estimateReadMinutes(blog?.content || ''), [blog?.content])
  const paragraphs = useMemo(() => contentParagraphs(blog?.content || ''), [blog?.content])

  const handleDraftChange = (field) => (event) => {
    const value = event.target.value

    setDraftBlog((prev) => ({
      ...(prev || toEditableBlog(blog)),
      [field]: value,
    }))
    setEditErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleStartEditing = () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!isOwner) {
      setError('You can only edit your own stories.')
      return
    }

    setDraftBlog(toEditableBlog(blog))
    setEditErrors({})
    setError('')
    setIsEditing(true)
  }

  const handleCancelEditing = () => {
    setDraftBlog(null)
    setEditErrors({})
    setError('')
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!isOwner) {
      setError('You can only edit your own stories.')
      return
    }

    const validation = validateBlogDraft(draftBlog)
    setEditErrors(validation.errors)
    if (!validation.isValid) return

    setIsSaving(true)
    setError('')

    try {
      const payload = {
        ...blog,
        ...validation.values,
        updatedAt: new Date().toISOString(),
      }

      const updatedBlog = await updateBlog(id, payload)
      setBlog(updatedBlog)
      setDraftBlog(null)
      setEditErrors({})
      setIsEditing(false)
    } catch (saveError) {
      setError(saveError.message || 'Could not save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!isOwner) {
      setError('You can only delete your own stories.')
      return
    }

    if (!window.confirm('Delete this story?')) return

    try {
      await deleteBlog(id)
      navigate('/explore')
    } catch (deleteError) {
      setError(deleteError.message || 'Could not delete story')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100">
        <SiteHeader />
        <div className="px-6 py-20 text-center text-gray-600">Loading article...</div>
      </div>
    )
  }

  if (error && !blog) {
    return (
      <div className="min-h-screen bg-stone-100">
        <SiteHeader />
        <div className="px-6 py-20 text-center">
          <p className="mb-6 text-red-600">{error}</p>
          <button onClick={() => navigate('/explore')} className="border px-6 py-3 tracking-widest">
            BACK
          </button>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-stone-100">
        <SiteHeader />
        <div className="px-6 py-20 text-center">Blog not found.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f6f1ea,#ede7df_45%,#f7f4ee)] text-black">
      <SiteHeader />

      <main className="px-4 py-10 md:px-8 md:py-14">
        <article className="mx-auto max-w-5xl border border-black/10 bg-white shadow-[0_14px_44px_rgba(0,0,0,0.08)]">
          {error && <p className="px-8 pt-6 text-red-600">{error}</p>}

          {isEditing ? (
            <div className="px-6 py-8 md:px-12 md:py-10">
              <select
                value={draftBlog?.category || ''}
                onChange={handleDraftChange('category')}
                className="mb-6 border px-4 py-2"
              >
                {BLOG_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {editErrors.category && <p className="mb-4 text-red-600">{editErrors.category}</p>}

              <input
                value={draftBlog?.title || ''}
                onChange={handleDraftChange('title')}
                className="mb-8 w-full border-b pb-4 text-4xl font-serif font-bold outline-none"
              />
              {editErrors.title && <p className="-mt-4 mb-6 text-red-600">{editErrors.title}</p>}

              <input
                value={draftBlog?.thumbnail || ''}
                onChange={handleDraftChange('thumbnail')}
                placeholder="Thumbnail URL"
                className="mb-6 w-full border px-4 py-2"
              />
              {editErrors.thumbnail && <p className="-mt-4 mb-6 text-red-600">{editErrors.thumbnail}</p>}

              <textarea
                rows={14}
                value={draftBlog?.content || ''}
                onChange={handleDraftChange('content')}
                className="w-full border p-4 leading-relaxed resize-none"
              />
              {editErrors.content && <p className="mt-3 text-red-600">{editErrors.content}</p>}

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-black px-8 py-3 tracking-widest text-white transition hover:bg-red-600 disabled:opacity-60"
                >
                  {isSaving ? 'SAVING...' : 'SAVE'}
                </button>

                <button
                  onClick={handleCancelEditing}
                  disabled={isSaving}
                  className="border px-8 py-3 tracking-widest"
                >
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <>
              <header className="border-b border-black/10 px-6 pb-8 pt-10 text-center md:px-14 md:pt-14">
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-600">
                  {blog.category}
                </p>

                <h1 className="mx-auto mb-6 max-w-4xl text-3xl font-bold leading-tight md:text-5xl">
                  {blog.title}
                </h1>

                <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.14em] text-gray-500">
                  <span>{blog.authorName || blog.authorEmail || 'Anonymous author'}</span>
                  <span className="text-gray-300">|</span>
                  <span>{formatDate(blog.updatedAt)}</span>
                  <span className="text-gray-300">|</span>
                  <span>{readingStats.minutes} min read</span>
                  <span className="text-gray-300">|</span>
                  <span>{readingStats.words} words</span>
                </div>
              </header>

              {blog.thumbnail && (
                <div className="border-b border-black/10 bg-stone-100 px-4 py-5 md:px-8 md:py-8">
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="mx-auto h-[240px] w-full max-w-4xl object-cover md:h-[440px]"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                </div>
              )}

              <section className="mx-auto max-w-3xl px-6 py-10 md:px-12 md:py-12">
                {paragraphs.length > 0 ? (
                  paragraphs.map((paragraph, index) => (
                    <p
                      key={`${index}-${paragraph.slice(0, 18)}`}
                      className={`mb-6 text-[1.08rem] leading-8 text-gray-800 ${
                        index === 0
                          ? 'first-letter:float-left first-letter:mr-2 first-letter:pt-1 first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8]'
                          : ''
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-[1.08rem] leading-8 text-gray-800">No content available.</p>
                )}

                <div className="mt-10 border-t border-black/10 pt-6">
                  <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Written by</p>
                  <p className="mt-2 text-lg font-semibold text-black">
                    {blog.authorName || blog.authorEmail || 'Anonymous author'}
                  </p>
                </div>
              </section>

              <footer className="border-t border-black/10 bg-stone-50 px-6 py-6 md:px-12">
                <div className="flex flex-wrap justify-center gap-4">
                  {isOwner && (
                    <>
                      <button
                        onClick={() => navigate(`/edit/${blog.id}`)}
                        className="bg-black px-8 py-3 tracking-widest text-white transition hover:bg-red-600"
                      >
                        EDIT IN WRITER
                      </button>
                      <button onClick={handleStartEditing} className="border px-8 py-3 tracking-widest">
                        QUICK EDIT
                      </button>
                      <button
                        onClick={handleDelete}
                        className="border border-red-400 px-8 py-3 tracking-widest text-red-600"
                      >
                        DELETE
                      </button>
                    </>
                  )}

                  <button onClick={() => navigate('/explore')} className="border px-8 py-3 tracking-widest">
                    BACK
                  </button>
                </div>
              </footer>
            </>
          )}
        </article>
      </main>
    </div>
  )
}
