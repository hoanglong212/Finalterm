import { useState } from 'react'

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = () => {
    if (!email || !password) {
      alert('Please fill all fields')
      return
    }

    const user = { email, password }

    const existingUsers = JSON.parse(localStorage.getItem('users')) || []

    existingUsers.push(user)

    localStorage.setItem('users', JSON.stringify(existingUsers))

    alert('User saved!')
    setEmail('')
    setPassword('')
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-5">
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-6 py-5 bg-gray-200 text-black text-lg outline-none"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-6 py-5 bg-gray-200 text-black text-lg outline-none"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-red-600 hover:bg-red-700 transition text-white py-5 tracking-widest font-semibold"
      >
        GET STARTED
      </button>

      <p className="text-gray-400 text-sm mt-2">Free to subscribe. Unsubscribe anytime.</p>
    </div>
  )
}
