const rawApiBase = (import.meta.env.VITE_API_ENDPOINT || '').trim()

function normalizeBlogsEndpoint(baseUrl) {
  if (!baseUrl) return '/api/blogs'

  const cleanBase = baseUrl.replace(/\/+$/, '')
  if (cleanBase.endsWith('/blogs')) return cleanBase
  if (cleanBase.endsWith('/api')) return `${cleanBase}/blogs`
  return `${cleanBase}/blogs`
}

const blogsEndpoint = normalizeBlogsEndpoint(rawApiBase)

function blogUrl(id) {
  if (id === undefined || id === null || id === '') {
    return blogsEndpoint
  }
  return `${blogsEndpoint}/${encodeURIComponent(id)}`
}

async function toJsonSafe(response) {
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    return null
  }
  return response.json()
}

async function request(url, options = {}) {
  const response = await fetch(url, options)
  const data = await toJsonSafe(response)

  if (!response.ok) {
    const message = data?.message || `Request failed (${response.status})`
    throw new Error(message)
  }

  return data
}

function normalizeBlogsPayload(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.blogs)) return data.blogs
  return []
}

export async function getBlogs() {
  const data = await request(blogUrl())
  return normalizeBlogsPayload(data)
}

export async function getBlogById(id) {
  try {
    return await request(blogUrl(id))
  } catch (error) {
    // Backward compatibility with list-only APIs.
    const blogs = await getBlogs()
    const fallbackBlog = blogs.find((blog) => String(blog.id) === String(id))
    if (fallbackBlog) return fallbackBlog
    throw error
  }
}

export async function createBlog(blog) {
  return request(blogUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blog),
  })
}

export async function updateBlog(id, blog) {
  return request(blogUrl(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blog),
  })
}

export async function deleteBlog(id) {
  return request(blogUrl(id), { method: 'DELETE' })
}
