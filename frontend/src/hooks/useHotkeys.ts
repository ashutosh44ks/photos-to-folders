import { useEffect } from 'react'

type UseHotkeysOptions = {
  onNext: () => void
  onPrevious: () => void
  onSave: () => void
  onFolderToggle: (index: number) => void
  visibleFolders: string[]
  selectedFolders: string[]
}

export const useHotkeys = ({
  onNext,
  onPrevious,
  onSave,
  onFolderToggle,
  visibleFolders,
  selectedFolders,
}: UseHotkeysOptions) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ignore when typing into inputs/textareas or contenteditable
      const target = e.target as HTMLElement | null
      if (target) {
        const tag = target.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return
      }

      // navigation
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        onNext()
        return
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onPrevious()
        return
      }

      // save
      if (e.key === 'Enter') {
        e.preventDefault()
        onSave()
        return
      }

      // numeric toggles 1-9
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key, 10) - 1
        if (index < visibleFolders.length) {
          e.preventDefault()
          onFolderToggle(index)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onNext, onPrevious, onSave, onFolderToggle, visibleFolders, selectedFolders])
}
