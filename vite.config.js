import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

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

function apiBlogsPlugin() {
  return {
    name: 'api-blogs',
    configureServer(server) {
      const handler = (req, res, next) => {
        if (req.url !== '/api/blogs' || (req.method !== 'GET' && req.method !== 'POST')) {
          return next()
        }

        const send = (status, body) => {
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = status
          res.end(JSON.stringify(body))
        }

        if (req.method === 'GET') {
          const db = loadDb()
          return send(200, { blogs: db.blogs || [] })
        }

        // POST: read body then handle
        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', () => {
          try {
            const parsed = body ? JSON.parse(body) : {}
            const db = loadDb()
            db.blogs = db.blogs || []
            const newBlog = {
              ...parsed,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            db.blogs.push(newBlog)
            saveDb(db)
            send(200, newBlog)
          } catch (err) {
            send(400, { message: err.message || 'Bad request' })
          }
        })
      }
      // Run before proxy so /api/blogs is handled by us
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
