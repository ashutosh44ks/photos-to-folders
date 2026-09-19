import type { FC } from 'react'
import { Checkbox } from './ui/checkbox'
import { Kbd } from './ui/kbd'
import type { FolderListLayout } from '../hooks/useLayoutSettings'

type FolderListProps = {
  folders: string[]
  selectedFolders: string[]
  onToggleFolder: (folder: string) => void
  totalCount?: number
  layout?: FolderListLayout
  imagesLeft?: number
  showImagesLeft?: boolean
  onEmptyStateClick?: () => void
}

type FolderListBodyProps = {
  folders: string[]
  selectedFolders: string[]
  onToggleFolder: (folder: string) => void
  displayTotalCount: number
  layout: FolderListLayout
  onEmptyStateClick?: () => void
}

const FolderListBody: FC<FolderListBodyProps> = ({
  folders,
  selectedFolders,
  onToggleFolder,
  displayTotalCount,
  layout,
  onEmptyStateClick,
}) => {
  if (folders.length === 0 && displayTotalCount === 0) {
    return (
      <button
        type="button"
        onClick={onEmptyStateClick}
        className="w-full rounded-2xl border border-dashed border-border bg-muted/50 px-2 py-3 text-center transition hover:border-foreground/20 hover:bg-muted"
      >
        <p className="text-sm text-muted-foreground">No folders yet. Create one to get started.</p>
      </button>
    )
  }

  if (folders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/50 px-2 py-3 text-center">
        <p className="text-sm text-muted-foreground">
          All folders are hidden. Unhide some in folder management.
        </p>
      </div>
    )
  }

  if (layout === 'horizontal') {
    return (
      <div className="flex flex-wrap gap-2">
        {folders.map((folder, index) => (
          <label
            key={folder}
            className="flex flex-1 cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 transition hover:border-foreground/30 hover:shadow-sm"
          >
            <Checkbox
              checked={selectedFolders.includes(folder)}
              onCheckedChange={() => onToggleFolder(folder)}
            />
            <div className="flex items-center gap-2">
              <span className="truncate text-xs font-medium text-foreground">{folder}</span>
              {index < 9 && <Kbd>{index + 1}</Kbd>}
            </div>
          </label>
        ))}
      </div>
    )
  }

  if (layout === 'vertical') {
    return (
      <div className="flex flex-col gap-2 overflow-y-auto pr-1">
        {folders.map((folder, index) => (
          <label
            key={folder}
            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-background px-3 py-1.5 transition hover:border-foreground/30 hover:shadow-sm"
          >
            <Checkbox
              checked={selectedFolders.includes(folder)}
              onCheckedChange={() => onToggleFolder(folder)}
            />
            <div className="flex w-full items-center gap-2">
              <span className="break-all text-sm font-medium text-foreground">{folder}</span>
              {index < 9 && <Kbd className="ml-auto">{index + 1}</Kbd>}
            </div>
          </label>
        ))}
      </div>
    )
  }
}

const FolderList: FC<FolderListProps> = ({
  folders,
  selectedFolders,
  onToggleFolder,
  totalCount,
  layout = 'vertical',
  imagesLeft,
  showImagesLeft = false,
  onEmptyStateClick,
}) => {
  const displayTotalCount = totalCount ?? folders.length

  return (
    <div
      className={
        layout === 'horizontal'
          ? 'flex flex-col gap-3 overflow-hidden'
          : 'flex max-h-[38vh] flex-col gap-2 overflow-hidden sm:max-h-[42vh]'
      }
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Destination folders
        </h3>
        {showImagesLeft && imagesLeft !== undefined && (
          <p className="text-xs text-muted-foreground">
            {imagesLeft} image{imagesLeft !== 1 ? 's' : ''} left
          </p>
        )}
      </div>
      <FolderListBody
        folders={folders}
        selectedFolders={selectedFolders}
        onToggleFolder={onToggleFolder}
        displayTotalCount={displayTotalCount}
        layout={layout}
        onEmptyStateClick={onEmptyStateClick}
      />
    </div>
  )
}

export default FolderList
