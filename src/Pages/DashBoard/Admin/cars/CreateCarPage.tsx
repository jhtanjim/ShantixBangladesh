"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Plus, X } from "lucide-react"
import { useCreateCar } from "../../../../hooks/useCars"
import { useNavigate } from "react-router-dom"

interface CarFeature {
  type: string
  name: string
}

interface Car {
  _id?: string
  title: string
  mainImage: string
  gallery: string[]
  year: number
  fuel: string
  exteriorColor: string
  seats: number
  price: number
  isActive: boolean
  features: CarFeature[]
  createdAt?: string
  updatedAt?: string
}

export function CreateCarPage() {
  const navigate = useNavigate()
  const createMutation = useCreateCar()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Fixed: More strict filtering to ensure only complete features are included
    const validFeatures = features.filter((f) => 
      f.type.trim() !== "" && 
      f.name.trim() !== "" && 
      ["Safety", "Interior", "Exterior", "Special"].includes(f.type)
    )

    const carData: Omit<Car, "_id"> = {
      ...formData,
      gallery: formData.gallery.filter((img) => img.trim() !== ""),
      features: validFeatures,
    }

    createMutation.mutate(carData, {
      onSuccess: () => {
        alert("Car created successfully")
        navigate("/admin/cars")
      },
      onError: (error) => {
        alert("Failed to create car. Please try again.")
        console.error("Failed to create car:", error)
      },
    })
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
        <h1 className="text-3xl font-bold text-gray-900">Create New Car</h1>
        <p className="text-gray-600">Add a new car to your inventory</p>
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
                placeholder="Toyota Corolla Cross Z Leather 2022 Pearl White Hybrid"
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
                  placeholder="Pearl White"
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
                placeholder="/assets/images/first.jpg"
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
                    placeholder="/assets/images/gallery.jpg"
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
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create Car"}
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