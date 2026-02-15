import { useNavigate } from 'react-router-dom'

export default function ExploreButton() {
  const navigate = useNavigate()

  const handleExplore = () => {
    navigate('/explore')
  }

  return (
    <button
      className="bg-red-600 text-white px-8 py-4 text-sm tracking-widest font-semibold hover:bg-red-700 transition"
      onClick={handleExplore}
    >
      EXPLORE STORIES
    </button>
  )
}
