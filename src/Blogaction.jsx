export async function createBlog(blog, isPublish) {
  if (isPublish) {
    try {
      await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog),
      })

      if (!res.ok) {
        throw new Error('Failed to publish blog')
      }

      alert('Blog published!')
    } catch (err) {
      alert(err.message)
    }
  } else {
    alert('Draft saved (local only)')
  }
}
