import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import HomePage from './pages/home'
import ExplorePage from './pages/ExplorePage'
import WriteBlog from './pages/Writeblog'
import LoginPage from './pages/LoginPage'
import BlogPreviewPage from './pages/BlogPreviewPage'
import { getUser } from './auth'

const requireAuth = () => {
  const user = getUser()
  if (!user) {
    return redirect('/login')
  }
  return null
}

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/explore', element: <ExplorePage /> },
  { path: '/login', element: <LoginPage /> },

  {
    path: '/write',
    element: <WriteBlog />,
    loader: requireAuth,
  },
  {
    path: '/edit/:id',
    element: <WriteBlog />,
    loader: requireAuth,
  },
  {
    path: '/preview/:id',
    element: <BlogPreviewPage />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
