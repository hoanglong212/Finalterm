let blogs = []

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ blogs })
  }

  if (req.method === 'POST') {
    const newBlog = {
      ...req.body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    blogs.push(newBlog)

    return res.status(200).json(newBlog)
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
