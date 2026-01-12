import { useCallback, useEffect, useRef, useState } from "react"
import axios from "axios"
import { Upload, Trash2, RefreshCw } from "lucide-react"
import FilePreview from "./file-preview"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

type UploadStatus = "pending" | "uploading" | "done" | "error"

type UploadItem = {
  id: string
  file: File
  progress: number
  status: UploadStatus
  url?: string
  error?: string
}

interface FileUploadProps {
  uploadUrl: string
  value?: string[] | string | null
  multiple?: boolean
  accept?: string[]
  onChange: (value: string[] | string | null) => void
}

export default function FileUpload({
  uploadUrl,
  value,
  multiple = false,
  accept,
  onChange,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [items, setItems] = useState<UploadItem[]>([])
  const [isDragging, setIsDragging] = useState(false)

  /* ---------------------------------------------
   Sync initial value from parent (URLs only)
  --------------------------------------------- */
  useEffect(() => {
    if (!value) return

    const urls = Array.isArray(value) ? value : [value]

    setItems((prev) => {
      if (prev.some((i) => i.status !== "done")) return prev
      return []
    })

    urls.forEach((url) => {
      setItems((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          file: new File([], url),
          progress: 100,
          status: "done",
          url,
        },
      ])
    })
  }, [])

  /* ---------------------------------------------
   Helpers
  --------------------------------------------- */
  const emitChange = (updated: UploadItem[]) => {
    const urls = updated.filter(i => i.status === "done").map(i => i.url!)
    onChange(multiple ? urls : urls[0] ?? null)
  }

  const validateFile = (file: File) => {
    if (!accept) return true
    const ext = file.name.split(".").pop()?.toLowerCase()
    return ext && accept.includes(ext)
  }

  /* ---------------------------------------------
   File selection
  --------------------------------------------- */
  const addFiles = (files: FileList | null) => {
    if (!files) return

    const incoming = Array.from(files)
      .filter(validateFile)
      .map<UploadItem>((file) => ({
        id: crypto.randomUUID(),
        file,
        progress: 0,
        status: "pending",
      }))

    setItems((prev) => {
      if (!multiple) return incoming.slice(0, 1)
      return [...prev, ...incoming]
    })
  }

  /* ---------------------------------------------
   Chunk upload engine
  --------------------------------------------- */
  const uploadFile = async (item: UploadItem) => {
    try {
      setItems(prev =>
        prev.map(i => i.id === item.id ? { ...i, status: "uploading" } : i)
      )

      const init = await axios.post(`${uploadUrl}/init`, {
        filename: item.file.name,
        size: item.file.size,
        mime: item.file.type,
        key: "avatar",
        replace: !multiple,
        old_path: !multiple && typeof value === "string" ? value : null,
      })

      const { upload_id, chunk_size } = init.data
      const totalChunks = Math.ceil(item.file.size / chunk_size)

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunk_size
        const end = Math.min(start + chunk_size, item.file.size)

        const form = new FormData()
        form.append("upload_id", upload_id)
        form.append("chunk_index", String(i))
        form.append("total_chunks", String(totalChunks))
        form.append("file", item.file.slice(start, end))

        await axios.post(`${uploadUrl}/chunk`, form)

        setItems(prev =>
          prev.map(f =>
            f.id === item.id
              ? { ...f, progress: Math.round(((i + 1) / totalChunks) * 100) }
              : f
          )
        )
      }

      const complete = await axios.post(`${uploadUrl}/complete`, { upload_id,  filename: item.file.name, total_chunks: totalChunks})

      setItems(prev => {
        const updated = prev.map(f =>
          f.id === item.id
            ? { ...f, status: "done", url: complete.data.url }
            : f
        )
        emitChange(updated)
        return updated
      })
    } catch (err) {
      setItems(prev =>
        prev.map(f =>
          f.id === item.id ? { ...f, status: "error", error: "Upload failed" } : f
        )
      )
    }
  }

  /* ---------------------------------------------
   Effects
  --------------------------------------------- */
  useEffect(() => {
    items
      .filter(i => i.status === "pending")
      .forEach(uploadFile)
  }, [items])

  /* ---------------------------------------------
   Remove / retry
  --------------------------------------------- */
  const removeItem = async (id: string) => {
    const target = items.find(i => i.id === id)
    if (target?.url) {
      await axios.delete(`${uploadUrl}/file`, { data: { path: target.url } })
    }

    setItems(prev => {
      const updated = prev.filter(i => i.id !== id)
      emitChange(updated)
      return updated
    })
  }

  const retry = (id: string) => {
    setItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, status: "pending", progress: 0 } : i
      )
    )
  }

  /* ---------------------------------------------
   Render
  --------------------------------------------- */
  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          addFiles(e.dataTransfer.files)
        }}
        className={`border-2 border-dashed rounded-md p-6 cursor-pointer transition
          ${isDragging ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-blue-500"}
        `}
      >
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Upload />
          <span>Click or drag files here to upload</span>
        </div>

        <input
          ref={inputRef}
          type="file"
          hidden
          multiple={multiple}
          accept={accept?.map(a => `.${a}`).join(",")}
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* Upload table */}
      {items.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Preview</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.url
                    ? <FilePreview url={item.url} />
                    : <Skeleton className="h-12 w-12 rounded" />}
                </TableCell>

                <TableCell className="w-48">
                  <Progress value={item.progress} />
                </TableCell>

                <TableCell>
                  {item.status}
                </TableCell>

                <TableCell className="flex gap-2">
                  {item.status === "error" && (
                    <Button size="icon" variant="ghost" onClick={() => retry(item.id)}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  )}

                  <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
