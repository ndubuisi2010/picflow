interface Props {
  message?: string | null
}

export default function FormError({ message }: Props) {
  if (!message) return null

  return (
    <p className="mt-1 text-xs text-red-600 font-medium">
      {message}
    </p>
  )
}
