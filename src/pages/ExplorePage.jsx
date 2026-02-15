import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
export default function ExplorePage() {
  const [blogs, setBlogs] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}db.json`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setBlogs(sorted)
      })
      .catch((err) => console.error(err))
  }, [])

  // Sort theo mới nhất
  const sortedBlogs = [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const featured = blogs.length > 0 ? blogs[0] : null
  const secondary = blogs.length > 1 ? blogs.slice(1, 4) : []
  const others = blogs.length > 4 ? blogs.slice(4) : []

  if (!featured) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="bg-gray-100 min-h-screen text-black  ">
      {/* HEADER */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center">
          <h1
            className="
    text-5xl md:text-6xl
    font-EnglishTowney
    text-red-700
    tracking-wide
    cursor-pointer
    transition duration-300
    hover:scale-105
    hover:text-black
  "
            onClick={() => navigate('/')}
          >
            The Honest Stories Teller
          </h1>
        </div>
        <nav className="border-t">
          <ul className="flex justify-center gap-8 py-4 text-sm tracking-widest uppercase ">
            <li className="cursor-pointer hover:text-red-600">News</li>
            <li className="cursor-pointer hover:text-red-600">World</li>
            <li className="cursor-pointer hover:text-red-600">Business</li>
            <li className="cursor-pointer hover:text-red-600">Education</li>
            <li className="cursor-pointer hover:text-red-600">Health</li>
            <li className="cursor-pointer hover:text-red-600">Sport</li>
            <li className="cursor-pointer hover:text-red-600">Travel</li>
            <li className="cursor-pointer hover:text-red-600">Tech</li>
          </ul>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* TOP SECTION */}
        <div className="grid md:grid-cols-3 gap-8 border-b border-black pb-10  ">
          {/* FEATURED IMAGE */}
          <div className="md:col-span-2">
            {featured.thumbnail && (
              <img
                src={featured.thumbnail}
                alt={featured.title}
                className="w-full h-[450px] object-cover  "
              />
            )}
          </div>

          {/* FEATURED TEXT */}
          <div className="flex flex-col justify-center">
            <p className="text-sm text-red-600 font-semibold mb-2 uppercase">{featured.category}</p>

            <h2 className="text-3xl font-bold mb-4 leading-snug">{featured.title}</h2>

            <p className="text-gray-600 line-clamp-4">{featured.content}</p>
          </div>
        </div>

        {/* SECONDARY ROW */}
        <div className="grid md:grid-cols-3 gap-8 py-10 border-b border-black">
          {secondary.map((blog) => (
            <div key={blog.id}>
              {blog.thumbnail && (
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-60 object-cover mb-4"
                />
              )}

              <p className="text-xs text-red-600 font-semibold uppercase mb-2">{blog.category}</p>

              <h3 className="text-xl font-bold leading-snug">{blog.title}</h3>
            </div>
          ))}
        </div>

        {/* GRID SECTION */}
        <div className="grid md:grid-cols-4 gap-8 py-10">
          {others.map((blog) => (
            <div key={blog.id}>
              {blog.thumbnail && (
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-48 object-cover mb-3"
                />
              )}

              <p className="text-xs text-red-600 font-semibold uppercase mb-1">{blog.category}</p>

              <h4 className="font-bold leading-snug">{blog.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
