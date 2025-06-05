"use client"

const Input = ({ name, value, onChange, placeholder, type = "text", className = "", ...props }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-200 ${className}`}
      {...props}
    />
  )
}

export default Input
