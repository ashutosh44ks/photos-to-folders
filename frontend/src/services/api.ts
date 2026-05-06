import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  ImageResponse,
  FolderResponse,
  CreateFolderResponse,
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
  return useQuery({
    queryKey: ['images'],
    queryFn: fetchImages,
    select: (data) => data.images || [],
  })
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
