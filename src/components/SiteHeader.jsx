import { Link, useNavigate } from 'react-router-dom'
import { getUser, logout } from '../auth'

const NAV_ITEMS = [
  { label: 'News', category: 'News' },
  { label: 'World', category: 'World' },
  { label: 'Business', category: 'Business' },
  { label: 'Education', category: 'Education' },
  { label: 'Health', category: 'Health' },
  { label: 'Sport', category: 'Sport' },
  { label: 'Travel', category: 'Travel' },
  { label: 'Tech', category: 'Technology' },
]

export default function SiteHeader() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const titleClass =
    'block text-5xl md:text-6xl font-EnglishTowney text-red-700 tracking-wide cursor-pointer transition duration-300 hover:scale-105 hover:text-black'

  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto px-6 py-6 text-center">
        <Link to="/" className={titleClass}>
          The Honest Stories Teller
        </Link>
      </div>
      <nav className="border-t">
        <ul className="flex flex-wrap justify-center gap-8 py-4 text-sm tracking-widest uppercase">
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className="cursor-pointer hover:text-red-600">
              <Link to={`/explore?category=${encodeURIComponent(item.category)}`}>{item.label}</Link>
            </li>
          ))}

          {user ? (
            <>
              <li className="cursor-pointer hover:text-red-600">
                <Link to="/my-stories">My Stories</Link>
              </li>
              <li className="cursor-pointer hover:text-red-600">
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <li className="cursor-pointer hover:text-red-600">
              <Link to="/login">Sign In</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}
