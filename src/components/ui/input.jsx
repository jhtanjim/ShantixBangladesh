export default function Input({
  id,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
  ...props
}) {
  return (
    <input
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${className}`}
      {...props}
    />
  )
}
