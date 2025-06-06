"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Search, X, RotateCcw } from 'lucide-react'
import Card from '../../../components/card/Card'
import Input from '../../../components/ui/Input'
import SelectField from '../../../components/ui/SelectField'
import Button from '../../../components/ui/Button'

const SearchFilter = ({ carsResponse = [], onFilteredResults }) => {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    modelCode: '',
    yearFrom: '',
    yearTo: '',
    priceFrom: '',
    priceTo: '',
    type: '',
    engineCC: '',
    fuel: '',
    mileageFrom: '',
    mileageTo: '',
    country: '',
    region: '',
    color: '',
    drive: '',
    transmission: '',
    stock: '',
    keywords: ''
  })
  
  const [hasSearched, setHasSearched] = useState(false)
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])

  // Hardcoded options for dropdowns
  const filterOptions = {
    makes: [
      { value: 'toyota', label: 'Toyota' },
      { value: 'honda', label: 'Honda' },
      { value: 'nissan', label: 'Nissan' },
      { value: 'mazda', label: 'Mazda' },
      { value: 'subaru', label: 'Subaru' },
      { value: 'mitsubishi', label: 'Mitsubishi' },
      { value: 'suzuki', label: 'Suzuki' },
      { value: 'daihatsu', label: 'Daihatsu' },
      { value: 'isuzu', label: 'Isuzu' },
      { value: 'lexus', label: 'Lexus' }
    ],
    models: [
      { value: 'camry', label: 'Camry' },
      { value: 'corolla', label: 'Corolla' },
      { value: 'prius', label: 'Prius' },
      { value: 'accord', label: 'Accord' },
      { value: 'civic', label: 'Civic' },
      { value: 'altima', label: 'Altima' },
      { value: 'sentra', label: 'Sentra' },
      { value: 'mazda3', label: 'Mazda3' },
      { value: 'cx-5', label: 'CX-5' },
      { value: 'impreza', label: 'Impreza' }
    ],
    types: [
      { value: 'sedan', label: 'Sedan' },
      { value: 'suv', label: 'SUV' },
      { value: 'hatchback', label: 'Hatchback' },
      { value: 'coupe', label: 'Coupe' },
      { value: 'wagon', label: 'Wagon' },
      { value: 'convertible', label: 'Convertible' },
      { value: 'pickup', label: 'Pickup Truck' },
      { value: 'van', label: 'Van' }
    ],
    fuels: [
      { value: 'gasoline', label: 'Gasoline' },
      { value: 'hybrid', label: 'Hybrid' },
      { value: 'electric', label: 'Electric' },
      { value: 'diesel', label: 'Diesel' },
      { value: 'lpg', label: 'LPG' }
    ],
    transmissions: [
      { value: 'automatic', label: 'Automatic' },
      { value: 'manual', label: 'Manual' },
      { value: 'cvt', label: 'CVT' }
    ],
    drives: [
      { value: '2wd', label: '2WD' },
      { value: '4wd', label: '4WD' },
      { value: 'awd', label: 'AWD' }
    ],
    colors: [
      { value: 'white', label: 'White' },
      { value: 'black', label: 'Black' },
      { value: 'silver', label: 'Silver' },
      { value: 'gray', label: 'Gray' },
      { value: 'red', label: 'Red' },
      { value: 'blue', label: 'Blue' },
      { value: 'green', label: 'Green' },
      { value: 'brown', label: 'Brown' }
    ],
    countries: [
      { value: 'japan', label: 'Japan' },
      { value: 'usa', label: 'USA' },
      { value: 'germany', label: 'Germany' },
      { value: 'korea', label: 'South Korea' }
    ],
    regions: [
      { value: 'tokyo', label: 'Tokyo' },
      { value: 'osaka', label: 'Osaka' },
      { value: 'nagoya', label: 'Nagoya' },
      { value: 'fukuoka', label: 'Fukuoka' },
      { value: 'sapporo', label: 'Sapporo' }
    ],
    stocks: [
      { value: 'in-stock', label: 'In Stock' },
      { value: 'pre-order', label: 'Pre-order' },
      { value: 'sold', label: 'Sold' }
    ]
  }

  // Generate year options dynamically
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = currentYear; year >= 1990; year--) {
      years.push({ value: year.toString(), label: year.toString() })
    }
    return years
  }

  // Filter cars based on search criteria
  const filteredCars = useMemo(() => {
    if (!hasSearched || !Array.isArray(carsResponse)) return []

    return carsResponse.filter(car => {
      // Keywords search
      const matchesKeywords = !filters.keywords || 
        car.title?.toLowerCase().includes(filters.keywords.toLowerCase()) ||
        car.description?.toLowerCase().includes(filters.keywords.toLowerCase())

      // Make filter
      const matchesMake = !filters.make || 
        car.make?.toLowerCase() === filters.make.toLowerCase()

      // Model filter
      const matchesModel = !filters.model || 
        car.model?.toLowerCase().includes(filters.model.toLowerCase())

      // Year range filter
      const carYear = parseInt(car.year) || 0
      const matchesYearFrom = !filters.yearFrom || carYear >= parseInt(filters.yearFrom)
      const matchesYearTo = !filters.yearTo || carYear <= parseInt(filters.yearTo)

      // Price range filter
      const carPrice = parseFloat(car.price) || 0
      const matchesPriceFrom = !filters.priceFrom || carPrice >= parseFloat(filters.priceFrom)
      const matchesPriceTo = !filters.priceTo || carPrice <= parseFloat(filters.priceTo)

      // Fuel filter
      const matchesFuel = !filters.fuel || car.fuel?.toLowerCase() === filters.fuel.toLowerCase()

      // Color filter
      const matchesColor = !filters.color || car.exteriorColor?.toLowerCase() === filters.color.toLowerCase()

      // Type filter
      const matchesType = !filters.type || car.type?.toLowerCase() === filters.type.toLowerCase()

      // Transmission filter
      const matchesTransmission = !filters.transmission || car.transmission?.toLowerCase() === filters.transmission.toLowerCase()

      // Mileage range filter
      const carMileage = parseInt(car.mileage) || 0
      const matchesMileageFrom = !filters.mileageFrom || carMileage >= parseInt(filters.mileageFrom)
      const matchesMileageTo = !filters.mileageTo || carMileage <= parseInt(filters.mileageTo)

      return matchesKeywords && matchesMake && matchesModel && 
             matchesYearFrom && matchesYearTo && matchesPriceFrom && matchesPriceTo &&
             matchesFuel && matchesColor && matchesType && matchesTransmission &&
             matchesMileageFrom && matchesMileageTo
    })
  }, [carsResponse, filters, hasSearched])

  // Update parent component with filtered results
  useEffect(() => {
    if (onFilteredResults) {
      onFilteredResults(hasSearched ? filteredCars : [])
    }
  }, [filteredCars, hasSearched, onFilteredResults])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    handleFilterChange(name, value)
  }

  const handleSelectChange = (e) => {
    const { name, value } = e.target
    handleFilterChange(name, value)
  }

  const handleSearch = () => {
    setHasSearched(true)
  }

  const handleReset = () => {
    setFilters({
      make: '',
      model: '',
      modelCode: '',
      yearFrom: '',
      yearTo: '',
      priceFrom: '',
      priceTo: '',
      type: '',
      engineCC: '',
      fuel: '',
      mileageFrom: '',
      mileageTo: '',
      country: '',
      region: '',
      color: '',
      drive: '',
      transmission: '',
      stock: '',
      keywords: ''
    })
    setHasSearched(false)
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

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="w-full">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-8 px-6 rounded-t-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
          FIND JAPANESE USED CARS
        </h1>
      </div>

      {/* Search Form */}
      <div className="bg-gray-100 p-6 rounded-b-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {/* Row 1 */}
          <SelectField
            name="make"
            value={filters.make}
            onChange={handleSelectChange}
            options={filterOptions.makes}
            placeholder="Select Make"
          />
          <SelectField
            name="model"
            value={filters.model}
            onChange={handleSelectChange}
            options={filterOptions.models}
            placeholder="All Model"
          />
          <Input
            name="modelCode"
            value={filters.modelCode}
            onChange={handleInputChange}
            placeholder="All Model Code"
          />
          <SelectField
            name="yearFrom"
            value={filters.yearFrom}
            onChange={handleSelectChange}
            options={generateYearOptions()}
            placeholder="Year From"
          />

          {/* Row 2 */}
          <SelectField
            name="yearTo"
            value={filters.yearTo}
            onChange={handleSelectChange}
            options={generateYearOptions()}
            placeholder="Year To"
          />
          <Input
            name="priceFrom"
            type="number"
            value={filters.priceFrom}
            onChange={handleInputChange}
            placeholder="Price From"
          />
          <Input
            name="priceTo"
            type="number"
            value={filters.priceTo}
            onChange={handleInputChange}
            placeholder="Price To"
          />
          <SelectField
            name="type"
            value={filters.type}
            onChange={handleSelectChange}
            options={filterOptions.types}
            placeholder="Select Type"
          />

          {/* Row 3 */}
          <Input
            name="engineCC"
            type="number"
            value={filters.engineCC}
            onChange={handleInputChange}
            placeholder="Select Engine CC"
          />
          <SelectField
            name="fuel"
            value={filters.fuel}
            onChange={handleSelectChange}
            options={filterOptions.fuels}
            placeholder="Select Fuel"
          />
          <Input
            name="mileageFrom"
            type="number"
            value={filters.mileageFrom}
            onChange={handleInputChange}
            placeholder="Mileage From"
          />
          <Input
            name="mileageTo"
            type="number"
            value={filters.mileageTo}
            onChange={handleInputChange}
            placeholder="Mileage To"
          />

          {/* Row 4 */}
          <SelectField
            name="country"
            value={filters.country}
            onChange={handleSelectChange}
            options={filterOptions.countries}
            placeholder="By Country"
          />
          <SelectField
            name="region"
            value={filters.region}
            onChange={handleSelectChange}
            options={filterOptions.regions}
            placeholder="Select Region"
          />
          <SelectField
            name="color"
            value={filters.color}
            onChange={handleSelectChange}
            options={filterOptions.colors}
            placeholder="Select Color"
          />
          <SelectField
            name="drive"
            value={filters.drive}
            onChange={handleSelectChange}
            options={filterOptions.drives}
            placeholder="Select Drive"
          />

          {/* Row 5 */}
          <SelectField
            name="transmission"
            value={filters.transmission}
            onChange={handleSelectChange}
            options={filterOptions.transmissions}
            placeholder="Transmission"
          />
          <SelectField
            name="stock"
            value={filters.stock}
            onChange={handleSelectChange}
            options={filterOptions.stocks}
            placeholder="Stock"
          />
          <Input
            name="keywords"
            value={filters.keywords}
            onChange={handleInputChange}
            placeholder="Search by Keywords"
          />
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 flex items-center justify-center">
            <span className="text-yellow-800 font-semibold">Best Offers</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <Button
            variant="outline"
            size="lg"
            className="min-w-[120px]"
          >
            All
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="min-w-[140px]"
          >
            Show Results
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSearch}
            className="min-w-[120px]"
          >
            Search
          </Button>
          <span className="text-gray-600">or</span>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleReset}
            className="min-w-[120px] flex items-center gap-2"
          >
            <RotateCcw size={18} />
            Reset
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="mt-8">
          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm">
            <div className="text-gray-600">
              {filteredCars.length > 0 ? (
                <span className="text-lg">
                  Found <span className="font-semibold text-blue-600">{filteredCars.length}</span> cars
                  {hasActiveFilters && <span> matching your criteria</span>}
                </span>
              ) : (
                <span className="text-lg text-red-600">No cars found matching your search</span>
              )}
            </div>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Clear All Filters
              </Button>
            )}
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
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <div className="text-gray-400 mb-4">
                <Search className="w-20 h-20 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">No cars found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                We couldn't find any cars matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleReset}
                className="flex items-center gap-2 mx-auto"
              >
                <RotateCcw size={18} />
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Initial State - No Search Performed */}
     
    </div>
  )
}

export default SearchFilter