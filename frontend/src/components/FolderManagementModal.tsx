import { useState, type FC, type FormEvent, type KeyboardEvent } from 'react'
import { useCreateFolder, useRenameFolder, useDeleteFolder } from '../services/api'

type FolderManagementModalProps = {
  folders: string[]
  ignoredFolders: string[]
  onClose: () => void
  onIgnoredFoldersChange: (ignored: string[]) => void
}

const FolderManagementModal: FC<FolderManagementModalProps> = ({
  folders,
  ignoredFolders,
  onClose,
  onIgnoredFoldersChange,
}) => {
  const [newFolderName, setNewFolderName] = useState('')
  const [renamingFolder, setRenamingFolder] = useState<string | null>(null)
  const [renameFolderName, setRenameFolderName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const createFolderMutation = useCreateFolder()
  const renameFolderMutation = useRenameFolder()
  const deleteFolderMutation = useDeleteFolder()

  const handleCreateSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newFolderName.trim()) {
      setError('Folder name cannot be empty')
      return
    }

    try {
      setError('')
      await createFolderMutation.mutateAsync(newFolderName)
      setNewFolderName('')
      setSuccess('Folder created successfully!')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
    }
  }

  const handleRenameSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!renamingFolder) {
      setError('No folder selected for rename')
      return
    }
    if (!renameFolderName.trim()) {
      setError('New folder name cannot be empty')
      return
    }

    try {
      setError('')
      await renameFolderMutation.mutateAsync({ oldName: renamingFolder, newName: renameFolderName })
      setRenamingFolder(null)
      setRenameFolderName('')
      setSuccess('Folder renamed successfully!')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
    }
  }

  const handleDelete = async (folderName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${folderName}"? This cannot be undone.`)) {
      return
    }

    try {
      setError('')
      await deleteFolderMutation.mutateAsync(folderName)
      setSuccess('Folder deleted successfully!')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
    }
  }

  const handleToggleIgnore = (folderName: string) => {
    const updated = ignoredFolders.includes(folderName)
      ? ignoredFolders.filter((f) => f !== folderName)
      : [...ignoredFolders, folderName]
    onIgnoredFoldersChange(updated)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (renamingFolder) {
        setRenamingFolder(null)
        setRenameFolderName('')
      } else {
        onClose()
      }
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-11/12 max-h-[90vh] overflow-y-auto animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Manage Folders</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Create New Folder */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Create New Folder</h3>
          <form onSubmit={handleCreateSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={createFolderMutation.isPending}
              className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
            />
            <button
              type="submit"
              disabled={createFolderMutation.isPending}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg text-sm font-semibold hover:enabled:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {createFolderMutation.isPending ? 'Creating...' : 'Create'}
            </button>
          </form>
        </div>

        {/* Folders List */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            Folders ({folders.length})
          </h3>

          {folders.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">No folders yet. Create one above.</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {/* Rename Form */}
              {renamingFolder && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg mb-4">
                  <form onSubmit={handleRenameSubmit} className="flex gap-2 items-center">
                    <span className="text-sm font-medium text-gray-900 flex-1">Rename to:</span>
                    <input
                      type="text"
                      placeholder="New name"
                      value={renameFolderName}
                      onChange={(e) => setRenameFolderName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      disabled={renameFolderMutation.isPending}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-100 disabled:bg-gray-100 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={renameFolderMutation.isPending}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-sm font-semibold hover:enabled:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                      {renameFolderMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRenamingFolder(null)
                        setRenameFolderName('')
                      }}
                      disabled={renameFolderMutation.isPending}
                      className="px-3 py-1 bg-gray-300 text-gray-900 rounded text-sm font-semibold hover:enabled:bg-gray-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              )}

              {folders.map((folder) => (
                <div
                  key={folder}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    ignoredFolders.includes(folder)
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm font-medium text-gray-900 flex-1">{folder}</span>
                  <div className="flex gap-2 items-center">
                    {/* Hide/Show Button */}
                    <button
                      onClick={() => handleToggleIgnore(folder)}
                      className={`px-2 py-1 text-xs rounded font-semibold transition-colors ${
                        ignoredFolders.includes(folder)
                          ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      title={ignoredFolders.includes(folder) ? 'Show folder' : 'Hide folder'}
                    >
                      {ignoredFolders.includes(folder) ? '👁️' : '🙈'}
                    </button>

                    {/* Rename Button */}
                    <button
                      onClick={() => {
                        setRenamingFolder(folder)
                        setRenameFolderName('')
                        setError('')
                      }}
                      disabled={renamingFolder !== null}
                      className="px-2 py-1 text-xs rounded font-semibold bg-blue-200 text-blue-800 hover:enabled:bg-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      title="Rename folder"
                    >
                      ✏️
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(folder)}
                      disabled={deleteFolderMutation.isPending}
                      className="px-2 py-1 text-xs rounded font-semibold bg-red-200 text-red-800 hover:enabled:bg-red-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      title="Delete folder"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mt-6 text-red-700 bg-red-100 border border-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-6 text-green-700 bg-green-100 border border-green-400 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}
      </div>
    </div>
  )
}

export default FolderManagementModal
