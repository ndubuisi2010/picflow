import { useState } from "react"
import {
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface FilePreviewProps {
  url: string
}

function getExtension(url: string) {
  const cleanUrl = url.split("?")[0]
  return cleanUrl.split(".").pop()?.toLowerCase()
}

export default function FilePreview({ url }: FilePreviewProps) {
  const [open, setOpen] = useState(false)
  const ext = getExtension(url)

  if (!ext) return null

  /* -----------------------------
   Inline (table) preview
  ----------------------------- */
  const renderThumbnail = () => {
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      return (
        <img
          src={url}
          className="h-12 w-12 object-cover rounded cursor-pointer"
          onClick={() => setOpen(true)}
        />
      )
    }

    if (["mp4", "webm", "mov"].includes(ext)) {
      return <FileVideo className="w-10 h-10 text-purple-500" />
    }

    if (ext === "pdf") {
      return <FileText className="w-10 h-10 text-red-500" />
    }

    if (["csv", "xls", "xlsx"].includes(ext)) {
      return <FileText className="w-10 h-10 text-green-600" />
    }

    if (["doc", "docx", "ppt", "pptx"].includes(ext)) {
      return <FileText className="w-10 h-10 text-blue-600" />
    }

    if (["zip", "rar", "7z"].includes(ext)) {
      return <FileArchive className="w-10 h-10 text-yellow-600" />
    }

    return <FileText className="w-10 h-10 text-gray-500" />
  }

  /* -----------------------------
   Modal full preview
  ----------------------------- */
  const renderPreview = () => {
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      return <img src={url} className="max-h-[80vh] mx-auto rounded" />
    }

    if (["mp4", "webm", "mov"].includes(ext)) {
      return (
        <video
          src={url}
          controls
          className="max-h-[80vh] mx-auto rounded"
        />
      )
    }

    if (ext === "pdf") {
      return (
        <iframe
          src={url}
          className="w-full h-[80vh] rounded"
        />
      )
    }

    return (
      <div className="text-center space-y-4">
        <FileText className="mx-auto w-16 h-16 text-gray-500" />
        <a
          href={url}
          target="_blank"
          className="text-blue-600 underline"
        >
          Download file
        </a>
      </div>
    )
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{renderThumbnail()}</div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          {renderPreview()}
        </DialogContent>
      </Dialog>
    </>
  )
}
