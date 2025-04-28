import React from "react"

interface Option {
  value: string
  label: string
}

interface SelectFieldProps {
  id?: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: Option[]
  placeholder?: string
}

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
}) => {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 p-2 w-full rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default SelectField