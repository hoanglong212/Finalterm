import { Link } from 'react-router-dom'

const NAV_ITEMS = ['News', 'World', 'Business', 'Education', 'Health', 'Sport', 'Travel', 'Tech']

export default function SiteHeader() {
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
        <ul className="flex justify-center gap-8 py-4 text-sm tracking-widest uppercase">
          {NAV_ITEMS.map((item) => (
            <li key={item} className="cursor-pointer hover:text-red-600">
              {item}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
