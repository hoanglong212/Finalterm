import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <main className="relative max-w-5xl mx-auto px-6 py-32 text-center">
      <div className="absolute top-10 -left-40 w-12 h-12 border-l-4 border-t-4" />
      <div className="absolute bottom-10 -right-40 w-12 h-12 border-r-4 border-b-4 border-red-600" />
      <div className="flex items-center justify-center gap-3 text-sm tracking-widest mb-6">
        <span className="w-2 h-2 bg-red-600 inline-block" />
        <span className="text-gray-600">EST. 2026</span>
        <span className="w-2 h-2 bg-red-600 inline-block" />
      </div>
      <h2 className="text-6xl md:text-7xl font-bold leading-tight mb-8">
        Stories That <br /> Matter
      </h2>
      <p className="max-w-2xl mx-auto text-gray-700 text-lg mb-12">
        Independent journalism dedicated to truth, integrity, and the stories that shape our
        world. Join us in the pursuit of honest storytelling.
      </p>
      <div className="flex justify-center gap-6">
        <Link
          to="/explore"
          className="bg-red-600 text-white px-8 py-4 text-sm tracking-widest font-semibold hover:bg-red-700 transition inline-block"
        >
          EXPLORE STORIES
        </Link>
        <Link
          to="/write"
          className="border border-black px-8 py-4 text-sm tracking-widest font-semibold hover:bg-black hover:text-white transition"
        >
          WRITE STORIES
        </Link>
      </div>
    </main>
  )
}
