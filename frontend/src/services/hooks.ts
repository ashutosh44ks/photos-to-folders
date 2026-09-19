import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect, useRef } from 'react'
import {
  fetchImages,
  fetchFolders,
  createFolder,
  renameFolder,
  deleteFolder,
  moveImageToFolders,
} from './api'

export function useImages() {
  const query = useQuery({
    queryKey: ['images'],
    queryFn: fetchImages,
    select: (data) => data.images || [],
  })

  const [displayedImages, setDisplayedImages] = useState<string[]>([])
  const hasInitializedDisplayedImages = useRef(false)

  useEffect(() => {
    if (!hasInitializedDisplayedImages.current && query.data) {
      setDisplayedImages(query.data)
      hasInitializedDisplayedImages.current = true
    }
  }, [query.data])

  return {
    displayedImages,
    setDisplayedImages,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}

export function useFolders() {
  return useQuery({
    queryKey: ['folders'],
    queryFn: fetchFolders,
    select: (data) => data.folders || [],
  })
}

export function useCreateFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    },
  })
}

export function useRenameFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ oldName, newName }: { oldName: string; newName: string }) =>
      renameFolder(oldName, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    },
  })
}

export function useDeleteFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    },
  })
}

export function useMoveImageToFolders() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ imageName, folderNames }: { imageName: string; folderNames: string[] }) =>
      moveImageToFolders(imageName, folderNames),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] })
    },
  })
}
