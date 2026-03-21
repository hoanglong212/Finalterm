const USERS_KEY = 'users'
const CURRENT_USER_KEY = 'currentUser'

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function normalizeEmail(email = '') {
  return String(email ?? '').trim().toLowerCase()
}

function normalizeIdentifier(value = '') {
  return String(value ?? '').trim()
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getUsers() {
  const users = readJson(USERS_KEY, [])
  if (!Array.isArray(users)) return []
  return users
}

export function saveUsers(users) {
  writeJson(USERS_KEY, users)
}

function normalizeUser(user) {
  if (!user) return null

  const email = normalizeEmail(user.email)
  if (!email) return null

  return {
    id: user.id || generateId(),
    name: (user.name || user.email || '').trim(),
    email,
    password: user.password || '',
    createdAt: user.createdAt || new Date().toISOString(),
  }
}

export function registerUser(input) {
  const email = normalizeEmail(input?.email)
  const password = (input?.password || '').trim()
  const name = (input?.name || '').trim() || email

  if (!email || !password) {
    return { ok: false, message: 'Email and password are required.' }
  }

  if (password.length < 6) {
    return { ok: false, message: 'Password must be at least 6 characters.' }
  }

  const users = getUsers().map(normalizeUser).filter(Boolean)
  const exists = users.some((user) => user.email === email)

  if (exists) {
    return { ok: false, message: 'This email is already registered.' }
  }

  const newUser = normalizeUser({ name, email, password, createdAt: new Date().toISOString() })
  const nextUsers = [...users, newUser]
  saveUsers(nextUsers)

  return { ok: true, user: newUser }
}

export function loginWithCredentials(emailInput, passwordInput) {
  const email = normalizeEmail(emailInput)
  const password = (passwordInput || '').trim()

  const users = getUsers().map(normalizeUser).filter(Boolean)
  const matched = users.find((user) => user.email === email && user.password === password)

  if (!matched) {
    return { ok: false, message: 'Invalid email or password.' }
  }

  saveUsers(users)
  login(matched)

  return { ok: true, user: matched }
}

export function getUser() {
  const current = normalizeUser(readJson(CURRENT_USER_KEY, null))
  if (!current) return null

  // Keep compatibility with old localStorage shapes, but avoid writing on every render.
  const users = getUsers().map(normalizeUser).filter(Boolean)
  const found = users.find((user) => user.email === current.email)

  if (found) {
    if (
      found.id !== current.id ||
      found.name !== current.name ||
      found.password !== current.password
    ) {
      // One-time normalization update.
      login(found)
      saveUsers(users)
    }
    return found
  }

  const nextUser = normalizeUser(current)
  const alreadyInUsers = users.some((user) => user.email === nextUser.email)
  if (!alreadyInUsers) {
    const nextUsers = [...users, nextUser]
    saveUsers(nextUsers)
  }
  if (nextUser.id !== current.id || nextUser.name !== current.name) {
    login(nextUser)
  }

  return nextUser
}

export function login(user) {
  const normalized = normalizeUser(user)
  if (!normalized) return
  writeJson(CURRENT_USER_KEY, normalized)
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function isBlogOwner(user, blog) {
  if (!user || !blog) return false

  const normalizedUserEmail = normalizeEmail(user.email)
  const normalizedUserId = normalizeIdentifier(user.id)
  const authorId = normalizeIdentifier(blog.authorId)
  const authorEmail = blog.authorEmail ? normalizeEmail(blog.authorEmail) : ''

  // Ownerless legacy/seed stories stay read-only so one account cannot claim them.
  if (!authorId && !authorEmail) return false

  if (authorId && normalizedUserId === authorId) return true
  if (authorEmail && normalizedUserEmail === authorEmail) return true

  return false
}
