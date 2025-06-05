"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react'
import Card from '../../../components/card/Card'

const SearchFilter = ({ carsResponse = [], onFilteredResults }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    year: '',
    fuel: '',
    exteriorColor: '',
    minSeats: '',
    maxSeats: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    if (!Array.isArray(carsResponse) || carsResponse.length === 0) {
      return {
        years: [],
        fuels: [],
        colors: [],
        priceRange: { min: 0, max: 0 }
      }
    }

    const years = [...new Set(carsResponse.map(car => car.year))].sort((a, b) => b - a)
    const fuels = [...new Set(carsResponse.map(car => car.fuel))].filter(Boolean)
    const colors = [...new Set(carsResponse.map(car => car.exteriorColor))].filter(Boolean)
    const prices = carsResponse.map(car => parseFloat(car.price) || 0)
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }

    return { years, fuels, colors, priceRange }
  }, [carsResponse])

  // Filter cars based on search term and filters
  const filteredCars = useMemo(() => {
    if (!Array.isArray(carsResponse)) return []

    return carsResponse.filter(car => {
      // Search term filter
      const matchesSearch = !searchTerm || 
        car.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.year?.toString().includes(searchTerm) ||
        car.fuel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.exteriorColor?.toLowerCase().includes(searchTerm.toLowerCase())

      // Price filter
      const carPrice = parseFloat(car.price) || 0
      const matchesMinPrice = !filters.minPrice || carPrice >= parseFloat(filters.minPrice)
      const matchesMaxPrice = !filters.maxPrice || carPrice <= parseFloat(filters.maxPrice)

      // Year filter
      const matchesYear = !filters.year || car.year?.toString() === filters.year

      // Fuel filter
      const matchesFuel = !filters.fuel || car.fuel === filters.fuel

      // Color filter
      const matchesColor = !filters.exteriorColor || car.exteriorColor === filters.exteriorColor

      // Seats filter
      const carSeats = parseInt(car.seats) || 0
      const matchesMinSeats = !filters.minSeats || carSeats >= parseInt(filters.minSeats)
      const matchesMaxSeats = !filters.maxSeats || carSeats <= parseInt(filters.maxSeats)

      return matchesSearch && matchesMinPrice && matchesMaxPrice && 
             matchesYear && matchesFuel && matchesColor && 
             matchesMinSeats && matchesMaxSeats
    })
  }, [carsResponse, searchTerm, filters])

  // Update parent component with filtered results
  useEffect(() => {
    if (onFilteredResults) {
      onFilteredResults(filteredCars)
    }
  }, [filteredCars, onFilteredResults])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      year: '',
      fuel: '',
      exteriorColor: '',
      minSeats: '',
      maxSeats: ''
    })
    setSearchTerm('')
  }

  const handleAddToCart = (car) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === car.id)
      if (existingItem) return prev
      return [...prev, car]
    })
  }

  const handleAddToWishlist = (car) => {
    setWishlist(prev => {
      const existingItem = prev.find(item => item.id === car.id)
      if (existingItem) {
        return prev.filter(item => item.id !== car.id)
      }
      return [...prev, car]
    })
  }

  const isInCart = (carId) => cart.some(item => item.id === carId)
  const isInWishlist = (carId) => wishlist.some(item => item.id === carId)

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchTerm !== ''

  return (
    <div className="w-full">
      {/* Search and Filter Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cars by name, year, fuel type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Year */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Year</label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Year</option>
                  {filterOptions.years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Fuel Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Fuel Type</label>
                <select
                  value={filters.fuel}
                  onChange={(e) => handleFilterChange('fuel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Fuel</option>
                  {filterOptions.fuels.map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Color</label>
                <select
                  value={filters.exteriorColor}
                  onChange={(e) => handleFilterChange('exteriorColor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Color</option>
                  {filterOptions.colors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              {/* Seats Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Seats</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minSeats}
                    onChange={(e) => handleFilterChange('minSeats', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxSeats}
                    onChange={(e) => handleFilterChange('maxSeats', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-600">
          {filteredCars.length > 0 ? (
            <span>
              Showing {filteredCars.length} of {carsResponse.length} cars
              {searchTerm && <span> for "{searchTerm}"</span>}
            </span>
          ) : (
            <span>No cars found</span>
          )}
        </div>
      </div>

      {/* Search Results */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map((car) => (
            <Card
              key={car.id}
              id={car.id}
              imageUrl={car.mainImage}
              imageAlt={car.title}
              year={car.year}
              title={car.title}
              price={car.price}
              fuel={car.fuel}
              exteriorColor={car.exteriorColor}
              seats={car.seats}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              isInCart={isInCart(car.id)}
              isInWishlist={isInWishlist(car.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No cars found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchFilter
