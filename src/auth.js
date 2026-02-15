export function getUser() {
  return JSON.parse(localStorage.getItem('currentUser'))
}

export function login(user) {
  localStorage.setItem('currentUser', JSON.stringify(user))
}

export function logout() {
  localStorage.removeItem('currentUser')
}
