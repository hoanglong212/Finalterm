const POINTS = [
  { title: 'Independent', desc: 'Free from corporate influence and political bias' },
  { title: 'Investigative', desc: 'Deep-dive reporting that uncovers the truth' },
  { title: 'Inclusive', desc: 'Diverse voices and perspectives from around the globe' },
]

// Inline SVG — no image request, no 404. To use a photo, add public/mission.jpg and use <img src="/mission.jpg" alt="Our mission" className="w-full h-auto grayscale object-cover min-h-[280px]" />
const MissionPlaceholder = () => (
  <div className="w-full min-h-[280px] bg-gray-200 flex items-center justify-center grayscale">
    <svg
      className="w-full h-auto min-h-[280px] object-cover"
      viewBox="0 0 800 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="800" height="400" fill="#e5e7eb" />
      <path
        d="M200 120h400v24H200V120zm0 56h400v24H200v-24zm0 56h280v24H200v-24z"
        fill="#9ca3af"
      />
      <circle cx="400" cy="280" r="48" stroke="#9ca3af" strokeWidth="2" fill="none" />
    </svg>
  </div>
)

export default function MissionSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
      <MissionPlaceholder />
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-2 bg-red-600" />
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
          {POINTS.map((item) => (
            <li key={item.title} className="flex gap-4">
              <span className="w-2 h-2 bg-red-600 mt-3 shrink-0" />
              <div>
                <h4 className="font-sans text-xl mb-1 font-semibold">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
