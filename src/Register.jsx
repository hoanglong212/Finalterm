import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, registerUser } from './auth'

export default function SubscribeForm() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setError('')

    const result = registerUser({ email, password })

    if (!result.ok) {
      setError(result.message)
      return
    }

    login(result.user)
    setEmail('')
    setPassword('')
    navigate('/write')
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-5">
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="w-full px-6 py-5 bg-gray-200 text-black text-lg outline-none"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="w-full px-6 py-5 bg-gray-200 text-black text-lg outline-none"
      />

      {error && <p className="text-red-400 text-sm text-left">{error}</p>}

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