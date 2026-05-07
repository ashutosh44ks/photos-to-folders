import { useEffect, useState } from 'react'

export type FolderListLayout = 'list' | 'horizontal'

type LayoutSettings = {
  folderListLayout: FolderListLayout
  showImagesLeft: boolean
}

const LAYOUT_SETTINGS_KEY = 'photos-to-folders:layout-settings'

const DEFAULT_SETTINGS: LayoutSettings = {
  folderListLayout: 'list',
  showImagesLeft: false,
}

export function useLayoutSettings() {
  const [settings, setSettings] = useState<LayoutSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    const stored = localStorage.getItem(LAYOUT_SETTINGS_KEY)

    if (!stored) {
      return
    }

    try {
      const parsed = JSON.parse(stored)
      setSettings({ ...DEFAULT_SETTINGS, ...parsed })
    } catch (error) {
      console.error('Failed to parse layout settings:', error)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(LAYOUT_SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  const updateLayout = (layout: FolderListLayout) => {
    setSettings((prev) => ({ ...prev, folderListLayout: layout }))
  }

  const toggleShowImagesLeft = () => {
    setSettings((prev) => ({ ...prev, showImagesLeft: !prev.showImagesLeft }))
  }

  return { settings, updateLayout, toggleShowImagesLeft }
}
