"use client"

import { Grid, List, ShoppingCart, SortAsc, ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo, useState, useCallback } from "react"
import { useAllCars } from "../../hooks/useCars"
import CarSearchForm from "../Shared/CarSearchform/CarSearchForm";
import CarCard from "../../components/ui/CarCard";

export default function AllCars() {
  // State management
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
  const [itemsPerPage] = useState(10)

  // Shopping cart and wishlist state
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])

  // Get all cars data from API
  const { data: allCars = [], isLoading, isError } = useAllCars()

  // Filter and sort cars based on search parameters
  const filteredAndSortedCars = useMemo(() => {
    if (!allCars.length) return []

    const filtered = allCars.filter((car) => {
      // Keywords search
      if (searchParams.keywords) {
        const keywords = searchParams.keywords.toLowerCase()
        const searchableText = [
          car.title,
          car.make,
          car.model,
          car.modelCode,
          car.type,
          car.fuel,
          car.exteriorColor,
          car.transmission,
          ...(car.features || []).map((f) => f.name || f),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()

        if (!searchableText.includes(keywords)) return false
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
      if (searchParams.yearFrom && car.year < Number.parseInt(searchParams.yearFrom)) {
        return false
      }
      if (searchParams.yearTo && car.year > Number.parseInt(searchParams.yearTo)) {
        return false
      }

      // Price range filter
      if (searchParams.priceFrom && car.price < Number.parseFloat(searchParams.priceFrom)) {
        return false
      }
      if (searchParams.priceTo && car.price > Number.parseFloat(searchParams.priceTo)) {
        return false
      }

      // Type filter
      if (searchParams.type && car.type?.toLowerCase() !== searchParams.type.toLowerCase()) {
        return false
      }

      // Engine CC filter
      if (searchParams.engineCC && car.engineCC?.toString() !== searchParams.engineCC) {
        return false
      }

      // Fuel filter
      if (searchParams.fuel && car.fuel?.toLowerCase() !== searchParams.fuel.toLowerCase()) {
        return false
      }

      // Mileage range filter
      if (searchParams.mileageFrom && car.mileage < Number.parseInt(searchParams.mileageFrom)) {
        return false
      }
      if (searchParams.mileageTo && car.mileage > Number.parseInt(searchParams.mileageTo)) {
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
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        break
      case "year-new":
        filtered.sort((a, b) => (b.year || 0) - (a.year || 0))
        break
      case "year-old":
        filtered.sort((a, b) => (a.year || 0) - (b.year || 0))
        break
      case "mileage-low":
        filtered.sort((a, b) => (a.mileage || 0) - (b.mileage || 0))
        break
      case "mileage-high":
        filtered.sort((a, b) => (b.mileage || 0) - (a.mileage || 0))
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

  // Cart and wishlist functions
  const addToCart = useCallback((car) => {
    setCart((prev) => (prev.find((item) => item.id === car.id) ? prev : [...prev, car]))
  }, [])

  const toggleWishlist = useCallback((car) => {
    setWishlist((prev) =>
      prev.find((item) => item.id === car.id) ? prev.filter((item) => item.id !== car.id) : [...prev, car],
    )
  }, [])

  const isInCart = useCallback((carId) => cart.some((item) => item.id === carId), [cart])
  const isInWishlist = useCallback((carId) => wishlist.some((item) => item.id === carId), [wishlist])

  // Handle search from CarSearchForm component
  const handleSearchFromForm = useCallback((formSearchParams) => {
    setSearchParams(formSearchParams)
    setCurrentPage(1)
  }, [])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy)
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

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cart indicator */}
      {cart.length > 0 && (
        <div className="fixed top-20 right-4 z-40">
          <a
            href="/cart"
            className="bg-red-600 hover:bg-red-700 text-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 transition-colors"
          >
            <ShoppingCart size={20} />
            <span className="font-bold">{cart.length}</span>
            <span className="text-sm hidden sm:inline">items</span>
          </a>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Car</h1>
          <p className="text-xl opacity-90 mb-2">Browse our extensive collection of quality vehicles</p>
          <p className="text-lg opacity-75">
            {isLoading ? "Loading..." : `${filteredAndSortedCars.length} cars available`}
          </p>
        </div>
      </div>

      {/* Search Form */}
      <CarSearchForm onSearch={handleSearchFromForm} allCars={allCars} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedCars.length)} of{" "}
              {filteredAndSortedCars.length} cars
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setViewType("list")}
                className={`p-2 rounded transition-colors ${
                  viewType === "list" ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewType("grid")}
                className={`p-2 rounded transition-colors ${
                  viewType === "grid" ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Grid size={16} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SortAsc size={16} className="text-gray-500" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year-new">Year: Newest First</option>
                <option value="year-old">Year: Oldest First</option>
                <option value="mileage-low">Mileage: Low to High</option>
                <option value="mileage-high">Mileage: High to Low</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* Car Listings */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cars...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <div className="text-lg font-medium mb-2 text-red-600">Failed to load cars</div>
            <p className="text-gray-500">Please try again later</p>
          </div>
        ) : filteredAndSortedCars.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-lg font-medium mb-2 text-gray-600">No cars found</div>
            <p className="text-gray-500 mb-4">Try adjusting your search filters</p>
            <button
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {currentCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                isInCart={isInCart(car.id)}
                isInWishlist={isInWishlist(car.id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {getPaginationNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && handlePageChange(page)}
                disabled={page === "..."}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-red-600 text-white"
                    : page === "..."
                      ? "text-gray-400 cursor-default"
                      : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Load More Button - only if there are more pages */}
        {currentPage < totalPages && currentCars.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Load More Cars
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
