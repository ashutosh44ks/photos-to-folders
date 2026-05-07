import { useEffect, useState } from 'react'

const IGNORED_FOLDERS_KEY = 'photos-to-folders:ignored-folders'

export function useIgnoredFolders() {
  const [ignoredFolders, setIgnoredFolders] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(IGNORED_FOLDERS_KEY)

    if (!stored) {
      return
    }

    try {
      setIgnoredFolders(JSON.parse(stored))
    } catch (error) {
      console.error('Failed to parse ignored folders:', error)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(IGNORED_FOLDERS_KEY, JSON.stringify(ignoredFolders))
  }, [ignoredFolders])

  return [ignoredFolders, setIgnoredFolders] as const
}