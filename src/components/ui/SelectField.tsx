import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id?: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const SelectField = ({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  className = "",
}: SelectFieldProps) => (
  <select
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    disabled={disabled}
    className={`border border-gray-300 p-2 w-full rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className}`}
  >
    {placeholder && (
      <option value="" disabled hidden>
        {placeholder}
      </option>
    )}
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export default SelectField;
