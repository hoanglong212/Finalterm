import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../auth'

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users')) || []

    const foundUser = users.find((user) => user.email === email && user.password === password)

    if (!foundUser) {
      setError('Invalid email or password')
      return
    }

    login(foundUser)
    navigate('/write')
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-widest">WELCOME BACK</h1>
          <p className="text-gray-400 mt-3">Login to continue writing your stories</p>
        </div>

        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-6 py-5 bg-gray-200 text-black text-lg outline-none"
        />

        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-6 py-5 bg-gray-200 text-black text-lg outline-none"
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-red-600 hover:bg-red-700 transition text-white py-5 tracking-widest font-semibold"
        >
          LOGIN
        </button>

        {/* <p className="text-gray-500 text-sm text-center">
          Don’t have an account? Go back and subscribe.
        </p> */}
        <button
          onClick={() => navigate('/')}
          className="mb-10 text-red-600 hover:text-red-700 tracking-widest font-medium"
        >
          ← BACK TO HOME
        </button>
      </div>
    </div>
  )
}
