import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import HomePage from './pages/home'
import ExplorePage from './pages/ExplorePage'
import WriteBlog from './pages/Writeblog'
import LoginPage from './pages/LoginPage'
import { getUser } from './auth'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/explore',
    element: <ExplorePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/write',
    element: <WriteBlog />,
    loader: () => {
      const user = getUser()
      if (!user) {
        return redirect('/login')
      }
      return null
    },
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
