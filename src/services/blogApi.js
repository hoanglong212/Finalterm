import dbData from '../../db.json'

const BLOGS_STORAGE_KEY = 'blogs'

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function normalizeBlog(blog) {
  const now = new Date().toISOString()

  return {
    id: blog?.id ? String(blog.id) : generateId(),
    title: blog?.title || '',
    category: blog?.category || 'News',
    thumbnail: blog?.thumbnail || '',
    content: blog?.content || '',
    status: 'published',
    authorId: blog?.authorId || '',
    authorName: blog?.authorName || '',
    authorEmail: blog?.authorEmail || '',
    createdAt: blog?.createdAt || now,
    updatedAt: blog?.updatedAt || now,
  }
}

function sanitizeBlogs(rawBlogs) {
  if (!Array.isArray(rawBlogs)) return []

  return rawBlogs
    .filter((blog) => {
      const rawStatus = String(blog?.status || '').toLowerCase()
      return rawStatus !== 'draft'
    })
    .map((blog) => normalizeBlog({ ...blog, status: 'published' }))
}

function sortByCreatedAtDesc(blogs) {
  return [...blogs].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
}

function mergeSeedWithStored(seedBlogs, storedBlogs) {
  const merged = new Map()

  seedBlogs.forEach((blog) => {
    merged.set(String(blog.id), blog)
  })

  storedBlogs.forEach((blog) => {
    merged.set(String(blog.id), normalizeBlog(blog))
  })

  return sortByCreatedAtDesc(Array.from(merged.values()))
}

function readBlogsFromStorage() {
  try {
    const raw = localStorage.getItem(BLOGS_STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return sanitizeBlogs(parsed)
  } catch {
    return []
  }
}

function writeBlogsToStorage(blogs) {
  localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(blogs))
}

function loadSeedBlogs() {
  const blogs = Array.isArray(dbData) ? dbData : dbData?.blogs
  return sanitizeBlogs(blogs)
}

function hasSameBlogSnapshot(currentBlogs, nextBlogs) {
  if (currentBlogs.length !== nextBlogs.length) return false

  for (let index = 0; index < currentBlogs.length; index += 1) {
    const current = currentBlogs[index]
    const next = nextBlogs[index]

    if (!current || !next) return false
    if (String(current.id) !== String(next.id)) return false
    if ((current.updatedAt || '') !== (next.updatedAt || '')) return false
    if ((current.status || '') !== (next.status || '')) return false
  }

  return true
}

async function ensureInitialized() {
  const storedBlogs = readBlogsFromStorage()
  const seedBlogs = loadSeedBlogs()

  const mergedBlogs =
    storedBlogs.length === 0 ? sortByCreatedAtDesc(seedBlogs) : mergeSeedWithStored(seedBlogs, storedBlogs)

  if (!hasSameBlogSnapshot(storedBlogs, mergedBlogs)) {
    writeBlogsToStorage(mergedBlogs)
  }

  return mergedBlogs.map((blog) => ({ ...blog }))
}

export async function getBlogs() {
  return ensureInitialized()
}

export async function getBlogById(id) {
  const blogs = await ensureInitialized()
  const blog = blogs.find((item) => String(item.id) === String(id))

  if (!blog) {
    throw new Error('Blog not found')
  }

  return { ...blog }
}

export async function createBlog(blogInput) {
  const blogs = await ensureInitialized()
  const now = new Date().toISOString()

  const newBlog = normalizeBlog({
    ...blogInput,
    status: 'published',
    id: blogInput?.id || generateId(),
    createdAt: blogInput?.createdAt || now,
    updatedAt: now,
  })

  const nextBlogs = [...blogs, newBlog]
  writeBlogsToStorage(nextBlogs)

  return { ...newBlog }
}

export async function updateBlog(id, blogInput) {
  const blogs = await ensureInitialized()
  const index = blogs.findIndex((item) => String(item.id) === String(id))

  if (index < 0) {
    throw new Error('Blog not found')
  }

  const existingBlog = blogs[index]
  const updatedBlog = normalizeBlog({
    ...existingBlog,
    ...blogInput,
    status: 'published',
    id: existingBlog.id,
    createdAt: existingBlog.createdAt,
    updatedAt: new Date().toISOString(),
  })

  const nextBlogs = [...blogs]
  nextBlogs[index] = updatedBlog

  writeBlogsToStorage(nextBlogs)

  return { ...updatedBlog }
}

export async function deleteBlog(id) {
  const blogs = await ensureInitialized()
  const index = blogs.findIndex((item) => String(item.id) === String(id))

  if (index < 0) {
    throw new Error('Blog not found')
  }

  const nextBlogs = [...blogs]
  const [deletedBlog] = nextBlogs.splice(index, 1)

  writeBlogsToStorage(nextBlogs)

  return { ...deletedBlog }
}
