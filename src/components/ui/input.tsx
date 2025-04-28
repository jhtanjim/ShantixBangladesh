import React from "react"

interface InputProps {
  id?: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
}

const Input: React.FC<InputProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => {
  return (
    <input
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      className="border p-2 w-full rounded bg-white"
    />
  )
}

export default Input
