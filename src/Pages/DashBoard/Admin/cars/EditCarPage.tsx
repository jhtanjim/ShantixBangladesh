"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Plus, X, AlertCircle } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useCar, useUpdateCar } from "../../../../hooks/useCars"
import type { Car, CarFeature } from "../../../../api/carService"

export function EditCarPage() {
  const navigate = useNavigate()
  const params = useParams()
  const carId = params.id as string

  const { data: car, isLoading, error } = useCar(carId)
  const updateMutation = useUpdateCar()

  const [formData, setFormData] = useState({
    title: "",
    mainImage: "",
    gallery: [""],
    year: new Date().getFullYear(),
    fuel: "",
    exteriorColor: "",
    seats: 5,
    price: 0,
    isActive: true,
  })
  const [features, setFeatures] = useState<CarFeature[]>([{ type: "", name: "" }])

  useEffect(() => {
    if (car) {
      setFormData({
        title: car.title,
        mainImage: car.mainImage,
        gallery: car.gallery.length > 0 ? car.gallery : [""],
        year: car.year,
        fuel: car.fuel,
        exteriorColor: car.exteriorColor,
        seats: car.seats,
        price: car.price,
        isActive: car.isActive,
      })
      setFeatures(car.features.length > 0 ? car.features : [{ type: "", name: "" }])
    }
  }, [car])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const carData: Partial<Car> = {
      ...formData,
      gallery: formData.gallery.filter((img) => img.trim() !== ""),
      features: features
        .filter((f) => f.type && f.name)
        .map((f) => ({
          type: f.type,
          name: f.name,
        })),
    }

    updateMutation.mutate(
      { id: carId, data: carData },
      {
        onSuccess: () => {
          alert("Car updated successfully")
          navigate("/admin/cars")
        },
        onError: (error) => {
          alert("Failed to update car. Please try again.")
          console.error("Failed to update car:", error)
        },
      },
    )
  }

  const addGalleryImage = () => {
    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ""],
    }))
  }

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }))
  }

  const updateGalleryImage = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.map((img, i) => (i === index ? value : img)),
    }))
  }

  const addFeature = () => {
    setFeatures((prev) => [...prev, { type: "", name: "" }])
  }

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }

  const updateFeature = (index: number, field: keyof CarFeature, value: string) => {
    setFeatures((prev) => prev.map((feature, i) => (i === index ? { ...feature, [field]: value } : feature)))
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading car details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
          <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
          <span className="text-red-800">
            Error loading car details: {error?.message || "Unknown error"}
            <button
              className="ml-2 underline text-blue-600 hover:text-blue-800"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/cars")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cars
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Car</h1>
        <p className="text-gray-600">Update car information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData((prev) => ({ ...prev, year: Number.parseInt(e.target.value) }))}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                <input
                  type="number"
                  value={formData.seats}
                  onChange={(e) => setFormData((prev) => ({ ...prev, seats: Number.parseInt(e.target.value) }))}
                  min="1"
                  max="9"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                <select
                  value={formData.fuel}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fuel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select fuel type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exterior Color</label>
                <input
                  type="text"
                  value={formData.exteriorColor}
                  onChange={(e) => setFormData((prev) => ({ ...prev, exteriorColor: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) }))}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Image URL</label>
              <input
                type="url"
                value={formData.mainImage}
                onChange={(e) => setFormData((prev) => ({ ...prev, mainImage: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Gallery Images</label>
                <button
                  type="button"
                  onClick={addGalleryImage}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Image
                </button>
              </div>
              {formData.gallery.map((image, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => updateGalleryImage(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.gallery.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Features</h2>
            <button
              type="button"
              onClick={addFeature}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Feature
            </button>
          </div>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <select
                  value={feature.type}
                  onChange={(e) => updateFeature(index, "type", e.target.value)}
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Feature type</option>
                  <option value="Safety">Safety</option>
                  <option value="Interior">Interior</option>
                  <option value="Exterior">Exterior</option>
                  <option value="Technology">Technology</option>
                  <option value="Performance">Performance</option>
                  <option value="Special">Special</option>
                </select>
                <input
                  type="text"
                  value={feature.name}
                  onChange={(e) => updateFeature(index, "name", e.target.value)}
                  placeholder="Feature name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Updating..." : "Update Car"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/cars")}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
