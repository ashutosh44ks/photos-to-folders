import type { FC } from 'react'

type FolderListProps = {
  folders: string[]
  selectedFolders: string[]
  onToggleFolder: (folder: string) => void
  onCreateFolder: () => void
}

const FolderList: FC<FolderListProps> = ({
  folders,
  selectedFolders,
  onToggleFolder,
  onCreateFolder,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center gap-4">
        <h3 className="text-xl font-semibold text-gray-900">Destination Folders</h3>
        <button
          onClick={onCreateFolder}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
        >
          + New Folder
        </button>
      </div>

      {folders.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600">No folders yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {folders.map((folder) => (
            <label
              key={folder}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedFolders.includes(folder)}
                onChange={() => onToggleFolder(folder)}
                className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-600 cursor-pointer"
              />
              <span className="text-gray-700 font-medium break-all">{folder}</span>
            </label>
          ))}
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-200 text-center">
        <p className="text-sm font-semibold text-gray-700">
          {selectedFolders.length} folder{selectedFolders.length !== 1 ? 's' : ''} selected
        </p>
      </div>
    </div>
  )
}

export default FolderList
