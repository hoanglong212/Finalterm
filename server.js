import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = 3001
const DB_PATH = path.join(__dirname, 'db.json')

function loadDb() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.warn('Could not load db.json:', error.message)
    return { blogs: [] }
  }
}

function saveDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      if (!body) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(body))
      } catch {
        reject(new Error('Invalid JSON'))
      }
    })

    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  const url = new URL(req.url || '/', `http://localhost:${PORT}`)
  const isBlogsCollection = url.pathname === '/api/blogs'
  const detailMatch = url.pathname.match(/^\/api\/blogs\/([^/]+)$/)
  const blogId = detailMatch ? decodeURIComponent(detailMatch[1]) : null

  if (!isBlogsCollection && !blogId) {
    sendJson(res, 404, { message: 'Not found' })
    return
  }

  if (req.method === 'GET' && isBlogsCollection) {
    const db = loadDb()
    sendJson(res, 200, db.blogs || [])
    return
  }

  if (req.method === 'GET' && blogId) {
    const db = loadDb()
    const blog = (db.blogs || []).find((item) => String(item.id) === String(blogId))

    if (!blog) {
      sendJson(res, 404, { message: 'Blog not found' })
      return
    }

    sendJson(res, 200, blog)
    return
  }

  if (req.method === 'POST' && isBlogsCollection) {
    try {
      const db = loadDb()
      const body = await parseBody(req)
      const now = new Date().toISOString()
      const newBlog = {
        ...body,
        id: body.id || randomUUID(),
        createdAt: body.createdAt || now,
        updatedAt: now,
      }

      db.blogs = db.blogs || []
      db.blogs.push(newBlog)
      saveDb(db)

      sendJson(res, 201, newBlog)
    } catch (error) {
      sendJson(res, 400, { message: error.message || 'Bad request' })
    }
    return
  }

  if (req.method === 'PUT' && blogId) {
    try {
      const db = loadDb()
      const body = await parseBody(req)
      const index = (db.blogs || []).findIndex((item) => String(item.id) === String(blogId))

      if (index === -1) {
        sendJson(res, 404, { message: 'Blog not found' })
        return
      }

      const existingBlog = db.blogs[index]
      const updatedBlog = {
        ...existingBlog,
        ...body,
        id: existingBlog.id,
        createdAt: existingBlog.createdAt,
        updatedAt: new Date().toISOString(),
      }

      db.blogs[index] = updatedBlog
      saveDb(db)

      sendJson(res, 200, updatedBlog)
    } catch (error) {
      sendJson(res, 400, { message: error.message || 'Bad request' })
    }
    return
  }

  if (req.method === 'DELETE' && blogId) {
    const db = loadDb()
    const index = (db.blogs || []).findIndex((item) => String(item.id) === String(blogId))

    if (index === -1) {
      sendJson(res, 404, { message: 'Blog not found' })
      return
    }

    const [deletedBlog] = db.blogs.splice(index, 1)
    saveDb(db)
    sendJson(res, 200, deletedBlog)
    return
  }

  sendJson(res, 405, { message: 'Method not allowed' })
})

server.listen(PORT, () => {
  const db = loadDb()
  const count = db.blogs?.length || 0
  console.log(`API server running at http://localhost:${PORT}/api/blogs (${count} blogs from db.json)`)
})