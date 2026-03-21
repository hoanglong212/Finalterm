const HTTP_PROTOCOLS = new Set(['http:', 'https:'])

export function toEditableBlog(blog = {}) {
  return {
    title: blog.title || '',
    category: blog.category || '',
    thumbnail: blog.thumbnail || '',
    content: blog.content || '',
  }
}

export function isValidHttpUrl(value = '') {
  if (!value) return true

  try {
    const parsed = new URL(value)
    return HTTP_PROTOCOLS.has(parsed.protocol)
  } catch {
    return false
  }
}

export function validateBlogDraft(blog = {}) {
  const values = {
    title: (blog.title || '').trim(),
    category: blog.category || '',
    thumbnail: (blog.thumbnail || '').trim(),
    content: (blog.content || '').trim(),
  }

  const errors = {}

  if (!values.title) errors.title = 'Blog title is required'
  if (!values.category) errors.category = 'Please select a category'
  if (!values.content) errors.content = 'Content cannot be empty'

  if (values.thumbnail && !isValidHttpUrl(values.thumbnail)) {
    errors.thumbnail = 'Thumbnail must be a valid URL'
  }

  return {
    errors,
    values,
    isValid: Object.keys(errors).length === 0,
  }
}
