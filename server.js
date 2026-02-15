import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = 3001
const DB_PATH = path.join(__dirname, 'db.json')

function loadDb() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.warn('Could not load db.json:', err.message)
    return { blogs: [] }
  }
}

function saveDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        reject(new Error('Invalid JSON'))
      }
    })
    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = new URL(req.url || '/', `http://localhost:${PORT}`)
  if (url.pathname !== '/api/blogs') {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Not found' }))
    return
  }

  if (req.method === 'GET') {
    const db = loadDb()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ blogs: db.blogs || [] }))
    return
  }

  if (req.method === 'POST') {
    try {
      const db = loadDb()
      const body = await parseBody(req)
      const newBlog = {
        ...body,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      db.blogs = db.blogs || []
      db.blogs.push(newBlog)
      saveDb(db)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(newBlog))
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: err.message || 'Bad request' }))
    }
    return
  }

  res.writeHead(405, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: 'Method not allowed' }))
})

server.listen(PORT, () => {
  const db = loadDb()
  const count = db.blogs?.length ?? 0
  console.log(`API server running at http://localhost:${PORT}/api/blogs (${count} blogs from db.json)`)
})
