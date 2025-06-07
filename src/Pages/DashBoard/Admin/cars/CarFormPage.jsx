"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, X, Car, ImageIcon, Settings, Info, Trash2, AlertCircle } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useCreateCar, useUpdateCar, useCar } from "../../../../hooks/useCars"
import Swal from "sweetalert2"

export default function CarFormPage() {
  const navigate = useNavigate()
  const params = useParams()
  const carId = params.id
  const isEditMode = !!carId

  // Hooks
  const { data: car, isLoading: loadingCar, error: loadError } = useCar(carId, { enabled: isEditMode })
  const { mutate: createCar, isLoading: creating } = useCreateCar()
  const { mutate: updateCar, isLoading: updating } = useUpdateCar()

  const isLoading = creating || updating

  const [formData, setFormData] = useState({
    title: "",
    mainImage: null, // File object for create, string URL for edit
    galleryImages: [], // Array of File objects for create, string URLs for edit
    year: new Date().getFullYear(),
    fuel: "",
    exteriorColor: "",
    seats: 5,
    price: 0,
    make: "",
    model: "",
    modelCode: "",
    type: "",
    engineCC: "",
    mileage: "",
    country: "",
    region: "",
    color: "",
    drive: "",
    transmission: "",
    stock: "",
    keywords: "",
    isActive: true,
    features: [],
  })

  const [galleryPreviews, setGalleryPreviews] = useState([])
  const [mainImagePreview, setMainImagePreview] = useState(null)
  const [newGalleryFiles, setNewGalleryFiles] = useState([]) // For edit mode - new files to upload

  // Load existing car data for edit mode
  useEffect(() => {
    if (car && isEditMode) {
      setFormData({
        title: car.title || "",
        mainImage: car.mainImage || null,
        galleryImages: car.gallery || [],
        year: car.year || new Date().getFullYear(),
        fuel: car.fuel || "",
        exteriorColor: car.exteriorColor || "",
        seats: car.seats || 5,
        price: car.price || 0,
        make: car.make || "",
        model: car.model || "",
        modelCode: car.modelCode || "",
        type: car.type || "",
        engineCC: car.engineCC || "",
        mileage: car.mileage || "",
        country: car.country || "",
        region: car.region || "",
        color: car.color || "",
        drive: car.drive || "",
        transmission: car.transmission || "",
        stock: car.stock || "",
        keywords: car.keywords || "",
        isActive: car.isActive !== undefined ? car.isActive : true,
        features: car.features || [],
      })

      // Set previews for existing images
      if (car.mainImage) {
        setMainImagePreview(car.mainImage)
      }
      if (car.gallery && car.gallery.length > 0) {
        setGalleryPreviews(car.gallery)
      }
    }
  }, [car, isEditMode])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleMainImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, mainImage: file }))
      const reader = new FileReader()
      reader.onload = (e) => setMainImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files)
    const currentCount = isEditMode
      ? formData.galleryImages.length + newGalleryFiles.length
      : formData.galleryImages.length

    if (files.length + currentCount > 10) {
      Swal.fire({
        icon: "warning",
        title: "Too Many Images",
        text: "Maximum 10 gallery images allowed",
        confirmButtonColor: "#3B82F6",
      })
      return
    }

    if (isEditMode) {
      // In edit mode, add to new files array
      setNewGalleryFiles((prev) => [...prev, ...files])
    } else {
      // In create mode, add to main array
      const newImages = [...formData.galleryImages, ...files]
      setFormData((prev) => ({ ...prev, galleryImages: newImages }))
    }

    // Create previews for new files
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setGalleryPreviews((prev) => [...prev, e.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeGalleryImage = (index) => {
    if (isEditMode) {
      const existingCount = formData.galleryImages.length
      if (index < existingCount) {
        // Removing existing image
        setFormData((prev) => ({
          ...prev,
          galleryImages: prev.galleryImages.filter((_, i) => i !== index),
        }))
      } else {
        // Removing new file
        const newFileIndex = index - existingCount
        setNewGalleryFiles((prev) => prev.filter((_, i) => i !== newFileIndex))
      }
    } else {
      // Create mode
      setFormData((prev) => ({
        ...prev,
        galleryImages: prev.galleryImages.filter((_, i) => i !== index),
      }))
    }
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Feature management functions
  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { type: "", name: "" }],
    }))
  }

  const updateFeature = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) => (i === index ? { ...feature, [field]: value } : feature)),
    }))
  }

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    try {
      // Validation
      const requiredFields = ["title", "make", "model", "fuel", "exteriorColor"]
      const missingFields = requiredFields.filter((field) => !formData[field])

      if (missingFields.length > 0 || (!isEditMode && !formData.mainImage)) {
        await Swal.fire({
          icon: "error",
          title: "Missing Information",
          text: `Please fill in: ${missingFields.join(", ")}${!isEditMode && !formData.mainImage ? ", Main Image" : ""}`,
          confirmButtonColor: "#3B82F6",
        })
        return
      }

      // Validate features
      if (formData.features.some((feature) => !feature.type || !feature.name)) {
        await Swal.fire({
          icon: "error",
          title: "Invalid Features",
          text: "Please complete all feature entries or remove empty ones",
          confirmButtonColor: "#3B82F6",
        })
        return
      }

      if (isEditMode) {
        // Update mode - send JSON data
        const updateData = {
          ...formData,
          galleryImages: undefined, // Remove file objects
          mainImage: typeof formData.mainImage === "string" ? formData.mainImage : undefined,
          gallery: formData.galleryImages.filter((img) => typeof img === "string"), // Keep existing URLs
          features: formData.features.filter((f) => f.type && f.name),
        }

        updateCar(
          { id: carId, data: updateData },
          {
            onSuccess: async () => {
              await Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Car updated successfully!",
                confirmButtonColor: "#10B981",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              })
              navigate("/admin/cars")
            },
            onError: async (error) => {
              console.error("Error updating car:", error)
              await Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: error?.response?.data?.message || "Failed to update car. Please try again.",
                confirmButtonColor: "#EF4444",
              })
            },
          },
        )
      } else {
        // Create mode - use FormData for file upload
        const submitData = new FormData()

        // Add all form fields with proper type conversion
        Object.keys(formData).forEach((key) => {
          if (key === "galleryImages") {
            // Add each gallery image separately
            formData.galleryImages.forEach((file) => {
              submitData.append("galleryImages", file)
            })
          } else if (key === "mainImage") {
            // Add main image if exists
            if (formData.mainImage) {
              submitData.append("mainImage", formData.mainImage)
            }
          } else if (key === "features") {
            // Convert features array to JSON string
            submitData.append("features", JSON.stringify(formData.features))
          } else if (key === "year" || key === "seats" || key === "price") {
            // Ensure numeric fields are sent as numbers
            submitData.append(key, Number(formData[key]))
          } else if (key === "isActive") {
            // Ensure boolean field is sent as boolean
            submitData.append(key, Boolean(formData[key]))
          } else if (formData[key] !== null && formData[key] !== "") {
            // Add other fields as strings
            submitData.append(key, String(formData[key]))
          }
        })

        createCar(submitData, {
          onSuccess: async () => {
            await Swal.fire({
              icon: "success",
              title: "Success!",
              text: "Car created successfully!",
              confirmButtonColor: "#10B981",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
            })
            navigate("/admin/cars")
          },
          onError: async (error) => {
            console.error("Error creating car:", error)
            await Swal.fire({
              icon: "error",
              title: "Creation Failed",
              text: error?.response?.data?.message || "Failed to create car. Please try again.",
              confirmButtonColor: "#EF4444",
            })
          },
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      await Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: "An unexpected error occurred. Please try again.",
        confirmButtonColor: "#EF4444",
      })
    }
  }

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "All unsaved changes will be lost!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, cancel",
      cancelButtonText: "Continue editing",
    })

    if (result.isConfirmed) {
      navigate("/admin/cars")
    }
  }

  const handleBackClick = async () => {
    // Check if form has any changes
    const hasChanges = isEditMode
      ? formData.title !== (car?.title || "") ||
        formData.make !== (car?.make || "") ||
        formData.model !== (car?.model || "") ||
        newGalleryFiles.length > 0 ||
        typeof formData.mainImage !== "string"
      : formData.title || formData.make || formData.model || formData.mainImage || formData.galleryImages.length > 0

    if (hasChanges) {
      const result = await Swal.fire({
        title: "Unsaved Changes",
        text: "You have unsaved changes. Are you sure you want to go back?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Yes, go back",
        cancelButtonText: "Stay here",
      })

      if (result.isConfirmed) {
        navigate("/admin/cars")
      }
    } else {
      navigate("/admin/cars")
    }
  }

  // Loading state for edit mode
  if (isEditMode && loadingCar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading car details...</p>
        </div>
      </div>
    )
  }

  // Error state for edit mode
  if (isEditMode && loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-red-800 font-semibold">Error loading car details</h3>
              <p className="text-red-700">{loadError?.message || "Unknown error occurred"}</p>
              <button
                className="mt-2 text-blue-600 hover:text-blue-800 underline"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric", "CNG", "LPG"]
  const transmissionTypes = ["Manual", "Automatic", "CVT", "Semi-Automatic"]
  const driveTypes = ["Front Wheel Drive", "Rear Wheel Drive", "All Wheel Drive", "4WD"]
  const carTypes = ["Sedan", "Hatchback", "SUV", "Crossover", "Coupe", "Convertible", "Wagon", "Pickup", "Van", "Truck"]
  const featureTypes = ["Safety", "Interior", "Exterior", "Technology", "Performance", "Comfort", "Entertainment"]

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
                  required
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
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 mb-2">Upload main car image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                    />
                  </div>
                )}
                {mainImagePreview && (
                  <div className="mt-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Gallery Images (Max 10)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-pink-400 transition-colors duration-200 mb-4">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 mb-2">Upload additional car images</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                  />
                </div>
              </div>

              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-pink-400 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold text-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isEditMode ? "Updating..." : "Creating..."}
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
