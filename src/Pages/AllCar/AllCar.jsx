import { useState } from "react"
import { Grid, List, ShoppingCart, Filter, SortAsc } from 'lucide-react'

import Input from "../../components/ui/input"
import Button from "../../components/ui/Button"
import { useShop } from "../../Context/ShopContext"
import CarCard from "../../components/ui/carCard"
import SelectField from "../../components/ui/SelectField"
import { useAllCars } from "../../hooks/useCars"
import CarSearchForm from "../Shared/CarSearchform/CarSearchForm"

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

  const { data = [], isLoading, isError } = useAllCars({
    ...searchParams,
    page: currentPage,
    sortBy,
  })

  const makeOptions = [
    { value: "toyota", label: "Toyota" },
    { value: "honda", label: "Honda" },
    { value: "nissan", label: "Nissan" },
    { value: "mazda", label: "Mazda" },
  ]

  const modelOptions = [
    { value: "corolla", label: "Corolla" },
    { value: "camry", label: "Camry" },
    { value: "civic", label: "Civic" },
    { value: "accord", label: "Accord" },
  ]

  const yearOptions = Array.from({ length: 25 }, (_, i) => {
    const year = 2024 - i
    return { value: year.toString(), label: year.toString() }
  })

  const handleSelectChange = (e) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
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
      <CarSearchForm/>
      
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
              <span className="font-medium">{data.length}</span> cars found
            </div>
          </div>

          {showFilters && (
            <form onSubmit={handleSubmit} className="pb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
                <SelectField name="make" value={searchParams.make} onChange={handleSelectChange} options={makeOptions} placeholder="Select Make" />
                <SelectField name="model" value={searchParams.model} onChange={handleSelectChange} options={modelOptions} placeholder="All Models" />
                <SelectField name="yearFrom" value={searchParams.yearFrom} onChange={handleSelectChange} options={yearOptions} placeholder="Year From" />
                <SelectField name="yearTo" value={searchParams.yearTo} onChange={handleSelectChange} options={yearOptions} placeholder="Year To" />
                <Input name="priceFrom" value={searchParams.priceFrom} onChange={handleInputChange} placeholder="Price From" type="number" />
                <Input name="priceTo" value={searchParams.priceTo} onChange={handleInputChange} placeholder="Price To" type="number" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Input
                  name="keywords"
                  value={searchParams.keywords}
                  onChange={handleInputChange}
                  placeholder="Search by keywords..."
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
          <div className="flex items-center gap-1">
            <span className="bg-red-600 text-white px-3 py-2 text-sm font-medium rounded">1</span>
            {[2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className="bg-white border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 transition-colors rounded"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <span className="px-3 py-2 text-sm text-gray-500">...</span>
            <button className="bg-white border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 transition-colors rounded">
              Next
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setViewType("list")}
                className={`p-2 rounded transition-colors ${viewType === "list" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewType("grid")}
                className={`p-2 rounded transition-colors ${viewType === "grid" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
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
          <div className="text-center text-gray-600">Loading cars...</div>
        ) : isError ? (
          <div className="text-center text-red-500">Failed to load cars.</div>
        ) : (
          <div className="space-y-8">
            {data.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" className="px-8">
            Load More Cars
          </Button>
        </div>
      </div>
    </div>
  )
}
