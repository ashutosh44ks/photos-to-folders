import { useState, type FC, type FormEvent, type KeyboardEvent } from 'react'
import { useCreateFolder } from '../services/api'

type CreateFolderModalProps = {
  onClose: () => void
}

const CreateFolderModal: FC<CreateFolderModalProps> = ({ onClose }) => {
  const [folderName, setFolderName] = useState('')
  const [error, setError] = useState('')
  const createFolderMutation = useCreateFolder()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!folderName.trim()) {
      setError('Folder name cannot be empty')
      return
    }

    try {
      setError('')
      await createFolderMutation.mutateAsync(folderName)
      setFolderName('')
      onClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-11/12 animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Folder</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            disabled={createFolderMutation.isPending}
            className="px-4 py-3 border-2 border-gray-300 rounded-lg font-base font-family-inherit focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-100 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
          />
          {error && (
            <div className="text-red-700 bg-red-100 border border-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={createFolderMutation.isPending}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createFolderMutation.isPending}
              className="flex-1 px-4 py-3 bg-linear-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold hover:enabled:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {createFolderMutation.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateFolderModal
