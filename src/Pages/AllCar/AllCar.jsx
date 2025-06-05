import { useState, useEffect, useMemo } from "react"
import { Grid, List, ShoppingCart, Filter, SortAsc } from 'lucide-react'

import Input from "../../components/ui/input"
import Button from "../../components/ui/Button"
import { useShop } from "../../Context/ShopContext"

import SelectField from "../../components/ui/SelectField"
import { useAllCars } from "../../hooks/useCars"
import CarSearchForm from "../Shared/CarSearchform/CarSearchForm"
import CarCard from "../../components/ui/carCard"

export default function AllCars() {
  const { cartCount } = useShop()

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

  const [currentPage, setCurrentPage] = useState(1)
  const [viewType, setViewType] = useState("grid")
  const [sortBy, setSortBy] = useState("default")
  const [showFilters, setShowFilters] = useState(true)
  const [itemsPerPage] = useState(10)

  // Get all cars data
  const { data: allCars = [], isLoading, isError } = useAllCars()
console.log(allCars)
  // Filter and sort cars based on search parameters
  const filteredAndSortedCars = useMemo(() => {
    if (!allCars.length) return []

    let filtered = allCars.filter(car => {
      // Title/Keywords search
      if (searchParams.keywords) {
        const keywords = searchParams.keywords.toLowerCase()
        const titleMatch = car.title?.toLowerCase().includes(keywords)
        const makeMatch = car.make?.toLowerCase().includes(keywords)
        const modelMatch = car.model?.toLowerCase().includes(keywords)
        const featuresMatch = car.features?.some(feature => 
          feature.name?.toLowerCase().includes(keywords)
        )
        if (!titleMatch && !makeMatch && !modelMatch && !featuresMatch) {
          return false
        }
      }

      // Make filter
      if (searchParams.make && car.make?.toLowerCase() !== searchParams.make.toLowerCase()) {
        return false
      }

      // Model filter
      if (searchParams.model && car.model?.toLowerCase() !== searchParams.model.toLowerCase()) {
        return false
      }

      // Model Code filter
      if (searchParams.modelCode && car.modelCode?.toLowerCase() !== searchParams.modelCode.toLowerCase()) {
        return false
      }

      // Year range filter
      if (searchParams.yearFrom && car.year < parseInt(searchParams.yearFrom)) {
        return false
      }
      if (searchParams.yearTo && car.year > parseInt(searchParams.yearTo)) {
        return false
      }

      // Price range filter
      if (searchParams.priceFrom && car.price < parseFloat(searchParams.priceFrom)) {
        return false
      }
      if (searchParams.priceTo && car.price > parseFloat(searchParams.priceTo)) {
        return false
      }

      // Type filter
      if (searchParams.type && car.type?.toLowerCase() !== searchParams.type.toLowerCase()) {
        return false
      }

      // Engine CC filter
      if (searchParams.engineCC && car.engineCC !== searchParams.engineCC) {
        return false
      }

      // Fuel filter
      if (searchParams.fuel && car.fuel?.toLowerCase() !== searchParams.fuel.toLowerCase()) {
        return false
      }

      // Mileage range filter
      if (searchParams.mileageFrom && car.mileage < parseInt(searchParams.mileageFrom)) {
        return false
      }
      if (searchParams.mileageTo && car.mileage > parseInt(searchParams.mileageTo)) {
        return false
      }

      // Country filter
      if (searchParams.country && car.country?.toLowerCase() !== searchParams.country.toLowerCase()) {
        return false
      }

      // Region filter
      if (searchParams.region && car.region?.toLowerCase() !== searchParams.region.toLowerCase()) {
        return false
      }

      // Color filter
      if (searchParams.color && car.exteriorColor?.toLowerCase() !== searchParams.color.toLowerCase()) {
        return false
      }

      // Drive filter
      if (searchParams.drive && car.drive?.toLowerCase() !== searchParams.drive.toLowerCase()) {
        return false
      }

      // Transmission filter
      if (searchParams.transmission && car.transmission?.toLowerCase() !== searchParams.transmission.toLowerCase()) {
        return false
      }

      // Stock filter
      if (searchParams.stock && car.stock?.toLowerCase() !== searchParams.stock.toLowerCase()) {
        return false
      }

      return true
    })

    // Sort the filtered results
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case "year":
        filtered.sort((a, b) => (b.year || 0) - (a.year || 0))
        break
      default:
        // Keep original order
        break
    }

    return filtered
  }, [allCars, searchParams, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCars.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCars = filteredAndSortedCars.slice(startIndex, endIndex)

  // Generate dynamic options from actual data
  const makeOptions = useMemo(() => {
    const makes = [...new Set(allCars.map(car => car.make).filter(Boolean))]
    return makes.map(make => ({ value: make.toLowerCase(), label: make }))
  }, [allCars])

  const modelOptions = useMemo(() => {
    const models = [...new Set(allCars.map(car => car.model).filter(Boolean))]
    return models.map(model => ({ value: model.toLowerCase(), label: model }))
  }, [allCars])

  const fuelOptions = useMemo(() => {
    const fuels = [...new Set(allCars.map(car => car.fuel).filter(Boolean))]
    return fuels.map(fuel => ({ value: fuel.toLowerCase(), label: fuel }))
  }, [allCars])

  const colorOptions = useMemo(() => {
    const colors = [...new Set(allCars.map(car => car.exteriorColor).filter(Boolean))]
    return colors.map(color => ({ value: color.toLowerCase(), label: color }))
  }, [allCars])

  const yearOptions = useMemo(() => {
    const years = [...new Set(allCars.map(car => car.year).filter(Boolean))].sort((a, b) => b - a)
    return years.map(year => ({ value: year.toString(), label: year.toString() }))
  }, [allCars])

  const handleSelectChange = (e) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleReset = () => {
    setSearchParams({
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
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle search from CarSearchForm component
  const handleSearchFromForm = (formSearchParams) => {
    setSearchParams(formSearchParams)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-red-50">
      {cartCount > 0 && (
        <div className="fixed top-20 right-4 z-40">
          <a href="/cart" className="bg-red-600 text-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 hover:bg-red-700 transition-colors">
            <ShoppingCart size={20} />
            <span className="font-bold">{cartCount}</span>
            <span className="text-sm hidden sm:inline">items</span>
          </a>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Car</h1>
          <p className="text-xl text-blue-100 mb-8">Browse our extensive collection of quality vehicles</p>
        </div>
      </div>

      <CarSearchForm onSearch={handleSearchFromForm} />
      
      <div className="bg-white shadow-lg border-b sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Filter size={20} />
              <span className="font-medium">Filters</span>
            </button>

            <div className="text-gray-600">
              <span className="font-medium">{filteredAndSortedCars.length}</span> cars found
            </div>
          </div>

          {showFilters && (
            <form onSubmit={handleSubmit} className="pb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
                <SelectField 
                  name="make" 
                  value={searchParams.make} 
                  onChange={handleSelectChange} 
                  options={makeOptions} 
                  placeholder="Select Make" 
                />
                <SelectField 
                  name="model" 
                  value={searchParams.model} 
                  onChange={handleSelectChange} 
                  options={modelOptions} 
                  placeholder="All Models" 
                />
                <SelectField 
                  name="yearFrom" 
                  value={searchParams.yearFrom} 
                  onChange={handleSelectChange} 
                  options={yearOptions} 
                  placeholder="Year From" 
                />
                <SelectField 
                  name="yearTo" 
                  value={searchParams.yearTo} 
                  onChange={handleSelectChange} 
                  options={yearOptions} 
                  placeholder="Year To" 
                />
                <Input 
                  name="priceFrom" 
                  value={searchParams.priceFrom} 
                  onChange={handleInputChange} 
                  placeholder="Price From" 
                  type="number" 
                />
                <Input 
                  name="priceTo" 
                  value={searchParams.priceTo} 
                  onChange={handleInputChange} 
                  placeholder="Price To" 
                  type="number" 
                />
                <SelectField 
                  name="fuel" 
                  value={searchParams.fuel} 
                  onChange={handleSelectChange} 
                  options={fuelOptions} 
                  placeholder="Select Fuel" 
                />
                <SelectField 
                  name="color" 
                  value={searchParams.color} 
                  onChange={handleSelectChange} 
                  options={colorOptions} 
                  placeholder="Select Color" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Input
                  name="keywords"
                  value={searchParams.keywords}
                  onChange={handleInputChange}
                  placeholder="Search by keywords, make, model, features..."
                  className="md:col-span-2"
                />
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Search
                  </Button>
                  <Button type="button" variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {/* Pagination */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  className={`px-3 py-2 text-sm rounded transition-colors ${
                    currentPage === page
                      ? "bg-red-600 text-white"
                      : "bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              )
            })}
            {totalPages > 5 && (
              <>
                <span className="px-3 py-2 text-sm text-gray-500">...</span>
                <button 
                  className="bg-white border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 transition-colors rounded"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
            {currentPage < totalPages && (
              <button 
                className="bg-white border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 transition-colors rounded"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setViewType("list")}
                className={`p-2 rounded transition-colors ${
                  viewType === "list" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewType("grid")}
                className={`p-2 rounded transition-colors ${
                  viewType === "grid" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Grid size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <SortAsc size={16} className="text-gray-500" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort By: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="year">Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Car Listings */}
        {isLoading ? (
          <div className="text-center text-gray-600 py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Loading cars...
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-12">
            <div className="text-lg font-medium mb-2">Failed to load cars</div>
            <div className="text-sm text-gray-500">Please try again later</div>
          </div>
        ) : filteredAndSortedCars.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            <div className="text-lg font-medium mb-2">No cars found</div>
            <div className="text-sm text-gray-500">Try adjusting your search filters</div>
            <Button onClick={handleReset} className="mt-4">
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {currentCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}

        {/* Show More Button - only if there are more pages */}
        {currentPage < totalPages && currentCars.length > 0 && (
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="px-8"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Load More Cars
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}