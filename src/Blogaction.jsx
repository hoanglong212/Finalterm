export async function createBlog(blog, isPublish) {
  if (isPublish) {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}db.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
