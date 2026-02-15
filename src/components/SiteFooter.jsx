export default function SiteFooter() {
  const links = ['About', 'Contact', 'Careers', 'Advertise', 'Privacy', 'Terms']
  const socials = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn']

  return (
    <footer className="bg-gray-100 text-black px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
          <h2 className="font-sans text-3xl font-bold">The Honest Stories Teller</h2>
          <ul className="flex flex-wrap gap-8 text-sm">
            {links.map((item) => (
              <li key={item} className="hover:text-red-600 cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-gray-300 pt-8 flex flex-col md:flex-row md:justify-between md:items-center gap-6 text-sm text-gray-600">
          <p>© 2026 The Honest Stories Teller. All rights reserved.</p>
          <div className="flex gap-8">
            {socials.map((name) => (
              <span key={name} className="hover:text-red-600 cursor-pointer">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
