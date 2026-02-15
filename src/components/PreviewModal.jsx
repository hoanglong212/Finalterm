export default function PreviewModal({ onClose, title, category, thumbnail, content }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-6">
      <div className="bg-white text-black max-w-3xl w-full max-h-[90vh] overflow-y-auto p-10 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-black"
          type="button"
        >
          ✕
        </button>
        {thumbnail && (
          <img src={thumbnail} alt="Preview" className="w-full h-72 object-cover mb-6" />
        )}
        {category && (
          <p className="text-sm text-red-600 font-semibold mb-2">{category}</p>
        )}
        <h1 className="text-4xl font-serif font-bold mb-4">{title || 'Untitled Blog'}</h1>
        <p className="text-sm text-gray-500 mb-6">
          Preview mode • {new Date().toLocaleDateString()}
        </p>
        <p className="whitespace-pre-line leading-relaxed text-gray-800">
          {content || 'No content yet...'}
        </p>
      </div>
    </div>
  )
}
