export function getUser() {
  try {
    const raw = localStorage.getItem('currentUser')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function login(user) {
  localStorage.setItem('currentUser', JSON.stringify(user))
}

export function logout() {
  localStorage.removeItem('currentUser')
}
