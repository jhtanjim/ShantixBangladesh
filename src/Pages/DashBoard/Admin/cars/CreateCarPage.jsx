
import  { useState } from "react"
import { ArrowLeft, Plus, X, Car, Image, Settings, Info } from "lucide-react"
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
    features: ""
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

  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.title || !formData.make || !formData.model || !formData.fuel || !formData.exteriorColor || !formData.mainImage) {
        await Swal.fire({
          icon: 'error',
          title: 'Missing Information',
          text: 'Please fill in all required fields and upload a main image',
          confirmButtonColor: '#3B82F6'
        })
        return
      }
      
      // Create FormData for file upload
      const submitData = new FormData()
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'galleryImages') {
          formData.galleryImages.forEach((file, index) => {
            submitData.append(`galleryImages`, file)
          })
        } else if (key === 'mainImage') {
          if (formData.mainImage) {
            submitData.append('mainImage', formData.mainImage)
          }
        } else {
          submitData.append(key, formData[key])
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
            text: 'Failed to create car. Please try again.',
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
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
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
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
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
                  onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
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

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Features</label>
                <textarea
                  value={formData.features}
                  onChange={(e) => handleInputChange('features', e.target.value)}
                  placeholder="Air conditioning, GPS navigation, backup camera, leather seats, sunroof, Bluetooth connectivity"
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 resize-none"
                />
              </div>
            </div>
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
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img src={preview} alt={`Gallery ${index + 1}`} className="h-24 w-full object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
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

          {/* Active Status */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Listing Status</h3>
                <p className="text-gray-600">Make this car visible to customers</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                "Create Car"
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
            className="flex-1 bg-gray-200 text-gray-700 py-4 px-8 rounded-xl hover:bg-gray-300 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}