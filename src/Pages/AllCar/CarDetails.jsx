"use client"

import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
  ShoppingCart,
  Check,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Calendar,
  Fuel,
  Palette,
  Users,
  Star,
  Shield,
  Car,
  Sparkles,
  Settings,
  Badge,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useShop } from "../../Context/ShopContext"
import { useCar } from "../../hooks/useCars"
import Button from "../../components/ui/Button"

const CarDetailsPage = () => {
  const { id } = useParams()
  const { addToCart, isInCart } = useShop()
  const [addingToCart, setAddingToCart] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Use the React Query hook to fetch car data
  const { data: car, isLoading, isError } = useCar(id)

  const handleAddToCart = () => {
    if (!car) return

    setAddingToCart(true)

    try {
      addToCart(car)
      setTimeout(() => {
        setAddingToCart(false)
      }, 1000)
    } catch (error) {
      console.error("Error adding to cart:", error)
      setAddingToCart(false)
    }
  }

  const getFeatureIcon = (type) => {
    switch (type) {
      case "Safety":
        return <Shield size={16} className="text-blue-600" />
      case "Interior":
        return <Car size={16} className="text-purple-600" />
      case "Exterior":
        return <Sparkles size={16} className="text-green-600" />
      case "Special":
        return <Settings size={16} className="text-orange-600" />
      default:
        return <Badge size={16} className="text-gray-600" />
    }
  }

  const getFeatureColor = (type) => {
    switch (type) {
      case "Safety":
        return "bg-blue-50 border-blue-200 text-blue-800"
      case "Interior":
        return "bg-purple-50 border-purple-200 text-purple-800"
      case "Exterior":
        return "bg-green-50 border-green-200 text-green-800"
      case "Special":
        return "bg-orange-50 border-orange-200 text-orange-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  const allImages = car ? [car.mainImage, ...(car.gallery || [])].filter(Boolean) : []

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading car details...</div>
        </div>
      </div>
    )
  }

  if (isError || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🚗</div>
          <div className="text-xl text-red-600 mb-4">Car not found</div>
          <Link to="/cars">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft size={16} className="mr-2" />
              Back to Cars
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Navigation */}
          <div className="mb-6">
            <Link to="/cars">
              <Button className="bg-white/10 hover:bg-white/20 text-white border-white/20 flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to Cars
              </Button>
            </Link>
          </div>

          {/* Car Title & Status */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 capitalize">{car.title}</h1>
              <div className="flex items-center gap-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    car.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {car.isActive ? "Available" : "Sold Out"}
                </span>
                <div className="flex items-center text-gray-300">
                  <Clock size={16} className="mr-2" />
                  <span className="text-sm">Listed {new Date(car.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 text-right">
              <div className="text-sm text-gray-300 mb-1">Starting from</div>
              <div className="text-4xl font-bold text-white">${car.price?.toLocaleString()}</div>
              <div className="text-lg text-gray-300">¥{((car.price || 0) * 150).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                {/* Main Image */}
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={allImages[selectedImageIndex] || "/placeholder.svg?height=600&width=800"}
                    alt={`${car.title} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Image Navigation */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {selectedImageIndex + 1} / {allImages.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {allImages.length > 1 && (
                  <div className="p-4 bg-gray-50">
                    <div className="flex gap-2 overflow-x-auto">
                      {allImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImageIndex === index
                              ? "border-red-500 ring-2 ring-red-200"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={image || "/placeholder.svg?height=100&width=100"}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Car className="mr-3 text-red-600" size={24} />
                Specifications
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <Calendar className="mx-auto mb-3 text-blue-600" size={32} />
                  <h3 className="font-semibold text-blue-800 mb-1">Year</h3>
                  <p className="text-2xl font-bold text-blue-900">{car.year}</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <Fuel className="mx-auto mb-3 text-green-600" size={32} />
                  <h3 className="font-semibold text-green-800 mb-1">Fuel Type</h3>
                  <p className="text-2xl font-bold text-green-900">{car.fuel}</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <Palette className="mx-auto mb-3 text-purple-600" size={32} />
                  <h3 className="font-semibold text-purple-800 mb-1">Color</h3>
                  <p className="text-2xl font-bold text-purple-900 capitalize">{car.exteriorColor}</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                  <Users className="mx-auto mb-3 text-orange-600" size={32} />
                  <h3 className="font-semibold text-orange-800 mb-1">Seats</h3>
                  <p className="text-2xl font-bold text-orange-900">{car.seats}</p>
                </div>
              </div>
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Star className="mr-3 text-red-600" size={24} />
                  Features & Equipment
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["Safety", "Interior", "Exterior", "Special"].map((type) => {
                    const typeFeatures = car.features.filter((feature) => feature.type === type)
                    if (typeFeatures.length === 0) return null

                    return (
                      <div key={type} className={`p-6 rounded-xl border-2 ${getFeatureColor(type)}`}>
                        <div className="flex items-center mb-4">
                          {getFeatureIcon(type)}
                          <h3 className="font-bold text-lg ml-2">{type}</h3>
                        </div>
                        <ul className="space-y-2">
                          {typeFeatures.map((feature) => (
                            <li key={feature.id} className="flex items-center">
                              <div className="w-2 h-2 bg-current rounded-full mr-3 opacity-60"></div>
                              <span className="font-medium">{feature.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Car History */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Clock className="mr-3 text-red-600" size={24} />
                Vehicle History
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="font-medium">Listed for Sale</span>
                  </div>
                  <span className="text-gray-600">{new Date(car.createdAt).toLocaleDateString()}</span>
                </div>

                {car.updatedAt !== car.createdAt && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <span className="font-medium">Last Updated</span>
                    </div>
                    <span className="text-gray-600">{new Date(car.updatedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price & Purchase */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl shadow-lg p-8 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-sm opacity-90 mb-2">Total Price</div>
                <div className="text-4xl font-bold mb-2">${car.price?.toLocaleString()}</div>
                <div className="text-lg opacity-90">¥{((car.price || 0) * 150).toLocaleString()}</div>
              </div>

              <Button
                className={`w-full py-4 text-lg font-semibold flex items-center justify-center gap-3 ${
                  isInCart(car.id)
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-white hover:bg-gray-100 text-red-600"
                }`}
                onClick={handleAddToCart}
                disabled={addingToCart || !car.isActive}
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                    Adding to Cart...
                  </>
                ) : isInCart(car.id) ? (
                  <>
                    <Check size={20} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Add to Cart
                  </>
                )}
              </Button>

              {!car.isActive && (
                <div className="mt-4 p-3 bg-red-800 rounded-lg text-center">
                  <span className="text-sm font-medium">This vehicle is no longer available</span>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-2">Contact Dealer</h3>
              <h4 className="text-2xl font-bold text-blue-600 mb-6">SHANTIX Corporation</h4>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Locations</p>
                    <p className="text-gray-600 text-sm">Dhaka, Bangladesh</p>
                    <p className="text-gray-600 text-sm">Chattogram, Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Phone</p>
                    <p className="text-gray-600 text-sm">+81-45-936-0776</p>
                    <p className="text-gray-600 text-sm">+81-45-932-2376</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4 flex-shrink-0">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Email</p>
                    <p className="text-gray-600 text-sm">sales@shantix.info</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Reference ID</p>
                <p className="font-mono text-lg font-bold text-gray-900">#{car.id.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/cars" className="block">
                  <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center gap-2">
                    <ArrowLeft size={16} />
                    Back to Listings
                  </Button>
                </Link>

                <Link to="/cart" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                    <Eye size={16} />
                    View Cart
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetailsPage
