import { useState } from 'react'
import ImageViewer from './components/ImageViewer'
import FolderList from './components/FolderList'
import CreateFolderModal from './components/CreateFolderModal'
import { useImages, useFolders, useMoveImageToFolders } from './services/api'

export default function App() {
  const { data: images = [], isLoading } = useImages()
  const { data: folders = [] } = useFolders()
  const moveImageMutation = useMoveImageToFolders()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [displayedImages, setDisplayedImages] = useState<string[]>([])

  const currentImage = displayedImages[currentImageIndex] ?? images[currentImageIndex]

  // Initialize displayed images once
  if (displayedImages.length === 0 && images.length > 0) {
    setDisplayedImages(images)
  }

  const handleToggleFolder = (folderName: string) => {
    setSelectedFolders((prev) =>
      prev.includes(folderName) ? prev.filter((f) => f !== folderName) : [...prev, folderName]
    )
    setSuccess('')
  }

  const handleSaveAndNext = async () => {
    if (selectedFolders.length === 0) {
      setError('Please select at least one folder')
      setTimeout(() => setError(''), 3000)
      return
    }

    if (!currentImage) {
      setError('No image to save')
      setTimeout(() => setError(''), 3000)
      return
    }

    try {
      setError('')
      setSuccess('')

      await moveImageMutation.mutateAsync({
        imageName: currentImage,
        folderNames: selectedFolders,
      })

      // Remove saved image from display
      const newImages = displayedImages.filter((_, i) => i !== currentImageIndex)
      setDisplayedImages(newImages)

      // Reset selection
      setSelectedFolders([])

      // Move to next image or show completion
      if (newImages.length > 0) {
        const nextIndex =
          currentImageIndex >= newImages.length ? newImages.length - 1 : currentImageIndex
        setCurrentImageIndex(nextIndex)
        setSuccess('Image saved and moved to folders!')
      } else {
        setSuccess('All images processed! 🎉')
      }

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
    }
  }

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : 0))
    setSelectedFolders([])
    setError('')
    setSuccess('')
  }

  const handleNext = () => {
    if (currentImageIndex < displayedImages.length - 1) {
      setCurrentImageIndex((prev) => prev + 1)
      setSelectedFolders([])
      setError('')
      setSuccess('')
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 flex-col gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600"></div>
        <p className="text-gray-600">Loading images...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      <header className="bg-linear-to-r from-purple-600 to-purple-800 text-white px-8 py-6 text-center shadow-md">
        <h1 className="text-4xl font-bold mb-2">📁 Photos to Folders</h1>
        <p className="text-lg opacity-90">Organize and move your images</p>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full gap-8 px-8 py-8">
        <div className="flex-1 flex flex-col gap-6">
          <ImageViewer
            imageName={currentImage}
            imageIndex={currentImageIndex}
            totalImages={displayedImages.length}
          />

          <div className="flex gap-4 justify-center">
            <button
              onClick={handlePrevious}
              disabled={currentImageIndex === 0 || displayedImages.length === 0}
              className="px-6 py-3 bg-white border-2 border-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:border-purple-600 hover:enabled:text-purple-600 transition-all"
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentImageIndex >= displayedImages.length - 1 || displayedImages.length === 0}
              className="px-6 py-3 bg-white border-2 border-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:border-purple-600 hover:enabled:text-purple-600 transition-all"
            >
              Next →
            </button>
          </div>
        </div>

        <aside className="w-96 flex flex-col gap-6">
          <FolderList
            folders={folders}
            selectedFolders={selectedFolders}
            onToggleFolder={handleToggleFolder}
            onCreateFolder={() => setShowModal(true)}
          />

          <button
            onClick={handleSaveAndNext}
            disabled={selectedFolders.length === 0 || displayedImages.length === 0 || moveImageMutation.isPending}
            className="w-full py-3 px-6 bg-linear-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:shadow-lg hover:enabled:scale-105 transition-all"
          >
            {moveImageMutation.isPending ? 'Saving...' : '✓ Save & Next'}
          </button>

          {displayedImages.length === 0 && !isLoading && (
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-600">No images found in the directory.</p>
              <p className="text-sm text-gray-500">Check your IMAGE_DIRECTORY environment variable.</p>
            </div>
          )}
        </aside>
      </div>

      {error && (
        <div className="fixed bottom-8 right-8 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg max-w-md animate-in">
          {error}
        </div>
      )}
      {success && (
        <div className="fixed bottom-8 right-8 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-lg max-w-md animate-in">
          {success}
        </div>
      )}

      {showModal && <CreateFolderModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
