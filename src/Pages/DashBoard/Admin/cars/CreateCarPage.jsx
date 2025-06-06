import { useState } from "react"
import { ArrowLeft, Plus, X, Car, Image, Settings, Info, Trash2 } from "lucide-react"
import { useCreateCar } from "../../../../hooks/useCars"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"

export default function CreateCarPage() {
  const navigate = useNavigate()
  const { mutate: createCar, isLoading } = useCreateCar()
  
  const [formData, setFormData] = useState({
    title: "",
    mainImage: null,
    galleryImages: [],
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
    features: [] // Changed to array
  })

  const [galleryPreviews, setGalleryPreviews] = useState([])
  const [mainImagePreview, setMainImagePreview] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMainImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, mainImage: file }))
      const reader = new FileReader()
      reader.onload = (e) => setMainImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + formData.galleryImages.length > 10) {
      Swal.fire({
        icon: 'warning',
        title: 'Too Many Images',
        text: 'Maximum 10 gallery images allowed',
        confirmButtonColor: '#3B82F6'
      })
      return
    }
    
    const newImages = [...formData.galleryImages, ...files]
    setFormData(prev => ({ ...prev, galleryImages: newImages }))
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setGalleryPreviews(prev => [...prev, e.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }))
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Feature management functions
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { type: "", name: "" }]
    }))
  }

  const updateFeature = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }))
  }

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    try {
      // Validation
      const requiredFields = ['title', 'make', 'model', 'fuel', 'exteriorColor']
      const missingFields = requiredFields.filter(field => !formData[field])
      
      if (missingFields.length > 0 || !formData.mainImage) {
        await Swal.fire({
          icon: 'error',
          title: 'Missing Information',
          text:` Please fill in: ${missingFields.join(', ')}${!formData.mainImage ? ', Main Image' : ''}`,
          confirmButtonColor: '#3B82F6'
        })
        return
      }
      
      // Validate features
      if (formData.features.some(feature => !feature.type || !feature.name)) {
        await Swal.fire({
          icon: 'error',
          title: 'Invalid Features',
          text: 'Please complete all feature entries or remove empty ones',
          confirmButtonColor: '#3B82F6'
        })
        return
      }
      
      // Create FormData for file upload
      const submitData = new FormData()
      
      // Add all form fields with proper type conversion
      Object.keys(formData).forEach(key => {
        if (key === 'galleryImages') {
          // Add each gallery image separately
          formData.galleryImages.forEach((file) => {
            submitData.append('galleryImages', file)
          })
        } else if (key === 'mainImage') {
          // Add main image if exists
          if (formData.mainImage) {
            submitData.append('mainImage', formData.mainImage)
          }
        } else if (key === 'features') {
          // Convert features array to JSON string
          submitData.append('features', JSON.stringify(formData.features))
        } else if (key === 'year' || key === 'seats' || key === 'price') {
          // Ensure numeric fields are sent as numbers
          submitData.append(key, Number(formData[key]))
        } else if (key === 'isActive') {
          // Ensure boolean field is sent as boolean
          submitData.append(key, Boolean(formData[key]))
        } else if (formData[key] !== null && formData[key] !== '') {
          // Add other fields as strings
          submitData.append(key, String(formData[key]))
        }
      })
      
      createCar(submitData, {
        onSuccess: async () => {
          await Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Car created successfully!',
            confirmButtonColor: '#10B981',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          })
          navigate('/admin/cars')
        },
        onError: async (error) => {
          console.error("Error creating car:", error)
          await Swal.fire({
            icon: 'error',
            title: 'Creation Failed',
            text: error?.response?.data?.message || 'Failed to create car. Please try again.',
            confirmButtonColor: '#EF4444'
          })
        }
      })
    } catch (error) {
      console.error("Error creating car:", error)
      await Swal.fire({
        icon: 'error',
        title: 'Unexpected Error',
        text: 'An unexpected error occurred. Please try again.',
        confirmButtonColor: '#EF4444'
      })
    }
  }

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'All unsaved changes will be lost!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, cancel',
      cancelButtonText: 'Continue editing'
    })

    if (result.isConfirmed) {
      navigate('/admin/cars')
    }
  }

  const handleBackClick = async () => {
    // Check if form has any data
    const hasData = formData.title || formData.make || formData.model || formData.mainImage || formData.galleryImages.length > 0
    
    if (hasData) {
      const result = await Swal.fire({
        title: 'Unsaved Changes',
        text: 'You have unsaved changes. Are you sure you want to go back?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Yes, go back',
        cancelButtonText: 'Stay here'
      })

      if (result.isConfirmed) {
        navigate('/admin/cars')
      }
    } else {
      navigate('/admin/cars')
    }
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
              Create New Car
            </h1>
            <p className="text-gray-600 text-lg">Add a new vehicle to your inventory</p>
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
                  onChange={(e) => handleInputChange('title', e.target.value)}
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
                  onChange={(e) => handleInputChange('make', e.target.value)}
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
                  onChange={(e) => handleInputChange('model', e.target.value)}
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
                  onChange={(e) => handleInputChange('modelCode', e.target.value)}
                  placeholder="ZX-123"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value) || new Date().getFullYear())}
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
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  required
                >
                  <option value="">Select type</option>
                  {carTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
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
                  onChange={(e) => handleInputChange('fuel', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                  required
                >
                  <option value="">Select fuel type</option>
                  {fuelTypes.map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Engine CC</label>
                <input
                  type="text"
                  value={formData.engineCC}
                  onChange={(e) => handleInputChange('engineCC', e.target.value)}
                  placeholder="1800cc"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Transmission</label>
                <select
                  value={formData.transmission}
                  onChange={(e) => handleInputChange('transmission', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                >
                  <option value="">Select transmission</option>
                  {transmissionTypes.map(trans => (
                    <option key={trans} value={trans}>{trans}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Drive Type</label>
                <select
                  value={formData.drive}
                  onChange={(e) => handleInputChange('drive', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                >
                  <option value="">Select drive type</option>
                  {driveTypes.map(drive => (
                    <option key={drive} value={drive}>{drive}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Seats</label>
                <input
                  type="number"
                  value={formData.seats}
                  onChange={(e) => handleInputChange('seats', parseInt(e.target.value) || 5)}
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
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
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
                  onChange={(e) => handleInputChange('exteriorColor', e.target.value)}
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
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  placeholder="Black Leather"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Number</label>
                <input
                  type="text"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="STK-001"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Japan"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Region</label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  placeholder="Tokyo"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Keywords</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => handleInputChange('keywords', e.target.value)}
                  placeholder="hybrid, eco-friendly, family car, low mileage"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl mr-4">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Features</h2>
              </div>
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </button>
            </div>

            {formData.features.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No features added yet. Click "Add Feature" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-4 items-center p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <select
                        value={feature.type}
                        onChange={(e) => updateFeature(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {featureTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-2">
                      <input
                        type="text"
                        value={feature.name}
                        onChange={(e) => updateFeature(index, 'name', e.target.value)}
                        placeholder="Feature name (e.g., ABS Brakes, Leather Seats)"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl mr-4">
                <Image className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Images</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Main Image <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-400 transition-colors">
                  <div className="space-y-1 text-center">
                    {mainImagePreview ? (
                      <div className="relative">
                        <img src={mainImagePreview} alt="Main preview" className="mx-auto h-32 w-48 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => {
                            setMainImagePreview(null)
                            setFormData(prev => ({ ...prev, mainImage: null }))
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Image className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                            <span>Upload main image</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleMainImageChange}
                              required
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gallery Images (Max 10)</label>
<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                        <span>Upload gallery images</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryImagesChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                </div>

                {galleryPreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img src={preview} alt={`Gallery ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl mr-4">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Status</h2>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-3 text-sm font-medium text-gray-700">
                Car is active and visible to customers
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Car'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}