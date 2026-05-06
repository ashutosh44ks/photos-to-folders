import { useState, useEffect } from 'react'
import ImageViewer from './components/ImageViewer'
import FolderList from './components/FolderList'
import FolderManagementModal from './components/FolderManagementModal'
import { useImages, useFolders, useMoveImageToFolders } from './services/api'

const IGNORED_FOLDERS_KEY = 'photos-to-folders:ignored-folders'

export default function App() {
  const { data: images = [], isLoading } = useImages()
  const { data: folders = [] } = useFolders()
  const moveImageMutation = useMoveImageToFolders()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])
  const [showManagementModal, setShowManagementModal] = useState(false)
  const [ignoredFolders, setIgnoredFolders] = useState<string[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [displayedImages, setDisplayedImages] = useState<string[]>([])

  // Load ignored folders from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(IGNORED_FOLDERS_KEY)
    if (stored) {
      try {
        setIgnoredFolders(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse ignored folders:', e)
      }
    }
  }, [])

  // Save ignored folders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(IGNORED_FOLDERS_KEY, JSON.stringify(ignoredFolders))
  }, [ignoredFolders])

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
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-stone-50 via-white to-stone-100 flex-col gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-stone-900"></div>
        <p className="text-sm font-medium tracking-wide text-stone-600">Loading images...</p>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-stone-50 via-white to-stone-100 text-stone-900">
      <div className="absolute inset-0">
        <ImageViewer
          imageName={currentImage}
          imageIndex={currentImageIndex}
          totalImages={displayedImages.length}
        />
      </div>

      <div className="absolute left-4 top-4 z-20 sm:left-6 sm:top-6">
        <button
          onClick={() => setShowManagementModal(true)}
          className="rounded-full border border-white/70 bg-white/80 p-2 text-sm font-medium text-stone-700 shadow-lg shadow-stone-900/10 backdrop-blur-md transition hover:bg-white hover:text-stone-900"
          title="Manage folders"
        >
          ⚙️
        </button>
      </div>

      <div className="absolute right-4 top-4 z-20 flex gap-3 sm:right-6 sm:top-6">
        <button
          onClick={handlePrevious}
          disabled={currentImageIndex === 0 || displayedImages.length === 0}
          className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-stone-700 shadow-lg shadow-stone-900/10 backdrop-blur-md transition hover:bg-white hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ←
        </button>
        <button
          onClick={handleNext}
          disabled={currentImageIndex >= displayedImages.length - 1 || displayedImages.length === 0}
          className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-stone-700 shadow-lg shadow-stone-900/10 backdrop-blur-md transition hover:bg-white hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          →
        </button>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-20 sm:bottom-6 sm:left-6 sm:right-auto sm:w-[24rem]">
        <div className="rounded-3xl border border-white/70 bg-white/82 shadow-2xl shadow-stone-900/10 backdrop-blur-xl sm:p-5">
          <FolderList
            folders={folders.filter((f) => !ignoredFolders.includes(f))}
            selectedFolders={selectedFolders}
            onToggleFolder={handleToggleFolder}
            totalCount={folders.length}
          />

          <button
            onClick={handleSaveAndNext}
            disabled={
              selectedFolders.length === 0 ||
              displayedImages.length === 0 ||
              moveImageMutation.isPending
            }
            className="mt-4 w-full rounded-2xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-stone-900/15 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {moveImageMutation.isPending ? 'Saving...' : 'Save & Next'}
          </button>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-6 right-6 z-30 max-w-md rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 shadow-xl shadow-red-900/10">
          {error}
        </div>
      )}
      {success && (
        <div className="fixed bottom-6 right-6 z-30 max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800 shadow-xl shadow-emerald-900/10">
          {success}
        </div>
      )}

      {showManagementModal && (
        <FolderManagementModal
          folders={folders}
          ignoredFolders={ignoredFolders}
          onClose={() => setShowManagementModal(false)}
          onIgnoredFoldersChange={setIgnoredFolders}
        />
      )}
    </div>
  )
}
