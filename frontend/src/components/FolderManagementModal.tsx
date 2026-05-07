import { useState, type FC, type FormEvent, type KeyboardEvent } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'
import { useCreateFolder, useRenameFolder, useDeleteFolder } from '../services/api'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Checkbox } from './ui/checkbox'

type FolderManagementModalProps = {
  folders: string[]
  ignoredFolders: string[]
  onClose: () => void
  onIgnoredFoldersChange: (ignored: string[]) => void
  folderListLayout?: 'list' | 'horizontal'
  onLayoutChange?: (layout: 'list' | 'horizontal') => void
  showImagesLeft?: boolean
  onShowImagesLeftChange?: (show: boolean) => void
}

const FolderManagementModal: FC<FolderManagementModalProps> = ({
  folders,
  ignoredFolders,
  onClose,
  onIgnoredFoldersChange,
  folderListLayout = 'list',
  onLayoutChange,
  showImagesLeft = false,
  onShowImagesLeftChange,
}) => {
  const [newFolderName, setNewFolderName] = useState('')
  const [renamingFolder, setRenamingFolder] = useState<string | null>(null)
  const [renameFolderName, setRenameFolderName] = useState('')

  const createFolderMutation = useCreateFolder()
  const renameFolderMutation = useRenameFolder()
  const deleteFolderMutation = useDeleteFolder()

  const handleCreateSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newFolderName.trim()) {
      toast.error('Folder name cannot be empty')
      return
    }

    try {
      await createFolderMutation.mutateAsync(newFolderName)
      setNewFolderName('')
      toast.success('Folder created successfully!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast.error(message)
    }
  }

  const handleRenameSubmit = async () => {
    if (!renamingFolder) {
      toast.error('No folder selected for rename')
      return
    }
    if (!renameFolderName.trim()) {
      toast.error('New folder name cannot be empty')
      return
    }

    try {
      await renameFolderMutation.mutateAsync({ oldName: renamingFolder, newName: renameFolderName })
      setRenamingFolder(null)
      setRenameFolderName('')
      toast.success('Folder renamed successfully!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast.error(message)
    }
  }

  const handleDelete = async (folderName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${folderName}"? This cannot be undone.`)) {
      return
    }

    try {
      await deleteFolderMutation.mutateAsync(folderName)
      toast.success('Folder deleted successfully!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast.error(message)
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <h2 className="text-2xl font-bold">Manage Folders</h2>
        </DialogHeader>

        {/* Create New Folder */}
        <div>
          <h3 className="font-semibold mb-3">Create New Folder</h3>
          <form onSubmit={handleCreateSubmit} className="flex gap-2">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={createFolderMutation.isPending}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={createFolderMutation.isPending}
            >
              {createFolderMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </form>
        </div>
        <Separator />

        {/* Display Settings */}
        <div>
          <h3 className="font-semibold mb-4">Display Settings</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-stone-600 mb-2">Folder List Layout</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => onLayoutChange?.('list')}
                  variant={folderListLayout === 'list' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                >
                  List
                </Button>
                <Button
                  onClick={() => onLayoutChange?.('horizontal')}
                  variant={folderListLayout === 'horizontal' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                >
                  Horizontal
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="show-images-left"
                checked={showImagesLeft}
                onCheckedChange={() => onShowImagesLeftChange?.(!showImagesLeft)}
              />
              <label htmlFor="show-images-left" className="text-sm cursor-pointer">
                Show images left to process
              </label>
            </div>
          </div>
        </div>
        <Separator />

        {/* Folders List */}
        <div>
          <h3 className="font-semibold mb-3">
            Folders ({folders.length})
          </h3>

          {folders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No folders yet. Create one above.</p>
          ) : (
            <div className="space-y-2 max-h-100 overflow-y-auto">
              {folders.map((folder) => (
                <div
                  key={folder}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg border ${
                    ignoredFolders.includes(folder)
                      ? 'border-red-200 dark:bg-red-900/10 dark:border-red-800 bg-red-600/25'
                      : 'border-border hover:border-foreground/20'
                  }`}
                >
                  {renamingFolder === folder ? (
                    <>
                      <Input
                        placeholder="New name"
                        value={renameFolderName}
                        onChange={(e) => setRenameFolderName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        disabled={renameFolderMutation.isPending}
                        className="flex-1 mr-2"
                      />
                      <div className="flex gap-2 items-center">
                        <Button
                          onClick={handleRenameSubmit}
                          size="sm"
                          disabled={renameFolderMutation.isPending}
                        >
                          {renameFolderMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setRenamingFolder(null)
                            setRenameFolderName('')
                          }}
                          disabled={renameFolderMutation.isPending}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-medium flex-1">{folder}</span>
                      <div className="flex gap-2 items-center">
                        {/* Hide/Show Button */}
                        <Button
                          onClick={() => handleToggleIgnore(folder)}
                          size="icon-sm"
                          variant="ghost"
                          title={ignoredFolders.includes(folder) ? 'Show folder' : 'Hide folder'}
                        >
                          {ignoredFolders.includes(folder) ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>

                        {/* Rename Button */}
                        <Button
                          onClick={() => {
                            setRenamingFolder(folder)
                            setRenameFolderName('')
                          }}
                          disabled={renamingFolder !== null}
                          size="icon-sm"
                          variant="ghost"
                          title="Rename folder"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          onClick={() => handleDelete(folder)}
                          disabled={deleteFolderMutation.isPending}
                          size="icon-sm"
                          variant="destructive"
                          title="Delete folder"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FolderManagementModal
