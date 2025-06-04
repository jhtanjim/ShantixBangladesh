"use client"

import { useState } from "react"
import { Heart, ShoppingCart, Eye, Calendar, Fuel, Users, Palette, Star } from "lucide-react"

const Card = ({
  id,
  imageUrl,
  imageAlt,
  year,
  title,
  price,
  priceLabel = "USD",
  fuel = "Petrol",
  exteriorColor = "N/A",
  seats = 4,
  onAddToCart,
  onAddToWishlist,
  isInCart = false,
  isInWishlist = false,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ id, title, price, imageUrl, year, fuel, exteriorColor, seats })
    }
  }

  const handleAddToWishlist = () => {
    if (onAddToWishlist) {
      onAddToWishlist({ id, title, price, imageUrl, year, fuel, exteriorColor, seats })
    }
  }

  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-44 bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={imageUrl || "/placeholder.svg?height=300&width=400"}
          alt={imageAlt || title}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          crossOrigin="anonymous"
        />

        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          </div>
        )}

        {/* Quick Actions */}
        <div
          className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
          }`}
        >
          <button
            onClick={handleAddToWishlist}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
              isInWishlist 
                ? "bg-red-500 text-white shadow-lg" 
                : "bg-white/90 text-gray-700 hover:bg-red-50 shadow-md"
            }`}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`} />
          </button>
          <button className="p-2 bg-white/90 text-gray-700 rounded-full hover:bg-blue-50 transition-all duration-200 hover:scale-110 shadow-md backdrop-blur-sm">
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Year Badge */}
        <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-sm">
          {year}
        </div>

        {/* Price Display */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="text-white">
            <div className="text-2xl font-bold">
              ${typeof price === "number" ? price.toLocaleString() : price}
            </div>
            <div className="text-xs opacity-90">{priceLabel}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
            {title}
          </h3>
          
          {/* Rating Stars */}
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">(4.0)</span>
          </div>
        </div>

        {/* Car Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="p-1 bg-blue-50 rounded">
              <Calendar className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-xs">{year}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="p-1 bg-green-50 rounded">
              <Fuel className="w-3 h-3 text-green-600" />
            </div>
            <span className="text-xs">{fuel}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="p-1 bg-purple-50 rounded">
              <Users className="w-3 h-3 text-purple-600" />
            </div>
            <span className="text-xs">{seats} Seats</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <div className="p-1 bg-orange-50 rounded">
              <Palette className="w-3 h-3 text-orange-600" />
            </div>
            <span className="text-xs">{exteriorColor}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              isInCart
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isInCart ? "Added" : "Add to Cart"}
          </button>
          <button className="px-3 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
            View
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card