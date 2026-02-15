const CATEGORIES = [
  { title: 'News', desc: 'Breaking stories and in-depth coverage of current events' },
  { title: 'World', desc: 'Global perspectives on international affairs and culture' },
  { title: 'Business', desc: 'Market insights, economic trends, and financial analysis' },
  { title: 'Education', desc: 'Innovation in learning and academic excellence' },
  { title: 'Health', desc: 'Wellness, medical breakthroughs, and public health' },
  { title: 'Sport', desc: 'Athletic achievements and the spirit of competition' },
  { title: 'Travel', desc: 'Destinations, adventures, and cultural exploration' },
  { title: 'Tech', desc: 'Innovation, digital trends, and the future of technology' },
]

export default function WhatWeCoverSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-32">
      <div className="text-center mb-20">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="w-2 h-2 bg-red-600" />
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
        {CATEGORIES.map((item) => (
          <div
            key={item.title}
            className="border border-black p-8 hover:text-red-600 hover:border-red-600 transition"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-red-600" />
              <h4 className="font-towney text-2xl font-bold">{item.title}</h4>
            </div>
            <p className="text-gray-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
