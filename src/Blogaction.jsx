export function createBlog(blog, isPublish) {
  if (!isPublish) {
    alert('Draft saved locally')
    return
  }

  const existingBlogs = JSON.parse(localStorage.getItem('blogs')) || []

  const newBlog = {
    ...blog,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  existingBlogs.push(newBlog)

  localStorage.setItem('blogs', JSON.stringify(existingBlogs))

  alert('Blog published successfully!')
}
