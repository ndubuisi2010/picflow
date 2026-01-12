import { useState } from "react"
import { FiEye, FiEyeOff } from "react-icons/fi"
import FormError from "./form-error"

interface Props {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

export default function PasswordInput({
  label,
  name,
  value,
  onChange,
  error,
}: Props) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <label className="text-[13px] bg-white text-slate-900 font-medium absolute px-2 -top-2 left-4">
        {label}
      </label>

      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete="new-password"
        className={`px-4 py-3.5 pr-10 w-full text-sm bg-white rounded-sm outline-none border-2
          ${error ? "border-red-500" : "border-gray-200 focus:border-blue-500"}
        `}
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
      >
        {show ? <FiEyeOff /> : <FiEye />}
      </button>

      <FormError message={error} />
    </div>
  )
}
