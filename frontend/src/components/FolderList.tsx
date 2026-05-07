import type { FC } from 'react'
import { Checkbox } from './ui/checkbox'
import type { FolderListLayout } from '../hooks/useLayoutSettings'

type FolderListProps = {
  folders: string[]
  selectedFolders: string[]
  onToggleFolder: (folder: string) => void
  totalCount?: number
  layout?: FolderListLayout
  imagesLeft?: number
  showImagesLeft?: boolean
}

const FolderList: FC<FolderListProps> = ({
  folders,
  selectedFolders,
  onToggleFolder,
  totalCount,
  layout = 'list',
  imagesLeft,
  showImagesLeft = false,
}) => {
  const displayTotalCount = totalCount ?? folders.length

  return (
    <div className={layout === 'horizontal' ? 'flex flex-col gap-3 overflow-hidden' : 'flex max-h-[38vh] flex-col gap-2 overflow-hidden sm:max-h-[42vh]'}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          Destination folders
        </h3>
        <div className="flex items-center gap-2">
          {showImagesLeft && imagesLeft !== undefined && (
            <p className="text-xs text-stone-400">{imagesLeft} image{imagesLeft !== 1 ? 's' : ''} left</p>
          )}
        </div>
      </div>

      {folders.length === 0 && displayTotalCount === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-2 py-3 text-center">
          <p className="text-sm text-stone-500">No folders yet. Create one to get started.</p>
        </div>
      ) : folders.length === 0 && displayTotalCount > 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-2 py-3 text-center">
          <p className="text-sm text-stone-500">All folders are hidden. Unhide some in folder management.</p>
        </div>
      ) : layout === 'horizontal' ? (
        <div className="flex flex-wrap gap-2">
          {folders.map((folder) => (
            <label
              key={folder}
              className="flex-1 flex cursor-pointer items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-1.5 transition hover:border-stone-400 hover:shadow-sm"
            >
              <Checkbox
                checked={selectedFolders.includes(folder)}
                onCheckedChange={() => onToggleFolder(folder)}
              />
              <span className="truncate text-xs font-medium text-stone-700">{folder}</span>
            </label>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto pr-1">
          {folders.map((folder) => (
            <label
              key={folder}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent px-3 py-1.5 transition hover:border-white/60 hover:bg-white/60"
            >
              <Checkbox
                checked={selectedFolders.includes(folder)}
                onCheckedChange={() => onToggleFolder(folder)}
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
