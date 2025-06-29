import { useState, useEffect } from 'react'
import { ShoppingCart, Check, Heart, Eye, Star, Calendar, Fuel, Palette, Users } from 'lucide-react'
import Button from './Button'
import { useShop } from '../../Context/ShopContext'
import { Link } from 'react-router-dom'

const CarCard = ({ car }) => {
  const { addToCart, toggleWishlist, isInCart, isInWishlist, exchangeRate } = useShop()
  const [addingToCart, setAddingToCart] = useState(false)
  const [addingToWishlist, setAddingToWishlist] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setAddingToCart(true)
    try {
      addToCart(car)
      setTimeout(() => setAddingToCart(false), 1000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setAddingToCart(false)
    }
  }

  const handleWishlistToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setAddingToWishlist(true)
    try {
      toggleWishlist(car)
      setTimeout(() => setAddingToWishlist(false), 500)
    } catch (error) {
      console.error('Error updating wishlist:', error)
      setAddingToWishlist(false)
    }
  }

  const handleViewDetails = () => {
    // Handle navigation to car details
    console.log('View details for car:', car.id)
  }

  // Format yen price with dynamic exchange rate
const formatYenPrice = (usdPrice) => {
  if (!usdPrice || !exchangeRate) return 'N/A'
  return `¥${Math.round(usdPrice * exchangeRate).toLocaleString()}`
}


  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Status Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
            car.isActive 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}
        >
          {car.isActive ? 'Available' : 'Sold'}
        </span>
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        disabled={addingToWishlist}
        className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200"
      >
        <Heart
          size={20}
          className={`transition-colors ${
            isInWishlist(car.id) 
              ? 'text-red-500 fill-red-500' 
              : 'text-gray-600 hover:text-red-500'
          }`}
        />
      </button>

      <div className="flex flex-col lg:flex-row h-full">
        {/* Image Section */}
        <div className="lg:w-2/5 relative overflow-hidden">
          <div className="aspect-[4/3] lg:h-full">
            <img
              src={car.mainImage || '/placeholder.svg?height=300&width=400'}
              alt={car.title || 'Car image'}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = '/placeholder.svg?height=300&width=400'
              }}
            />
          </div>

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
           <Link to={`/cars/${car.id}`} className="">
            <Button 
              className="cursor-pointer  bg-blue text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              <Eye size={16} />
              View Details
            </Button>
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:w-3/5 p-6 flex flex-col justify-between">
          {/* Header */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {car.title || `${car.make} ${car.model}` || 'Car Title'}
              </h3>
              <div className="text-right ml-4 mt-8 ">
                <div className="text-2xl font-bold text-red-600">
                  ${car.price?.toLocaleString() || 'N/A'}
                </div>
                {car.price && exchangeRate && (
                  <div className="text-sm text-gray-500">
                    {formatYenPrice(car.price)}
                  </div>
                )}
                {car.price && !exchangeRate && (
                  <div className="text-sm text-gray-400">
                    Exchange rate loading...
                  </div>
                )}
              </div>
            </div>

            {/* Rating */}
            {/* <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.0)</span>
            </div> */}

            {/* Specs Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <Calendar className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                <div className="text-xs text-gray-500 mb-1">Year</div>
                <div className="font-bold text-gray-900">{car.year || 'N/A'}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <Fuel className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                <div className="text-xs text-gray-500 mb-1">Fuel</div>
                <div className="font-bold text-gray-900">{car.fuel || 'N/A'}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <Palette className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                <div className="text-xs text-gray-500 mb-1">Color</div>
                <div className="font-bold text-gray-900">{car.exteriorColor || 'N/A'}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <Users className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                <div className="text-xs text-gray-500 mb-1">Seats</div>
                <div className="font-bold text-gray-900">{car.seats || 'N/A'}</div>
              </div>
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {car.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={feature.id || index}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      feature.type === 'Safety'
                        ? 'bg-blue-100 text-blue-800'
                        : feature.type === 'Interior'
                          ? 'bg-yellow-100 text-yellow-800'
                          : feature.type === 'Exterior'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {feature.name}
                  </span>
                ))}
                {car.features.length > 3 && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    +{car.features.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Reference */}
            <div className="text-sm text-gray-500 mb-4">
              Ref: #{car.id?.toString().slice(0, 8) || 'N/A'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={`/cars/${car.id}`} className="flex-1">
              <button className=" cursor-pointer w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-medium transition-colors">
                More Details
              </button>
            </Link>

            <Button
              onClick={handleAddToCart}
              disabled={addingToCart || !car.isActive}
              variant={isInCart(car.id) ? "success" : "secondary"}
              className="cursor-pointer flex-1 flex items-center justify-center gap-2"
            >
              {addingToCart ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : isInCart(car.id) ? (
                <>
                  <Check size={16} />
                  In Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarCard