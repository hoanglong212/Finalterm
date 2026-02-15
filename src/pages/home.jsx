import { Link } from 'react-router-dom'
import SubscribeForm from '../Register'
import mission from '../assets/mission.jpg'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black font-serif">
      {/* Header */}
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

      {/* Hero Section */}
      <main className="relative max-w-5xl mx-auto px-6 py-32 text-center">
        {/* Decorative corners */}
        <div className="absolute top-10 -left-40 w-12 h-12 border-l-4 border-t-4"></div>
        <div className="absolute bottom-10 -right-40 w-12 h-12 border-r-4 border-b-4 border-red-600"></div>

        <div className="flex items-center justify-center gap-3 text-sm tracking-widest mb-6">
          <span className="w-2 h-2 bg-red-600 inline-block"></span>
          <span className="text-gray-600">EST. 2026</span>
          <span className="w-2 h-2 bg-red-600 inline-block"></span>
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
      {/* What We Cover Section */}
      <div className="border-t-4 mt-8">
        <section className="max-w-6xl mx-auto px-6 py-32">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="w-2 h-2 bg-red-600"></span>
              <h3 className="font-towney text-4xl md:text-5xl font-bold tracking-wide">
                WHAT WE COVER
              </h3>
            </div>
            <p className="max-w-2xl mx-auto text-gray-600 text-lg">
              From breaking news to in-depth features, we bring you comprehensive coverage across
              the topics that matter most.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'News',
                desc: 'Breaking stories and in-depth coverage of current events',
              },
              {
                title: 'World',
                desc: 'Global perspectives on international affairs and culture',
              },
              {
                title: 'Business',
                desc: 'Market insights, economic trends, and financial analysis',
              },
              {
                title: 'Education',
                desc: 'Innovation in learning and academic excellence',
              },
              {
                title: 'Health',
                desc: 'Wellness, medical breakthroughs, and public health',
              },
              {
                title: 'Sport',
                desc: 'Athletic achievements and the spirit of competition',
              },
              {
                title: 'Travel',
                desc: 'Destinations, adventures, and cultural exploration',
              },
              {
                title: 'Tech',
                desc: 'Innovation, digital trends, and the future of technology',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border border-black p-8 hover:text-red-600 hover:border-red-600 transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2 h-2 bg-red-600"></span>
                  <h4 className="font-towney text-2xl font-bold">{item.title}</h4>
                </div>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
        {/* Our Mission Section */}
        <section className="max-w-6xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <div>
            <img
              src={`public/images/mission.jpg
`}
              alt="Our mission"
              className="w-full h-auto grayscale object-cover "
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 bg-red-600"></span>
              <h3 className="font-sans text-4xl md:text-5xl font-bold">OUR MISSION</h3>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              At The Honest Stories Teller, we believe in the power of truth and the importance of
              honest journalism. Our mission is to deliver stories that inform, inspire, and
              challenge perspectives.
            </p>

            <p className="text-gray-700 leading-relaxed mb-10">
              We are committed to upholding the highest standards of journalistic integrity, giving
              voice to the unheard, and holding power to account. Every story we tell is rooted in
              thorough research, balanced reporting, and a dedication to the facts.
            </p>

            <ul className="space-y-6">
              <li className="flex gap-4">
                <span className="w-2 h-2 bg-red-600 mt-3"></span>
                <div>
                  <h4 className="font-sans text-xl mb-1 font-semibold">Independent</h4>
                  <p className="text-gray-600">Free from corporate influence and political bias</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="w-2 h-2 bg-red-600 mt-3"></span>
                <div>
                  <h4 className="font-sans text-xl mb-1 font-semibold">Investigative</h4>
                  <p className="text-gray-600">Deep-dive reporting that uncovers the truth</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="w-2 h-2 bg-red-600 mt-3"></span>
                <div>
                  <h4 className="font-sans text-xl mb-1 font-semibold">Inclusive</h4>
                  <p className="text-gray-600">
                    Diverse voices and perspectives from around the globe
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>
        <section className="relative bg-black text-white py-32 px-6 overflow-hidden">
          {/* Diagonal background lines */}
          <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(135deg,white_0px,white_1px,transparent_1px,transparent_20px)]"></div>

          <div className="relative max-w-4xl mx-auto text-center">
            {/* Decorative quote */}
            <div className="text-red-600 text-6xl mb-6">“</div>

            <h2 className="font-sans text-5xl md:text-6xl mb-6 leading-tight">
              Join Our Community of Truth Seekers
            </h2>

            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-12">
              Stay informed with honest journalism. Subscribe to receive our best stories, exclusive
              insights, and weekly newsletters.
            </p>

            <SubscribeForm></SubscribeForm>

            <div className="border-t border-gray-700 my-20"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div>
                <h3 className="font-sans text-5xl text-red-600">10K+</h3>
                <p className="text-gray-400 tracking-widest text-sm mt-2">SUBSCRIBERS</p>
              </div>
              <div>
                <h3 className="font-sans text-5xl text-red-600">500+</h3>
                <p className="text-gray-400 tracking-widest text-sm mt-2">STORIES</p>
              </div>
              <div>
                <h3 className="font-sans text-5xl text-red-600">25+</h3>
                <p className="text-gray-400 tracking-widest text-sm mt-2">COUNTRIES</p>
              </div>
            </div>
          </div>
        </section>
        <footer className="bg-gray-100 text-black px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
              <h2 className="font-sans text-3xl font-bold">The Honest Stories Teller</h2>

              <ul className="flex flex-wrap gap-8 text-sm">
                <li className="hover:text-red-600 cursor-pointer">About</li>
                <li className="hover:text-red-600 cursor-pointer">Contact</li>
                <li className="hover:text-red-600 cursor-pointer">Careers</li>
                <li className="hover:text-red-600 cursor-pointer">Advertise</li>
                <li className="hover:text-red-600 cursor-pointer">Privacy</li>
                <li className="hover:text-red-600 cursor-pointer">Terms</li>
              </ul>
            </div>

            <div className="border-t border-gray-300 pt-8 flex flex-col md:flex-row md:justify-between md:items-center gap-6 text-sm text-gray-600">
              <p>© 2026 The Honest Stories Teller. All rights reserved.</p>

              <div className="flex gap-8">
                <span className="hover:text-red-600 cursor-pointer">Facebook</span>
                <span className="hover:text-red-600 cursor-pointer">Twitter</span>
                <span className="hover:text-red-600 cursor-pointer">Instagram</span>
                <span className="hover:text-red-600 cursor-pointer">LinkedIn</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
