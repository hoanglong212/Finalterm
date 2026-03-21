import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom'
import { getUser } from './auth'
import ExplorePage from './pages/ExplorePage'
import BlogPreviewPage from './pages/BlogPreviewPage'
import HomePage from './pages/home'
import LoginPage from './pages/LoginPage'
import MyStoriesPage from './pages/MyStoriesPage'
import NotFoundPage from './pages/NotFoundPage'
import WriteBlog from './pages/Writeblog'

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
    path: '/my-stories',
    element: <MyStoriesPage />,
    loader: requireAuth,
  },
  {
    path: '/blog/:id',
    element: <BlogPreviewPage />,
  },
  {
    path: '/preview/:id',
    loader: ({ params }) => redirect(`/blog/${params.id}`),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App