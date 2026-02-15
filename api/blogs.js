export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({
      blogs: [
        {
          id: 1,
          title: 'Test Blog',
          category: 'Tech',
          content: 'This is a test blog.',
          createdAt: new Date().toISOString(),
        },
      ],
    })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
