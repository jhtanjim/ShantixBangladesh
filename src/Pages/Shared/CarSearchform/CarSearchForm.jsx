"use client"

import { useState, useMemo } from "react"
import { Search, Filter, X, ChevronDown } from "lucide-react"
import SelectField from "../../../components/ui/SelectField"
import Button from "../../../components/ui/Button"
import Input from "../../../components/ui/input"

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

  // Generate dynamic options from API data
  const dynamicOptions = useMemo(() => {
    if (!allCars?.length) return {}

    const extractOptions = (field, sortNumeric = false) => {
      const values = allCars
        .map((car) => car[field])
        .filter((value) => value && value !== "")
        .filter((value, index, self) => self.indexOf(value) === index)

      if (sortNumeric) {
        values.sort((a, b) => Number(a) - Number(b))
      } else {
        values.sort()
      }

      return values.map((value) => ({
        value: value.toString(),
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
      year: extractOptions("year", true),
    }
  }, [allCars])

  // Filter models based on selected make
  const filteredModels = useMemo(() => {
    if (!searchParams.make || !allCars?.length) return dynamicOptions.model || []

    const models = allCars
      .filter((car) => car.make?.toLowerCase() === searchParams.make.toLowerCase())
      .map((car) => car.model)
      .filter((model) => model && model !== "")
      .filter((model, index, self) => self.indexOf(model) === index)
      .sort()

    return models.map((model) => ({ value: model, label: model }))
  }, [searchParams.make, allCars, dynamicOptions.model])

  // Filter model codes based on selected make and model
  const filteredModelCodes = useMemo(() => {
    if (!searchParams.make || !allCars?.length) return dynamicOptions.modelCode || []

    let filtered = allCars.filter((car) => car.make?.toLowerCase() === searchParams.make.toLowerCase())

    if (searchParams.model) {
      filtered = filtered.filter((car) => car.model?.toLowerCase() === searchParams.model.toLowerCase())
    }

    const modelCodes = filtered
      .map((car) => car.modelCode)
      .filter((code) => code && code !== "")
      .filter((code, index, self) => self.indexOf(code) === index)
      .sort()

    return modelCodes.map((code) => ({ value: code, label: code }))
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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(searchParams)
  }

  const handleReset = () => {
    const resetParams = Object.keys(searchParams).reduce((acc, key) => {
      acc[key] = ""
      return acc
    }, {})
    setSearchParams(resetParams)
    onSearch?.(resetParams)
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white py-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Car</h2>
          <p className="text-gray-600">Search through our extensive collection of quality vehicles</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              name="keywords"
              value={searchParams.keywords}
              onChange={(e) => handleChange("keywords", e.target.value)}
              placeholder="Search by keywords, make, model, features..."
              className="pl-12 py-4 text-lg"
            />
          </div>

          {/* Quick Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SelectField
              name="make"
              value={searchParams.make}
              onChange={(e) => handleChange("make", e.target.value)}
              options={dynamicOptions.make}
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
              options={dynamicOptions.year}
              placeholder="Year From"
            />
            <SelectField
              name="fuel"
              value={searchParams.fuel}
              onChange={(e) => handleChange("fuel", e.target.value)}
              options={dynamicOptions.fuel}
              placeholder="Fuel Type"
            />
          </div>

          {/* Advanced Filters Toggle */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center gap-2 px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <Filter size={16} />
              {showAdvanced ? "Hide" : "Show"} Advanced Filters
              <ChevronDown className={`transform transition-transform ${showAdvanced ? "rotate-180" : ""}`} size={16} />
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <SelectField
                  name="modelCode"
                  value={searchParams.modelCode}
                  onChange={(e) => handleChange("modelCode", e.target.value)}
                  options={filteredModelCodes}
                  placeholder="Model Code"
                />
                <SelectField
                  name="yearTo"
                  value={searchParams.yearTo}
                  onChange={(e) => handleChange("yearTo", e.target.value)}
                  options={dynamicOptions.year}
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
                <SelectField
                  name="type"
                  value={searchParams.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  options={dynamicOptions.type}
                  placeholder="Vehicle Type"
                />
                <SelectField
                  name="engineCC"
                  value={searchParams.engineCC}
                  onChange={(e) => handleChange("engineCC", e.target.value)}
                  options={dynamicOptions.engineCC}
                  placeholder="Engine CC"
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
                <SelectField
                  name="country"
                  value={searchParams.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  options={dynamicOptions.country}
                  placeholder="Country"
                />
                <SelectField
                  name="region"
                  value={searchParams.region}
                  onChange={(e) => handleChange("region", e.target.value)}
                  options={dynamicOptions.region}
                  placeholder="Region"
                />
                <SelectField
                  name="color"
                  value={searchParams.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                  options={dynamicOptions.color}
                  placeholder="Color"
                />
                <SelectField
                  name="drive"
                  value={searchParams.drive}
                  onChange={(e) => handleChange("drive", e.target.value)}
                  options={dynamicOptions.drive}
                  placeholder="Drive Type"
                />
                <SelectField
                  name="transmission"
                  value={searchParams.transmission}
                  onChange={(e) => handleChange("transmission", e.target.value)}
                  options={dynamicOptions.transmission}
                  placeholder="Transmission"
                />
                <SelectField
                  name="stock"
                  value={searchParams.stock}
                  onChange={(e) => handleChange("stock", e.target.value)}
                  options={dynamicOptions.stock}
                  placeholder="Stock"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button type="submit" className="px-8 py-3 flex items-center justify-center gap-2">
              <Search size={20} />
              Search Cars
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="px-8 py-3 flex items-center justify-center gap-2"
            >
              <X size={20} />
              Reset Filters
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CarSearchForm
