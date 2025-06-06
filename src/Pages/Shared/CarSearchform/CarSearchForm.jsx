"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, X, Filter, ChevronDown, ChevronUp } from "lucide-react"

const CarSearchForm = ({ onSearch, allCars = [] }) => {
  const [searchParams, setSearchParams] = useState({
    make: "",
    model: "",
    modelCode: "",
    yearFrom: "",
    yearTo: "",
    priceFrom: "",
    priceTo: "",
    type: "",
    engineCC: "",
    fuel: "",
    mileageFrom: "",
    mileageTo: "",
    country: "",
    region: "",
    color: "",
    drive: "",
    transmission: "",
    stock: "",
    keywords: "",
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  // Generate dynamic options from real car data
  const dynamicOptions = useMemo(() => {
    if (!allCars.length) return {}

    const extractOptions = (field, sortNumeric = false) => {
      const values = allCars
        .map((car) => car[field])
        .filter((value) => value && value !== "" && value !== null && value !== undefined)
        .filter((value, index, self) => self.indexOf(value) === index)

      if (sortNumeric) {
        values.sort((a, b) => Number(a) - Number(b))
      } else {
        values.sort()
      }

      return values.map((value) => ({
        value: value.toString().toLowerCase(),
        label: value.toString(),
      }))
    }

    return {
      make: extractOptions("make"),
      model: extractOptions("model"),
      modelCode: extractOptions("modelCode"),
      type: extractOptions("type"),
      fuel: extractOptions("fuel"),
      country: extractOptions("country"),
      region: extractOptions("region"),
      color: extractOptions("exteriorColor"),
      drive: extractOptions("drive"),
      transmission: extractOptions("transmission"),
      stock: extractOptions("stock"),
      engineCC: extractOptions("engineCC", true),
    }
  }, [allCars])

  // Generate year options from car data
  const yearOptions = useMemo(() => {
    if (!allCars.length) return []
    const years = [...new Set(allCars.map((car) => car.year).filter(Boolean))].sort((a, b) => b - a)
    return years.map((year) => ({ value: year.toString(), label: year.toString() }))
  }, [allCars])

  // Filter models based on selected make
  const filteredModels = useMemo(() => {
    if (!searchParams.make || !allCars.length) return dynamicOptions.model || []

    const models = allCars
      .filter((car) => car.make?.toLowerCase() === searchParams.make.toLowerCase())
      .map((car) => car.model)
      .filter((model) => model && model !== "")
      .filter((model, index, self) => self.indexOf(model) === index)
      .sort()

    return models.map((model) => ({ value: model.toLowerCase(), label: model }))
  }, [searchParams.make, allCars, dynamicOptions.model])

  // Filter model codes based on selected make and model
  const filteredModelCodes = useMemo(() => {
    if (!searchParams.make || !allCars.length) return dynamicOptions.modelCode || []

    let filtered = allCars.filter((car) => car.make?.toLowerCase() === searchParams.make.toLowerCase())

    if (searchParams.model) {
      filtered = filtered.filter((car) => car.model?.toLowerCase() === searchParams.model.toLowerCase())
    }

    const modelCodes = filtered
      .map((car) => car.modelCode)
      .filter((code) => code && code !== "")
      .filter((code, index, self) => self.indexOf(code) === index)
      .sort()

    return modelCodes.map((code) => ({ value: code.toLowerCase(), label: code }))
  }, [searchParams.make, searchParams.model, allCars, dynamicOptions.modelCode])

  const handleChange = (name, value) => {
    const updated = { ...searchParams, [name]: value }

    // Reset dependent fields
    if (name === "make") {
      updated.model = ""
      updated.modelCode = ""
    } else if (name === "model") {
      updated.modelCode = ""
    }

    setSearchParams(updated)
  }

  const handleReset = () => {
    const resetParams = Object.keys(searchParams).reduce((acc, key) => {
      acc[key] = ""
      return acc
    }, {})
    setSearchParams(resetParams)
    onSearch(resetParams)
  }

  // Auto-search when params change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchParams)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchParams, onSearch])

  const SelectField = ({ name, value, onChange, options = [], placeholder, className = "" }) => (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-sm ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )

  const Input = ({ name, value, onChange, placeholder, type = "text", className = "" }) => (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm ${className}`}
    />
  )

  return (
    <div className="bg-white shadow-lg border-b sticky top-0 z-30">
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-4">
          {/* Main Search Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            <SelectField
              name="make"
              value={searchParams.make}
              onChange={(e) => handleChange("make", e.target.value)}
              options={dynamicOptions.make || []}
              placeholder="Select Make"
            />
            <SelectField
              name="model"
              value={searchParams.model}
              onChange={(e) => handleChange("model", e.target.value)}
              options={filteredModels}
              placeholder="Select Model"
            />
            <SelectField
              name="yearFrom"
              value={searchParams.yearFrom}
              onChange={(e) => handleChange("yearFrom", e.target.value)}
              options={yearOptions}
              placeholder="Year From"
            />
            <SelectField
              name="yearTo"
              value={searchParams.yearTo}
              onChange={(e) => handleChange("yearTo", e.target.value)}
              options={yearOptions}
              placeholder="Year To"
            />
            <Input
              name="priceFrom"
              value={searchParams.priceFrom}
              onChange={(e) => handleChange("priceFrom", e.target.value)}
              placeholder="Price From"
              type="number"
            />
            <Input
              name="priceTo"
              value={searchParams.priceTo}
              onChange={(e) => handleChange("priceTo", e.target.value)}
              placeholder="Price To"
              type="number"
            />
          </div>

          {/* Keywords Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                name="keywords"
                value={searchParams.keywords}
                onChange={(e) => handleChange("keywords", e.target.value)}
                placeholder="Search by keywords (make, model, features...)"
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
              >
                <Filter size={16} />
                Advanced
                {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
              >
                <X size={16} />
                Reset
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                <SelectField
                  name="modelCode"
                  value={searchParams.modelCode}
                  onChange={(e) => handleChange("modelCode", e.target.value)}
                  options={filteredModelCodes}
                  placeholder="Model Code"
                />
                <SelectField
                  name="type"
                  value={searchParams.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  options={dynamicOptions.type || []}
                  placeholder="Vehicle Type"
                />
                <SelectField
                  name="fuel"
                  value={searchParams.fuel}
                  onChange={(e) => handleChange("fuel", e.target.value)}
                  options={dynamicOptions.fuel || []}
                  placeholder="Fuel Type"
                />
                <SelectField
                  name="transmission"
                  value={searchParams.transmission}
                  onChange={(e) => handleChange("transmission", e.target.value)}
                  options={dynamicOptions.transmission || []}
                  placeholder="Transmission"
                />
                <SelectField
                  name="color"
                  value={searchParams.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                  options={dynamicOptions.color || []}
                  placeholder="Color"
                />
                <SelectField
                  name="drive"
                  value={searchParams.drive}
                  onChange={(e) => handleChange("drive", e.target.value)}
                  options={dynamicOptions.drive || []}
                  placeholder="Drive Type"
                />
                <Input
                  name="mileageFrom"
                  value={searchParams.mileageFrom}
                  onChange={(e) => handleChange("mileageFrom", e.target.value)}
                  placeholder="Mileage From"
                  type="number"
                />
                <Input
                  name="mileageTo"
                  value={searchParams.mileageTo}
                  onChange={(e) => handleChange("mileageTo", e.target.value)}
                  placeholder="Mileage To"
                  type="number"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CarSearchForm
