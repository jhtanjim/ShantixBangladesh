"use client"

import { Filter, X, Search, ChevronDown, ChevronUp } from "lucide-react"
import { useState, useEffect } from "react"

export default function CarSearchForm({ onSearch, allCars = [] }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
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

  // Predefined options for select fields
  const yearOptions = [
    { value: "", label: "Any Year" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
    { value: "2020", label: "2020" },
    { value: "2019", label: "2019" },
    { value: "2018", label: "2018" },
    { value: "2017", label: "2017" },
    { value: "2016", label: "2016" },
    { value: "2015", label: "2015" },
    { value: "2014", label: "2014" },
    { value: "2013", label: "2013" },
    { value: "2012", label: "2012" },
    { value: "2011", label: "2011" },
    { value: "2010", label: "2010" },
    { value: "2009", label: "2009" },
    { value: "2008", label: "2008" },
    { value: "2007", label: "2007" },
    { value: "2006", label: "2006" },
    { value: "2005", label: "2005" }
  ]

  const priceOptions = [
    { value: "", label: "Any Price" },
    { value: "5000", label: "$5,000" },
    { value: "10000", label: "$10,000" },
    { value: "15000", label: "$15,000" },
    { value: "20000", label: "$20,000" },
    { value: "25000", label: "$25,000" },
    { value: "30000", label: "$30,000" },
    { value: "35000", label: "$35,000" },
    { value: "40000", label: "$40,000" },
    { value: "45000", label: "$45,000" },
    { value: "50000", label: "$50,000" },
    { value: "60000", label: "$60,000" },
    { value: "70000", label: "$70,000" },
    { value: "80000", label: "$80,000" },
    { value: "100000", label: "$100,000" },
    { value: "150000", label: "$150,000" },
    { value: "200000", label: "$200,000+" }
  ]

  const mileageOptions = [
    { value: "", label: "Any Mileage" },
    { value: "5000", label: "5,000 km" },
    { value: "10000", label: "10,000 km" },
    { value: "15000", label: "15,000 km" },
    { value: "20000", label: "20,000 km" },
    { value: "30000", label: "30,000 km" },
    { value: "40000", label: "40,000 km" },
    { value: "50000", label: "50,000 km" },
    { value: "60000", label: "60,000 km" },
    { value: "70000", label: "70,000 km" },
    { value: "80000", label: "80,000 km" },
    { value: "100000", label: "100,000 km" },
    { value: "120000", label: "120,000 km" },
    { value: "150000", label: "150,000 km" },
    { value: "200000", label: "200,000 km" },
    { value: "250000", label: "250,000+ km" }
  ]

  // Extract unique values from allCars for dropdown options
  const getUniqueValues = (field) => {
    if (!allCars || allCars.length === 0) return []
    const values = allCars
      .map((car) => {
        if (field === "color") return car.exteriorColor
        return car[field]
      })
      .filter(Boolean)
      .map((value) => value.toString())
    return [...new Set(values)].sort()
  }

  const makes = getUniqueValues("make")
  const models = getUniqueValues("model")
  const types = getUniqueValues("type")
  const fuels = getUniqueValues("fuel")
  const countries = getUniqueValues("country")
  const regions = getUniqueValues("region")
  const colors = getUniqueValues("color")
  const drives = getUniqueValues("drive")
  const transmissions = getUniqueValues("transmission")

  const handleInputChange = (field, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSearch = () => {
    onSearch(searchParams)
    // Close filter on mobile after search
    if (window.innerWidth < 768) {
      setIsFilterOpen(false)
    }
  }

  const handleReset = () => {
    const resetParams = {
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
    }
    setSearchParams(resetParams)
    onSearch(resetParams)
  }

  // Close filter when clicking outside on mobile - Updated to be more specific
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterOpen && window.innerWidth < 1024) {
        // Only close if clicking on the background, not on form elements
        const searchContainer = document.querySelector(".search-form-container")
        const toggleButton = document.querySelector(".filter-toggle-button")
        
        if (searchContainer && !searchContainer.contains(event.target) && 
            toggleButton && !toggleButton.contains(event.target)) {
          setIsFilterOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isFilterOpen])

  // Auto-open filters on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsFilterOpen(true)
      } else {
        setIsFilterOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="bg-white shadow-lg relative w-full overflow-hidden search-form-container">
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden px-3 sm:px-4 py-3 border-b border-gray-200">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="filter-toggle-button w-full flex items-center justify-between bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
        >
          <div className="flex items-center gap-2">
            <Filter size={18} className="sm:w-5 sm:h-5" />
            <span className="font-medium">Search Filters</span>
          </div>
          {isFilterOpen ? (
            <ChevronUp size={18} className="sm:w-5 sm:h-5" />
          ) : (
            <ChevronDown size={18} className="sm:w-5 sm:h-5" />
          )}
        </button>
      </div>

      {/* Search Form */}
      <div className={`${isFilterOpen ? "block" : "hidden"} lg:block bg-white`}>
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          {/* Keywords Search - Always visible and prominent */}
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by keywords, make, model..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                value={searchParams.keywords}
                onChange={(e) => handleInputChange("keywords", e.target.value)}
              />
            </div>
          </div>

          {/* Filter Grid - Responsive layout */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Make */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">Make</label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.make}
                onChange={(e) => handleInputChange("make", e.target.value)}
              >
                <option value="">All Makes</option>
                {makes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">Model</label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
              >
                <option value="">All Models</option>
                {models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Code */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Model Code
              </label>
              <input
                type="text"
                placeholder="e.g., XV70"
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm"
                value={searchParams.modelCode}
                onChange={(e) => handleInputChange("modelCode", e.target.value)}
              />
            </div>

            {/* Type */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">Type</label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
              >
                <option value="">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Year From */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Year From
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.yearFrom}
                onChange={(e) => handleInputChange("yearFrom", e.target.value)}
              >
                <option value="">From Year</option>
                {yearOptions.slice(1).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Year To */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Year To
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.yearTo}
                onChange={(e) => handleInputChange("yearTo", e.target.value)}
              >
                <option value="">To Year</option>
                {yearOptions.slice(1).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price From */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Price From
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.priceFrom}
                onChange={(e) => handleInputChange("priceFrom", e.target.value)}
              >
                <option value="">Min Price</option>
                {priceOptions.slice(1).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price To */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Price To
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.priceTo}
                onChange={(e) => handleInputChange("priceTo", e.target.value)}
              >
                <option value="">Max Price</option>
                {priceOptions.slice(1).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Engine CC */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Engine CC
              </label>
              <input
                type="number"
                placeholder="2500"
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm"
                value={searchParams.engineCC}
                onChange={(e) => handleInputChange("engineCC", e.target.value)}
              />
            </div>

            {/* Fuel */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Fuel Type
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.fuel}
                onChange={(e) => handleInputChange("fuel", e.target.value)}
              >
                <option value="">All Fuel Types</option>
                {fuels.map((fuel) => (
                  <option key={fuel} value={fuel}>
                    {fuel}
                  </option>
                ))}
              </select>
            </div>

            {/* Mileage From */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Mileage From
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.mileageFrom}
                onChange={(e) => handleInputChange("mileageFrom", e.target.value)}
              >
                <option value="">Min Mileage</option>
                {mileageOptions.slice(1).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mileage To */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Mileage To
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.mileageTo}
                onChange={(e) => handleInputChange("mileageTo", e.target.value)}
              >
                <option value="">Max Mileage</option>
                {mileageOptions.slice(1).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Country
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Region */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">Region</label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.region}
                onChange={(e) => handleInputChange("region", e.target.value)}
              >
                <option value="">All Regions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">Color</label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
              >
                <option value="">All Colors</option>
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            {/* Drive */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">Drive</label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.drive}
                onChange={(e) => handleInputChange("drive", e.target.value)}
              >
                <option value="">All Drive Types</option>
                {drives.map((drive) => (
                  <option key={drive} value={drive}>
                    {drive}
                  </option>
                ))}
              </select>
            </div>

            {/* Transmission */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Transmission
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.transmission}
                onChange={(e) => handleInputChange("transmission", e.target.value)}
              >
                <option value="">All Transmissions</option>
                {transmissions.map((transmission) => (
                  <option key={transmission} value={transmission}>
                    {transmission}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Stock Status
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
              >
                <option value="">All Stock Status</option>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 justify-center">
            <button
              onClick={handleSearch}
              className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Search size={16} className="sm:w-5 sm:h-5" />
              Search Cars
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <X size={16} className="sm:w-5 sm:h-5" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay - Removed as it was interfering with form interactions */}
    </div>
  )
}