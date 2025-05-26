"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Edit,
  Eye,
  EyeOff,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Fuel,
  Palette,
  Users,
  DollarSign,
  Star,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useCar, useDeleteCar, useActivateCar, useDeactivateCar } from "../../../../hooks/useCars"

export function CarDetailsPage() {
  const navigate = useNavigate()
  const params = useParams()
  const carId = params.id as string

  const { data: car, isLoading, error, refetch } = useCar(carId)
  const deleteMutation = useDeleteCar()
  const activateMutation = useActivateCar()
  const deactivateMutation = useDeactivateCar()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDelete = () => {
    deleteMutation.mutate(carId, {
      onSuccess: () => {
        alert("Car deleted successfully")
        navigate("/admin/cars")
      },
      onError: (error) => {
        console.error("Failed to delete car:", error)
        alert("Failed to delete car. Please try again.")
      },
    })
  }

  const handleToggleStatus = () => {
    if (!car) return

    const mutation = car.isActive ? deactivateMutation : activateMutation
    mutation.mutate(car.id!, {
      onSuccess: () => refetch(),
      onError: (error) => {
        console.error("Failed to toggle car status:", error)
        alert("Failed to update car status. Please try again.")
      },
    })
  }

  const handleEdit = () => {
    navigate(`/admin/cars/edit/${carId}`)
  }

  const handlePreviousImage = () => {
    if (!car) return
    const allImages = [car.mainImage, ...car.gallery].filter(Boolean)
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    if (!car) return
    const allImages = [car.mainImage, ...car.gallery].filter(Boolean)
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading car details...</p>
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
          <div className="text-red-800">
            Error loading car details: {error?.message || "Car not found"}
            <button
              className="ml-2 underline text-blue-600 hover:text-blue-800"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const allImages = [car.mainImage, ...car.gallery].filter(Boolean)
  const currentImage = allImages[currentImageIndex]

  // Group features by type
  const featuresByType = car.features.reduce(
    (acc, feature) => {
      if (!acc[feature.type]) {
        acc[feature.type] = []
      }
      acc[feature.type].push(feature)
      return acc
    },
    {} as Record<string, typeof car.features>,
  )

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/cars")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cars
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {car.year}
              </span>
              <span className="flex items-center">
                <Fuel className="w-4 h-4 mr-1" />
                {car.fuel}
              </span>
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {car.seats} seats
              </span>
              <span className="flex items-center">
                <Palette className="w-4 h-4 mr-1" />
                {car.exteriorColor}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                car.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              {car.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            {/* Main Image */}
            <div className="relative h-96 bg-gray-100">
              <img
                src={currentImage || "/placeholder.svg?height=400&width=600"}
                alt={car.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=400&width=600"
                }}
              />

              {/* Image Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {allImages.length}
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
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 ${
                        index === currentImageIndex ? "border-blue-500" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg?height=64&width=80"}
                        alt={`${car.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=64&width=80"
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          {/* Price and Actions */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-3xl font-bold text-gray-900">
                <DollarSign className="w-8 h-8 mr-1" />
                {car.price.toLocaleString()}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleEdit}
                className="w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Car
              </button>

              <button
                onClick={handleToggleStatus}
                disabled={activateMutation.isPending || deactivateMutation.isPending}
                className={`w-full flex items-center justify-center py-2 px-4 rounded-md transition-colors disabled:opacity-50 ${
                  car.isActive
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {car.isActive ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {activateMutation.isPending || deactivateMutation.isPending
                  ? "Updating..."
                  : car.isActive
                    ? "Deactivate"
                    : "Activate"}
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={deleteMutation.isPending}
                className="w-full flex items-center justify-center bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleteMutation.isPending ? "Deleting..." : "Delete Car"}
              </button>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Year</span>
                <span className="font-medium">{car.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fuel Type</span>
                <span className="font-medium">{car.fuel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Exterior Color</span>
                <span className="font-medium">{car.exteriorColor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seating Capacity</span>
                <span className="font-medium">{car.seats} seats</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`font-medium ${car.isActive ? "text-green-600" : "text-gray-600"}`}>
                  {car.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Car ID</span>
                <span className="font-mono text-xs">{car.id}</span>
              </div>
              {car.createdAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span>{new Date(car.createdAt).toLocaleDateString()}</span>
                </div>
              )}
              {car.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span>{new Date(car.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      {Object.keys(featuresByType).length > 0 && (
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(featuresByType).map(([type, features]) => (
                <div key={type} className="space-y-3">
                  <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2">{type}</h4>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={feature.id || index} className="flex items-center text-sm text-gray-600">
                        <Star className="w-3 h-3 mr-2 text-blue-500" />
                        {feature.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md mx-4">
            <h2 className="text-lg font-bold mb-2">Confirm Deletion</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{car.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
