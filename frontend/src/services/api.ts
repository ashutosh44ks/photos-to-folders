import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect, useRef } from 'react'
import type {
  ImageResponse,
  FolderResponse,
  CreateFolderResponse,
  RenameFolderResponse,
  DeleteFolderResponse,
  MoveImageResponse,
} from '../types'

const API_BASE = '/api'

// Query functions
const fetchImages = async (): Promise<ImageResponse> => {
  const res = await fetch(`${API_BASE}/images`)
  if (!res.ok) throw new Error('Failed to fetch images')
  return res.json()
}

const fetchFolders = async (): Promise<FolderResponse> => {
  const res = await fetch(`${API_BASE}/folders`)
  if (!res.ok) throw new Error('Failed to fetch folders')
  return res.json()
}

const createFolderApi = async (folderName: string): Promise<CreateFolderResponse> => {
  const res = await fetch(`${API_BASE}/folders/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folderName }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Failed to create folder')
  }
  return res.json()
}

const renameFolderApi = async (oldName: string, newName: string): Promise<RenameFolderResponse> => {
  const res = await fetch(`${API_BASE}/folders/rename`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldName, newName }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Failed to rename folder')
  }
  return res.json()
}

const deleteFolderApi = async (folderName: string): Promise<DeleteFolderResponse> => {
  const res = await fetch(`${API_BASE}/folders/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folderName }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Failed to delete folder')
  }
  return res.json()
}

const moveImageToFoldersApi = async (
  imageName: string,
  folderNames: string[]
): Promise<MoveImageResponse> => {
  const res = await fetch(`${API_BASE}/folders/move-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageName, folderNames }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Failed to move image')
  }
  return res.json()
}

// React Query hooks
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
    data: query.data || [],
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
    mutationFn: createFolderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    },
  })
}

export function useRenameFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ oldName, newName }: { oldName: string; newName: string }) =>
      renameFolderApi(oldName, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    },
  })
}

export function useDeleteFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteFolderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    },
  })
}

export function useMoveImageToFolders() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ imageName, folderNames }: { imageName: string; folderNames: string[] }) =>
      moveImageToFoldersApi(imageName, folderNames),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] })
    },
  })
}
