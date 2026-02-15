import SubscribeForm from '../Register'

const STATS = [
  { value: '10K+', label: 'SUBSCRIBERS' },
  { value: '500+', label: 'STORIES' },
  { value: '25+', label: 'COUNTRIES' },
]

export default function SubscribeSection() {
  return (
    <section className="relative bg-black text-white py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(135deg,white_0px,white_1px,transparent_1px,transparent_20px)]" />
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="text-red-600 text-6xl mb-6">"</div>
        <h2 className="font-sans text-5xl md:text-6xl mb-6 leading-tight">
          Join Our Community of Truth Seekers
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-12">
          Stay informed with honest journalism. Subscribe to receive our best stories, exclusive
          insights, and weekly newsletters.
        </p>
        <SubscribeForm />
        <div className="border-t border-gray-700 my-20" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <h3 className="font-sans text-5xl text-red-600">{value}</h3>
              <p className="text-gray-400 tracking-widest text-sm mt-2">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
