import type { FC } from 'react'

type FolderListProps = {
  folders: string[]
  selectedFolders: string[]
  onToggleFolder: (folder: string) => void
}

const FolderList: FC<FolderListProps> = ({
  folders,
  selectedFolders,
  onToggleFolder,
}) => {
  return (
    <div className="flex max-h-[38vh] flex-col gap-2 overflow-hidden sm:max-h-[42vh]">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          Destination folders
        </h3>
        <p className="text-xs text-stone-500">{selectedFolders.length} selected</p>
      </div>

      {folders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-2 py-3 text-center">
          <p className="text-sm text-stone-500">No folders yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto pr-1">
          {folders.map((folder) => (
            <label
              key={folder}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent py-1 transition hover:border-white/60 hover:bg-white/60"
            >
              <input
                type="checkbox"
                checked={selectedFolders.includes(folder)}
                onChange={() => onToggleFolder(folder)}
                className="h-4 w-4 cursor-pointer rounded border-stone-300 text-stone-900 focus:ring-2 focus:ring-stone-300"
              />
              <span className="break-all text-sm font-medium text-stone-700">{folder}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default FolderList
