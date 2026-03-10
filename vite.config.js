import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const DB_PATH = path.join(process.cwd(), 'db.json')

function loadDb() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(data)
  } catch {
    return { blogs: [] }
  }
}

function saveDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
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

function apiBlogsPlugin() {
  return {
    name: 'api-blogs',
    configureServer(server) {
      const handler = async (req, res, next) => {
        const reqUrl = new URL(req.url || '/', 'http://localhost')
        const isBlogsCollection = reqUrl.pathname === '/api/blogs'
        const detailMatch = reqUrl.pathname.match(/^\/api\/blogs\/([^/]+)$/)
        const blogId = detailMatch ? decodeURIComponent(detailMatch[1]) : null

        if (!isBlogsCollection && !blogId) {
          return next()
        }

        const send = (status, body) => {
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = status
          res.end(JSON.stringify(body))
        }

        if (req.method === 'GET' && isBlogsCollection) {
          const db = loadDb()
          send(200, db.blogs || [])
          return
        }

        if (req.method === 'GET' && blogId) {
          const db = loadDb()
          const blog = (db.blogs || []).find((item) => String(item.id) === String(blogId))

          if (!blog) {
            send(404, { message: 'Blog not found' })
            return
          }

          send(200, blog)
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

            send(201, newBlog)
          } catch (error) {
            send(400, { message: error.message || 'Bad request' })
          }
          return
        }

        if (req.method === 'PUT' && blogId) {
          try {
            const db = loadDb()
            const body = await parseBody(req)
            const index = (db.blogs || []).findIndex((item) => String(item.id) === String(blogId))

            if (index === -1) {
              send(404, { message: 'Blog not found' })
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

            send(200, updatedBlog)
          } catch (error) {
            send(400, { message: error.message || 'Bad request' })
          }
          return
        }

        if (req.method === 'DELETE' && blogId) {
          const db = loadDb()
          const index = (db.blogs || []).findIndex((item) => String(item.id) === String(blogId))

          if (index === -1) {
            send(404, { message: 'Blog not found' })
            return
          }

          const [deletedBlog] = db.blogs.splice(index, 1)
          saveDb(db)
          send(200, deletedBlog)
          return
        }

        send(405, { message: 'Method not allowed' })
      }

      server.middlewares.stack.unshift({ route: '', handle: handler })
    },
  }
}

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    apiBlogsPlugin(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
})