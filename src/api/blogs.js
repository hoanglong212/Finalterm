import fs from 'fs'
import path from 'path'

const filePath = path.resolve('./db.json')

export default function handler(req, res) {
  if (req.method === 'GET') {
    const data = fs.readFileSync(filePath, 'utf-8')
    return res.status(200).json(JSON.parse(data))
  }

  if (req.method === 'POST') {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    const newBlog = {
      ...req.body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    data.blogs.push(newBlog)

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

    return res.status(200).json(newBlog)
  }

  res.status(405).json({ message: 'Method not allowed' })
}
