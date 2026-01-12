import { IconType } from "react-icons"
import FormError from "./form-error"

interface Props {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  icon?: IconType
  error?: string
}

export default function TextInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  error,
}: Props) {
  return (
    <div className="relative">
      <label className="text-[13px] bg-white text-slate-900 font-medium absolute px-2 -top-2 left-4">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-4 py-3.5 pr-10 w-full text-sm bg-white rounded-sm outline-none border-2
          ${error ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}
        `}
      />

      {Icon && (
        <Icon
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
      )}

      <FormError message={error} />
    </div>
  )
}
