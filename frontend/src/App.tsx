import { useState } from 'react'
import { toast } from 'sonner'
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import ImageViewer from './components/ImageViewer'
import FolderList from './components/FolderList'
import FolderManagementModal from './components/FolderManagementModal'
import { useImages, useFolders, useMoveImageToFolders } from './services/api'
import { Button } from './components/ui/button'
import { useIgnoredFolders } from './hooks/useIgnoredFolders'
import { useLayoutSettings } from './hooks/useLayoutSettings'

export default function App() {
  const { data: images = [], displayedImages, setDisplayedImages, isLoading } = useImages()
  const { data: folders = [] } = useFolders()
  const moveImageMutation = useMoveImageToFolders()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])
  const [showManagementModal, setShowManagementModal] = useState(false)
  const [ignoredFolders, setIgnoredFolders] = useIgnoredFolders()
  const { settings, updateLayout, toggleShowImagesLeft } = useLayoutSettings()

  const currentImage = displayedImages[currentImageIndex]

  const handleToggleFolder = (folderName: string) => {
    setSelectedFolders((prev) =>
      prev.includes(folderName) ? prev.filter((f) => f !== folderName) : [...prev, folderName]
    )
  }

  const handleSaveAndNext = async () => {
    if (selectedFolders.length === 0) {
      toast.error('Please select at least one folder')
      return
    }

    if (!currentImage) {
      toast.error('No image to save')
      return
    }

    try {
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
        toast.success('Image saved and moved to folders!')
      } else {
        toast.success('All images processed! 🎉')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast.error(message)
    }
  }

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : 0))
    setSelectedFolders([])
  }

  const handleNext = () => {
    if (currentImageIndex < displayedImages.length - 1) {
      setCurrentImageIndex((prev) => prev + 1)
      setSelectedFolders([])
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-linear-to-br from-stone-50 via-white to-stone-100 flex-col gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-stone-900"></div>
        <p className="text-sm font-medium tracking-wide text-stone-600">Loading images...</p>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-linear-to-br from-stone-50 via-white to-stone-100 text-stone-900">
      <div className="absolute inset-0">
        <ImageViewer
          imageName={currentImage}
          imageIndex={currentImageIndex}
          totalImages={displayedImages.length}
        />
      </div>

      <div className="absolute left-4 top-4 z-20 sm:left-6 sm:top-6">
        <Button
          onClick={() => setShowManagementModal(true)}
          variant="outline"
          size="icon"
          title="Manage folders"
          className="rounded-full border-white/70 bg-white/80 shadow-lg shadow-stone-900/10 backdrop-blur-md hover:bg-white"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute right-4 top-4 z-20 flex gap-3 sm:right-6 sm:top-6">
        <Button
          onClick={handlePrevious}
          disabled={currentImageIndex === 0 || displayedImages.length === 0}
          variant="outline"
          size="icon"
          className="rounded-full border-white/70 bg-white/80 shadow-lg shadow-stone-900/10 backdrop-blur-md hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentImageIndex >= displayedImages.length - 1 || displayedImages.length === 0}
          variant="outline"
          size="icon"
          className="rounded-full border-white/70 bg-white/80 shadow-lg shadow-stone-900/10 backdrop-blur-md hover:bg-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-20 sm:bottom-6 sm:left-6 sm:right-auto sm:w-[24rem]">
        <div className="rounded-3xl border border-white/70 bg-white/82 shadow-2xl shadow-stone-900/10 backdrop-blur-xl sm:p-5">
          <FolderList
            folders={folders.filter((f) => !ignoredFolders.includes(f))}
            selectedFolders={selectedFolders}
            onToggleFolder={handleToggleFolder}
            totalCount={folders.length}
            layout={settings.folderListLayout}
            imagesLeft={displayedImages.length}
            showImagesLeft={settings.showImagesLeft}
          />

          <Button
            onClick={handleSaveAndNext}
            disabled={
              selectedFolders.length === 0 ||
              displayedImages.length === 0 ||
              moveImageMutation.isPending
            }
            className="mt-4 w-full"
          >
            {moveImageMutation.isPending ? 'Saving...' : 'Save & Next'}
          </Button>
        </div>
      </div>

      {showManagementModal && (
        <FolderManagementModal
          folders={folders}
          ignoredFolders={ignoredFolders}
          onClose={() => setShowManagementModal(false)}
          onIgnoredFoldersChange={setIgnoredFolders}
          folderListLayout={settings.folderListLayout}
          onLayoutChange={updateLayout}
          showImagesLeft={settings.showImagesLeft}
          onShowImagesLeftChange={toggleShowImagesLeft}
        />
      )}

    </div>
  )
}
