import { Dialog, DialogContent } from "@/components/ui/dialog"
import { getFileIcon } from "@/components/form/file-preview"
import { UploadItem } from "@/types/upload"

interface Props {
  open: boolean
  item: UploadItem | null
  onClose: () => void
}

export default function FilePreviewModal({ open, item, onClose }: Props) {
  if (!item) return null

  const isImage = item.type.startsWith("image/")
  const Icon = getFileIcon(item.type, item.name)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <div className="flex flex-col items-center gap-4">
          {isImage ? (
            <img
              src={URL.createObjectURL(item.file)}
              alt={item.name}
              className="max-h-[400px] rounded"
            />
          ) : (
            <Icon className="text-6xl text-gray-500" />
          )}

          <p className="text-sm text-gray-700">{item.name}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
