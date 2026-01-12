import { useEffect, useRef, useState } from "react"
import { FiUpload, FiX } from "react-icons/fi"
import FormError from "./form-error"
import { useMediaUpload } from "@/hooks/use-media-upload"

interface Props {
  value?: string | null
  onChange: (path: string | null) => void
  error?: string
}

export default function AvatarUpload({ value, onChange, error }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [preview, setPreview] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const {
    upload,
    remove,
    cancel,
    isUploading,
    error: uploadError,
  } = useMediaUpload()

  useEffect(() => {
    setPreview(value ?? null)
  }, [value])

  const openFileDialog = () => {
    if (!isUploading) {
      inputRef.current?.click()
    }
  }

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) return

    try {
      const path = await upload({
        file,
        key: "avatar",
        oldPath: value,
      })

      if (path) {
        onChange(path)
      }
    } catch {}
  }

  const handleDelete = async () => {
    if (!value) return
    await remove(value)
    onChange(null)
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Avatar (optional)
      </label>

      <div
        onClick={openFileDialog}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragActive(true)
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragActive(false)
          const file = e.dataTransfer.files?.[0]
          if (file) handleUpload(file)
        }}
        className={`
          flex items-center gap-4 p-4 border-2 rounded-sm transition
          ${isUploading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
          ${isDragActive ? "border-green-500 bg-green-50" : "border-dashed border-gray-300 hover:border-blue-500"}
        `}
      >
        {/* Avatar */}
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0">
          {preview ? (
            <>
              <img
                src={preview.startsWith("http") ? preview : `/storage/${preview}`}
                className="w-full h-full object-cover"
              />
              {!isUploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete()
                  }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                >
                  <FiX size={12} />
                </button>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <FiUpload className="text-gray-400 text-xl" />
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600">
          <p className="font-medium">
            {isUploading ? "Uploading…" : "Click or drag image"}
          </p>
          <p className="text-xs text-gray-400">
            JPG, PNG, WEBP
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          hidden
          accept="image/*"
          disabled={isUploading}
          onChange={(e) =>
            e.target.files && handleUpload(e.target.files[0])
          }
        />
      </div>

      {isUploading && (
        <button
          type="button"
          onClick={cancel}
          className="text-xs text-red-500 mt-1"
        >
          Cancel upload
        </button>
      )}

      <FormError message={error || uploadError} />
    </div>
  )
}
