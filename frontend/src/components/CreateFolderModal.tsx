import { useState, type FC, type FormEvent, type KeyboardEvent } from 'react'
import { toast } from 'sonner'
import { useCreateFolder } from '../services/api'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'

type CreateFolderModalProps = {
  onClose: () => void
}

const CreateFolderModal: FC<CreateFolderModalProps> = ({ onClose }) => {
  const [folderName, setFolderName] = useState('')
  const createFolderMutation = useCreateFolder()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!folderName.trim()) {
      toast.error('Folder name cannot be empty')
      return
    }

    try {
      await createFolderMutation.mutateAsync(folderName)
      setFolderName('')
      onClose()
      toast.success('Folder created successfully!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast.error(message)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-2xl font-bold">Create New Folder</h2>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Enter folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            disabled={createFolderMutation.isPending}
          />
          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              onClick={onClose}
              disabled={createFolderMutation.isPending}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createFolderMutation.isPending}
              className="flex-1"
            >
              {createFolderMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateFolderModal
