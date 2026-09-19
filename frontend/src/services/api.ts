import type {
  ImageResponse,
  FolderResponse,
  CreateFolderResponse,
  RenameFolderResponse,
  DeleteFolderResponse,
  MoveImageResponse,
} from '../types'

const API_BASE = '/api'

export async function fetchImages(): Promise<ImageResponse> {
  const res = await fetch(`${API_BASE}/images`)
  if (!res.ok) throw new Error('Failed to fetch images')
  return res.json()
}

export async function fetchFolders(): Promise<FolderResponse> {
  const res = await fetch(`${API_BASE}/folders`)
  if (!res.ok) throw new Error('Failed to fetch folders')
  return res.json()
}

export async function createFolder(folderName: string): Promise<CreateFolderResponse> {
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

export async function renameFolder(
  oldName: string,
  newName: string
): Promise<RenameFolderResponse> {
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

export async function deleteFolder(folderName: string): Promise<DeleteFolderResponse> {
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

export async function moveImageToFolders(
  imageName: string,
  folderNames: string[]
): Promise<MoveImageResponse> {
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
