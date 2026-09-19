import { useState } from 'react'
import { toast } from 'sonner'
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import ImageViewer from './components/ImageViewer'
import FolderList from './components/FolderList'
import FolderManagementModal from './components/FolderManagementModal'
import SettingsHintOverlay from './components/SettingsHintOverlay'
import { useImages, useFolders, useMoveImageToFolders } from './services/hooks'
import { Button } from './components/ui/button'
import { Kbd } from './components/ui/kbd'
import { useHotkeys } from './hooks/useHotkeys'
import { useIgnoredFolders } from './hooks/useIgnoredFolders'
import { useLayoutSettings } from './hooks/useLayoutSettings'
import { useSettingsHint } from './hooks/useSettingsHint'
import { fireConfetti } from './lib/confetti'

export default function App() {
  const { displayedImages, setDisplayedImages, isLoading } = useImages()
  const { data: folders = [] } = useFolders()
  const moveImageMutation = useMoveImageToFolders()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])
  const [showManagementModal, setShowManagementModal] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const { active: showSettingsHint, key: hintKey, trigger: handleEmptyFoldersHint } = useSettingsHint()
  const [ignoredFolders, setIgnoredFolders] = useIgnoredFolders()
  const { settings, updateLayout, toggleShowImagesLeft, toggleShowPreviewImages } = useLayoutSettings()
  const visibleFolders = folders.filter((f) => !ignoredFolders.includes(f))

  const currentImage = displayedImages[currentImageIndex]
  const previewImages = displayedImages.slice(currentImageIndex + 1, currentImageIndex + 3)

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
        setSessionComplete(true)
        fireConfetti()
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

  // register hotkeys (1-9 toggle folders, Enter = save, arrows = prev/next)
  useHotkeys({
    onNext: handleNext,
    onPrevious: handlePrevious,
    onSave: handleSaveAndNext,
    onFolderToggle: (index) => {
      const folder = visibleFolders[index]
      if (folder) handleToggleFolder(folder)
    },
    visibleFolders,
    selectedFolders,
  })

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-foreground"></div>
        <p className="text-sm font-medium tracking-wide text-muted-foreground">Loading images...</p>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0">
        <ImageViewer
          imageName={currentImage}
          imageIndex={currentImageIndex}
          totalImages={displayedImages.length}
          emptyReason={sessionComplete ? 'complete' : 'empty'}
        />
      </div>

      {showSettingsHint && (
        <SettingsHintOverlay hintKey={hintKey} imageName={currentImage} />
      )}

      <div className="absolute left-4 top-4 z-20 sm:left-6 sm:top-6">
        <Button
          onClick={() => setShowManagementModal(true)}
          variant="outline"
          size="icon"
          title="Manage folders"
          className="rounded-full border-border/70 bg-background/80 shadow-lg shadow-foreground/10 backdrop-blur-md hover:bg-background"
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
          className="rounded-full border-border/70 bg-background/80 shadow-lg shadow-foreground/10 backdrop-blur-md hover:bg-background"
          title="Previous image (←)"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentImageIndex >= displayedImages.length - 1 || displayedImages.length === 0}
          variant="outline"
          size="icon"
          className="rounded-full border-border/70 bg-background/80 shadow-lg shadow-foreground/10 backdrop-blur-md hover:bg-background"
          title="Next image (→)"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-20 sm:bottom-6 sm:left-6 sm:right-auto sm:w-[24rem]">
        <div className="rounded-3xl border border-border/70 bg-background/82 shadow-2xl shadow-foreground/10 backdrop-blur-xl sm:p-5">
          <FolderList
            folders={visibleFolders}
            selectedFolders={selectedFolders}
            onToggleFolder={handleToggleFolder}
            totalCount={folders.length}
            layout={settings.folderListLayout}
            imagesLeft={displayedImages.length}
            showImagesLeft={settings.showImagesLeft}
            onEmptyStateClick={handleEmptyFoldersHint}
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
            <Kbd size="sm" className="text-muted-foreground">
              ⏎
            </Kbd>
          </Button>
        </div>
      </div>

      {settings.showPreviewImages && previewImages.length > 0 && (
        <div className="absolute bottom-4 right-4 z-20 hidden w-[16rem] flex-col gap-3 sm:bottom-6 sm:right-6 sm:flex">
          <div className="rounded-2xl border border-border/70 bg-background/82 p-3 shadow-2xl shadow-foreground/10 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Up next
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleShowPreviewImages}
                className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Hide
              </Button>
            </div>
            <div className="space-y-3">
              {previewImages.map((imageName, index) => (
                <div
                  key={imageName}
                  className="overflow-hidden rounded-xl border border-border bg-muted shadow-sm"
                >
                  <div className="relative aspect-[4/3]">
                    <img
                      src={`/api/images/${imageName}`}
                      alt={imageName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement
                        img.src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e7e5e4" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="18" fill="%23999"%3EPreview not found%3C/text%3E%3C/svg%3E'
                      }}
                    />
                    <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                      {index + 1}
                    </div>
                  </div>
                  <div className="truncate px-3 py-2 text-xs text-muted-foreground" title={imageName}>
                    {imageName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
          showPreviewImages={settings.showPreviewImages}
          onShowPreviewImagesChange={toggleShowPreviewImages}
        />
      )}
    </div>
  )
}
