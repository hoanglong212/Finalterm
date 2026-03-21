import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-black">
      <SiteHeader />
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-sm tracking-[0.2em] uppercase text-red-600 mb-4">404</p>
        <h1 className="text-5xl font-bold mb-5">Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
        <Link
          to="/"
          className="inline-block bg-black text-white px-6 py-3 tracking-widest hover:bg-red-600 transition"
        >
          BACK TO HOME
        </Link>
      </div>
    </div>
  )
}