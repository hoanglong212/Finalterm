import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'db.json')
    const fileData = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileData)

    if (req.method === 'GET') {
      return res.status(200).json(data)
    }

    return res.status(405).json({ message: 'Method not allowed' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
