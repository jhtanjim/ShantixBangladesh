"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Plus, X, AlertCircle, Car, Info, Settings, ImageIcon, Trash2 } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useCar, useUpdateCar } from "../../../../hooks/useCars"
import type { CarFeature } from "../../../../api/carService"

// Define the options arrays
const carTypes = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Wagon", "Truck", "Van"]
const fuelTypes = ["Gasoline", "Diesel", "Hybrid", "Electric", "CNG", "LPG"]
const transmissionTypes = ["Manual", "Automatic", "CVT", "Semi-Automatic"]
const driveTypes = ["FWD", "RWD", "AWD", "4WD"]
const featureTypes = ["Safety", "Special", "Exterior", "Interior"]

export function EditCarPage() {
  const navigate = useNavigate()
  const params = useParams()
  const carId = params.id as string
  const isEditMode = Boolean(carId)

  const { data: car, isLoading, error } = useCar(carId)
  const updateMutation = useUpdateCar()

  // Complete formData state with all required fields
  const [formData, setFormData] = useState({
    title: "",
    make: "",
    model: "",
    modelCode: "",
    type: "",
    mainImage: null as File | null,
    gallery: [] as File[],
    year: new Date().getFullYear(),
    fuel: "",
    engineCC: "",
    transmission: "",
    drive: "",
    exteriorColor: "",
    color: "", // interior color
    seats: 5,
    mileage: "",
    stock: "",
    country: "",
    region: "",
    keywords: "",
    price: 0,
    isActive: true,
    features: [] as CarFeature[],
  })

  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null)
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])

  useEffect(() => {
    if (car) {
      setFormData({
        title: car.title || "",
        make: car.make || "",
        model: car.model || "",
        modelCode: car.modelCode || "",
        type: car.type || "",
        mainImage: null, // File objects can't be restored from API
        gallery: [],
        year: car.year || new Date().getFullYear(),
        fuel: car.fuel || "",
        engineCC: car.engineCC || "",
        transmission: car.transmission || "",
        drive: car.drive || "",
        exteriorColor: car.exteriorColor || "",
        color: car.color || "",
        seats: car.seats || 5,
        mileage: car.mileage || "",
        stock: car.stock || "",
        country: car.country || "",
        region: car.region || "",
        keywords: car.keywords || "",
        price: car.price || 0,
        isActive: car.isActive !== undefined ? car.isActive : true,
        // Clean features by only keeping type and name properties
        features: (car.features || []).map((feature) => ({
          type: feature.type || "",
          name: feature.name || "",
        })),
      })

      // Set image previews if editing existing car
      if (car.mainImage) {
        setMainImagePreview(car.mainImage)
      }
      if (car.gallery && car.gallery.length > 0) {
        setGalleryPreviews(car.gallery)
      }
    }
  }, [car])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleBackClick = () => {
    navigate("/admin/cars")
  }

  const handleCancel = () => {
    navigate("/admin/cars")
  }

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, mainImage: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setMainImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const maxImages = 10
    const allowedFiles = files.slice(0, maxImages - formData.gallery.length)

    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...allowedFiles],
    }))

    // Create previews
    allowedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setGalleryPreviews((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }))
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { type: "", name: "" }],
    }))
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const updateFeature = (index: number, field: keyof CarFeature, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) => (i === index ? { ...feature, [field]: value } : feature)),
    }))
  }

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title.trim()) {
      alert("Please enter a car title")
      return
    }
    if (!formData.make.trim()) {
      alert("Please enter the car make")
      return
    }
    if (!formData.model.trim()) {
      alert("Please enter the car model")
      return
    }
    if (!formData.fuel) {
      alert("Please select a fuel type")
      return
    }
    if (!formData.exteriorColor.trim()) {
      alert("Please enter the exterior color")
      return
    }
    if (!isEditMode && !formData.mainImage) {
      alert("Please upload a main image")
      return
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData()

      // Add all form fields
    // Replace the gallery handling section in your handleSubmit function
// Change "gallery" to whatever your backend expects

Object.keys(formData).forEach((key) => {
  if (key === "gallery") {
    // Option A: Send with same field name multiple times
    formData.gallery.forEach((file) => {
      submitData.append("galleryImages", file)
    })
    
    // Option B: Send with indexed field names
    // formData.gallery.forEach((file, index) => {
    //   submitData.append(`gallery[${index}]`, file)
    // })
    
    // Option C: Send with numbered field names
    // formData.gallery.forEach((file, index) => {
    //   submitData.append(`gallery${index}`, file)
    // })
  } else if (key === "mainImage") {
    if (formData.mainImage) {
      submitData.append("mainImage", formData.mainImage)
    }
  } else if (key === "features") {
    submitData.append("features", JSON.stringify(formData.features))
  } else if (key === "year" || key === "seats" || key === "price") {
    submitData.append(key, String(formData[key]))
  } else if (key === "isActive") {
    submitData.append(key, String(formData[key]))
  } else if (formData[key] !== null && formData[key] !== "") {
    submitData.append(key, String(formData[key]))
  }
})

      if (isEditMode) {
        await updateMutation.mutateAsync({ id: carId, data: submitData })
        alert("Car updated successfully")
      } else {
        // You'll need a createCar mutation for new cars
        // await createMutation.mutateAsync(carData)
        alert("Car created successfully")
      }

      navigate("/admin/cars")
    } catch (error) {
      console.error("Failed to save car:", error)
      alert("Failed to save car. Please try again.")
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackClick}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors group"
          >
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Back to Cars
          </button>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <Car className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {isEditMode ? "Edit Car" : "Create New Car"}
            </h1>
            <p className="text-gray-600 text-lg">
              {isEditMode ? "Update vehicle information" : "Add a new vehicle to your inventory"}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-4">
                <Info className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Car Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Toyota Corolla Cross Z Leather 2022 Pearl White Hybrid"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Make <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.make}
                  onChange={(e) => handleInputChange("make", e.target.value)}
                  placeholder="Toyota"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  placeholder="Corolla Cross"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Model Code</label>
                <input
                  type="text"
                  value={formData.modelCode}
                  onChange={(e) => handleInputChange("modelCode", e.target.value)}
                  placeholder="ZX-123"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    handleInputChange("year", Number.parseInt(e.target.value) || new Date().getFullYear())
                  }
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Select type</option>
                  {carTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mr-4">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Technical Specifications</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fuel Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.fuel}
                  onChange={(e) => handleInputChange("fuel", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                  required
                >
                  <option value="">Select fuel type</option>
                  {fuelTypes.map((fuel) => (
                    <option key={fuel} value={fuel}>
                      {fuel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Engine CC</label>
                <input
                  type="text"
                  value={formData.engineCC}
                  onChange={(e) => handleInputChange("engineCC", e.target.value)}
                  placeholder="1800cc"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Transmission</label>
                <select
                  value={formData.transmission}
                  onChange={(e) => handleInputChange("transmission", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                >
                  <option value="">Select transmission</option>
                  {transmissionTypes.map((trans) => (
                    <option key={trans} value={trans}>
                      {trans}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Drive Type</label>
                <select
                  value={formData.drive}
                  onChange={(e) => handleInputChange("drive", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                >
                  <option value="">Select drive type</option>
                  {driveTypes.map((drive) => (
                    <option key={drive} value={drive}>
                      {drive}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Seats</label>
                <input
                  type="number"
                  value={formData.seats}
                  onChange={(e) => handleInputChange("seats", Number.parseInt(e.target.value) || 5)}
                  min="1"
                  max="9"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mileage</label>
                <input
                  type="text"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange("mileage", e.target.value)}
                  placeholder="50,000 km"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Exterior Color <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.exteriorColor}
                  onChange={(e) => handleInputChange("exteriorColor", e.target.value)}
                  placeholder="Pearl White"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Interior Color</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  placeholder="Black Leather"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Number</label>
                <input
                  type="text"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  placeholder="STK-001"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="Japan"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Region</label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  placeholder="Tokyo"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Keywords</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => handleInputChange("keywords", e.target.value)}
                  placeholder="hybrid, eco-friendly, family car, low mileage"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange("isActive", e.target.checked)}
                  className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-semibold text-gray-700">Active (visible to customers)</span>
              </label>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl mr-4">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Features</h2>
              </div>
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Feature
              </button>
            </div>

            <div className="space-y-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl">
                  <select
                    value={feature.type}
                    onChange={(e) => updateFeature(index, "type", e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-200"
                  >
                    <option value="">Select type</option>
                    {featureTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={feature.name}
                    onChange={(e) => updateFeature(index, "name", e.target.value)}
                    placeholder="Feature name"
                    className="flex-2 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}

              {formData.features.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No features added yet. Click "Add Feature" to get started.</p>
                </div>
              )}
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl mr-4">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Images</h2>
            </div>

            {/* Main Image */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Main Image {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-pink-400 transition-colors duration-200">
                {mainImagePreview ? (
                  <div className="relative">
                    <img
                      src={mainImagePreview || "/placeholder.svg"}
                      alt="Main preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMainImagePreview(null)
                        setFormData((prev) => ({ ...prev, mainImage: null }))
                        // Reset file input
                        const fileInput = document.getElementById("mainImageInput") as HTMLInputElement
                        if (fileInput) fileInput.value = ""
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 mb-4">Click to upload main image</p>
                    <input
                      id="mainImageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="mainImageInput"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl hover:from-pink-600 hover:to-rose-700 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Choose Image
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Gallery Images (Max 10)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                {galleryPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {galleryPreviews.length < 10 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-32 hover:border-pink-400 transition-colors duration-200">
                    <input
                      id="galleryInput"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImagesChange}
                      className="hidden"
                    />
                    <label htmlFor="galleryInput" className="cursor-pointer text-center">
                      <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Add Images</p>
                    </label>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">{galleryPreviews.length}/10 images uploaded</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pb-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={updateMutation.isPending}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {updateMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>{isEditMode ? "Update Car" : "Create Car"}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
