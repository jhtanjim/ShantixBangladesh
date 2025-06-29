"use client"

import { useState } from "react"
import { ArrowLeft, Plus, X, Car, ImageIcon, Settings, Info, Trash2 } from "lucide-react"
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
    seats: "",
    price: "",
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
    features: [], // Changed to array
  })

  const [galleryPreviews, setGalleryPreviews] = useState([])
  const [mainImagePreview, setMainImagePreview] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
// State declarations

// Compress image function
const compressImage = (file, maxWidth = 1200, maxHeight = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          })
          resolve(compressedFile)
        },
        file.type,
        quality
      )
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Handle main image change with compression
const handleMainImageChange = async (e) => {
  const file = e.target.files[0]
  if (file) {
    try {
      // Compress the image
      const compressedFile = await compressImage(file)
      
      setFormData((prev) => ({ ...prev, mainImage: compressedFile }))
      
      const reader = new FileReader()
      reader.onload = (e) => setMainImagePreview(e.target.result)
      reader.readAsDataURL(compressedFile)
    } catch (error) {
      console.error('Error compressing main image:', error)
      Swal.fire({
        icon: "error",
        title: "Image Processing Error",
        text: "Failed to process the image. Please try again.",
        confirmButtonColor: "#3B82F6",
      })
    }
  }
}

// Handle gallery images change with compression
const handleGalleryImagesChange = async (e) => {
  const files = Array.from(e.target.files)
  
  if (files.length + formData.galleryImages.length > 10) {
    Swal.fire({
      icon: "warning",
      title: "Too Many Images",
      text: "Maximum 10 gallery images allowed",
      confirmButtonColor: "#3B82F6",
    })
    return
  }

  try {
    // Compress all images
    const compressedFiles = await Promise.all(
      files.map(file => compressImage(file))
    )
    
    const newImages = [...formData.galleryImages, ...compressedFiles]
    setFormData((prev) => ({ ...prev, galleryImages: newImages }))

    // Create previews for compressed images
    compressedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setGalleryPreviews((prev) => [...prev, e.target.result])
      }
      reader.readAsDataURL(file)
    })
  } catch (error) {
    console.error('Error compressing gallery images:', error)
    Swal.fire({
      icon: "error",
      title: "Image Processing Error",
      text: "Failed to process some images. Please try again.",
      confirmButtonColor: "#3B82F6",
    })
  }
}

// Remove gallery image function
const removeGalleryImage = (index) => {
  setGalleryPreviews((prev) => prev.filter((_, i) => i !== index))
  setFormData((prev) => ({
    ...prev,
    galleryImages: prev.galleryImages.filter((_, i) => i !== index)
  }))
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

      if (missingFields.length > 0 || !formData.mainImage) {
        await Swal.fire({
          icon: "error",
          title: "Missing Information",
          text: ` Please fill in: ${missingFields.join(", ")}${!formData.mainImage ? ", Main Image" : ""}`,
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

      // Create FormData for file upload
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
    } catch (error) {
      console.error("Error creating car:", error)
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
    // Check if form has any data
    const hasData =
      formData.title || formData.make || formData.model || formData.mainImage || formData.galleryImages.length > 0

    if (hasData) {
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

  const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric", "CNG", "LPG"]
  const transmissionTypes = ["Manual", "Automatic", "CVT", "Semi-Automatic"]
  const driveTypes = ["Front Wheel Drive", "Rear Wheel Drive", "All Wheel Drive", "4WD"]
  const carTypes = ["Sedan", "Hatchback", "SUV", "Crossover", "Coupe", "Convertible", "Wagon", "Pickup", "Van", "Truck"]
  const featureTypes = ["Safety", "Interior", "Exterior", "Technology", "Performance", "Comfort", "Entertainment"]

  const carMakes = [
    "Toyota",
    "Honda",
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Nissan",
    "Ford",
    "Chevrolet",
    "Hyundai",
    "Kia",
    "Mazda",
    "Subaru",
    "Volkswagen",
    "Lexus",
    "Acura",
    "Infiniti",
    "Cadillac",
    "Lincoln",
    "Volvo",
    "Jaguar",
    "Land Rover",
    "Porsche",
    "Tesla",
  ]

  const carModels = [
    "Corolla",
    "Corolla Cross",
    "Camry",
    "RAV4",
    "Highlander",
    "Prius",
    "Civic",
    "Accord",
    "CR-V",
    "Pilot",
    "X3",
    "X5",
    "3 Series",
    "5 Series",
    "C-Class",
    "E-Class",
    "GLC",
    "GLE",
    "Q3",
    "Q5",
    "A4",
    "A6",
    "Altima",
    "Sentra",
    "Rogue",
    "Murano",
  ]

  const exteriorColors = [
    "Pearl White",
    "Jet Black",
    "Silver Metallic",
    "Gun Metallic",
    "Deep Blue",
    "Crimson Red",
    "Forest Green",
    "Golden Bronze",
    "Charcoal Gray",
    "Alpine White",
    "Midnight Black",
    "Storm Gray",
    "Ruby Red",
    "Ocean Blue",
    "Sunset Orange",
    "Ivory Pearl",
  ]

  const interiorColors = [
    "Black Leather",
    "Beige Leather",
    "Brown Leather",
    "Gray Fabric",
    "Black Fabric",
    "Tan Leather",
    "White Leather",
    "Red Leather",
    "Navy Fabric",
    "Charcoal Leather",
    "Cream Leather",
    "Saddle Brown",
  ]

  const countries = [
    "Japan",
    "Germany",
    "United States",
    "South Korea",
    "United Kingdom",
    "France",
    "Italy",
    "Sweden",
    "Canada",
    "Australia",
    "India",
    "China",
    "Mexico",
    "Brazil",
  ]

  const regions = [
    "Tokyo",
    "Osaka",
    "Kyoto",
    "Yokohama",
    "Nagoya",
    "Kobe",
    "Fukuoka",
    "Sapporo",
    "Sendai",
    "Hiroshima",
    "Munich",
    "Berlin",
    "Stuttgart",
    "Frankfurt",
    "California",
    "Texas",
    "New York",
    "Florida",
    "Michigan",
    "Ohio",
  ]

  const featureOptions = {
    Safety: [
      "ABS Brakes",
      "Airbags (Front)",
      "Airbags (Side)",
      "Airbags (Curtain)",
      "Electronic Stability Control",
      "Traction Control",
      "Blind Spot Monitoring",
      "Lane Departure Warning",
      "Forward Collision Warning",
      "Automatic Emergency Braking",
      "Backup Camera",
      "Parking Sensors",
    ],
    Interior: [
      "Leather Seats",
      "Heated Seats",
      "Ventilated Seats",
      "Power Seats",
      "Memory Seats",
      "Massage Seats",
      "Premium Audio System",
      "Navigation System",
      "Dual Zone Climate Control",
      "Tri-Zone Climate Control",
      "Heated Steering Wheel",
      "Wireless Charging",
    ],
    Exterior: [
      "Sunroof",
      "Panoramic Sunroof",
      "LED Headlights",
      "HID Headlights",
      "Fog Lights",
      "Roof Rails",
      "Running Boards",
      "Tow Package",
      "Alloy Wheels",
      "Chrome Trim",
    ],
    Technology: [
      "Apple CarPlay",
      "Android Auto",
      "Bluetooth Connectivity",
      "USB Ports",
      "WiFi Hotspot",
      "Remote Start",
      "Keyless Entry",
      "Push Button Start",
      "Digital Dashboard",
      "Head-Up Display",
    ],
    Performance: [
      "Turbo Engine",
      "Supercharged Engine",
      "Sport Mode",
      "Paddle Shifters",
      "Limited Slip Differential",
      "Performance Suspension",
      "Sport Exhaust",
      "Launch Control",
    ],
    Comfort: [
      "Cruise Control",
      "Adaptive Cruise Control",
      "Rain Sensing Wipers",
      "Auto Dimming Mirrors",
      "Power Liftgate",
      "Hands-Free Liftgate",
      "Third Row Seating",
      "Folding Rear Seats",
    ],
    Entertainment: [
      "Premium Sound System",
      "Subwoofer",
      "Rear Entertainment System",
      "DVD Player",
      "Satellite Radio",
      "HD Radio",
      "Multiple USB Ports",
      "Wireless Audio Streaming",
    ],
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
                <select
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  required
                >
                  <option value="">Select car title template</option>
                  <option value="Toyota Corolla Cross Z Leather 2022 Pearl White Hybrid">
                    Toyota Corolla Cross Z Leather 2022 Pearl White Hybrid
                  </option>
                  <option value="Honda CR-V EX-L 2023 Black Premium SUV">Honda CR-V EX-L 2023 Black Premium SUV</option>
                  <option value="BMW X3 xDrive30i 2022 Alpine White Luxury">
                    BMW X3 xDrive30i 2022 Alpine White Luxury
                  </option>
                  <option value="Mercedes-Benz C-Class C300 2023 Polar White Sedan">
                    Mercedes-Benz C-Class C300 2023 Polar White Sedan
                  </option>
                  <option value="Audi Q5 Premium Plus 2022 Glacier White SUV">
                    Audi Q5 Premium Plus 2022 Glacier White SUV
                  </option>
                  <option value="Nissan Altima SV 2023 Gun Metallic Sedan">
                    Nissan Altima SV 2023 Gun Metallic Sedan
                  </option>
                  <option value="Ford Explorer XLT 2022 Oxford White SUV">
                    Ford Explorer XLT 2022 Oxford White SUV
                  </option>
                  <option value="Chevrolet Equinox LT 2023 Summit White Crossover">
                    Chevrolet Equinox LT 2023 Summit White Crossover
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Make <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.make}
                  onChange={(e) => handleInputChange("make", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  required
                >
                  <option value="">Select make</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Audi">Audi</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Ford">Ford</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Kia">Kia</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Subaru">Subaru</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Lexus">Lexus</option>
                  <option value="Acura">Acura</option>
                  <option value="Infiniti">Infiniti</option>
                  <option value="Cadillac">Cadillac</option>
                  <option value="Lincoln">Lincoln</option>
                  <option value="Volvo">Volvo</option>
                  <option value="Jaguar">Jaguar</option>
                  <option value="Land Rover">Land Rover</option>
                  <option value="Porsche">Porsche</option>
                  <option value="Tesla">Tesla</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Model <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  required
                >
                  <option value="">Select model</option>
                  <option value="Corolla">Corolla</option>
                  <option value="Corolla Cross">Corolla Cross</option>
                  <option value="Camry">Camry</option>
                  <option value="RAV4">RAV4</option>
                  <option value="Highlander">Highlander</option>
                  <option value="Prius">Prius</option>
                  <option value="Civic">Civic</option>
                  <option value="Accord">Accord</option>
                  <option value="CR-V">CR-V</option>
                  <option value="Pilot">Pilot</option>
                  <option value="X3">X3</option>
                  <option value="X5">X5</option>
                  <option value="3 Series">3 Series</option>
                  <option value="5 Series">5 Series</option>
                  <option value="C-Class">C-Class</option>
                  <option value="E-Class">E-Class</option>
                  <option value="GLC">GLC</option>
                  <option value="GLE">GLE</option>
                  <option value="Q3">Q3</option>
                  <option value="Q5">Q5</option>
                  <option value="A4">A4</option>
                  <option value="A6">A6</option>
                  <option value="Altima">Altima</option>
                  <option value="Sentra">Sentra</option>
                  <option value="Rogue">Rogue</option>
                  <option value="Murano">Murano</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Model Code</label>
                <select
                  value={formData.modelCode}
                  onChange={(e) => handleInputChange("modelCode", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Select model code</option>
                  <option value="ZX-123">ZX-123</option>
                  <option value="LX-456">LX-456</option>
                  <option value="EX-789">EX-789</option>
                  <option value="DX-321">DX-321</option>
                  <option value="SX-654">SX-654</option>
                  <option value="GX-987">GX-987</option>
                  <option value="HX-147">HX-147</option>
                  <option value="MX-258">MX-258</option>
                  <option value="NX-369">NX-369</option>
                  <option value="PX-741">PX-741</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                <select
                  value={formData.year}
                  onChange={(e) =>
                    handleInputChange("year", Number.parseInt(e.target.value) || new Date().getFullYear())
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  required
                >
                  <option value="">Select year</option>
                  {Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => new Date().getFullYear() - i).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ),
                  )}
                </select>
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
                <select
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  required
                >
                  <option value="">Select price range</option>
                  <option value="5000">$5,000</option>
                  <option value="10000">$10,000</option>
                  <option value="15000">$15,000</option>
                  <option value="20000">$20,000</option>
                  <option value="25000">$25,000</option>
                  <option value="30000">$30,000</option>
                  <option value="35000">$35,000</option>
                  <option value="40000">$40,000</option>
                  <option value="45000">$45,000</option>
                  <option value="50000">$50,000</option>
                  <option value="60000">$60,000</option>
                  <option value="70000">$70,000</option>
                  <option value="80000">$80,000</option>
                  <option value="90000">$90,000</option>
                  <option value="100000">$100,000</option>
                  <option value="120000">$120,000</option>
                  <option value="150000">$150,000</option>
                  <option value="200000">$200,000</option>
                </select>
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
                <select
                  value={formData.engineCC}
                  onChange={(e) => handleInputChange("engineCC", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                >
                  <option value="">Select engine size</option>
                  <option value="1000cc">1000cc</option>
                  <option value="1200cc">1200cc</option>
                  <option value="1300cc">1300cc</option>
                  <option value="1400cc">1400cc</option>
                  <option value="1500cc">1500cc</option>
                  <option value="1600cc">1600cc</option>
                  <option value="1800cc">1800cc</option>
                  <option value="2000cc">2000cc</option>
                  <option value="2200cc">2200cc</option>
                  <option value="2400cc">2400cc</option>
                  <option value="2500cc">2500cc</option>
                  <option value="3000cc">3000cc</option>
                  <option value="3500cc">3500cc</option>
                  <option value="4000cc">4000cc</option>
                  <option value="5000cc">5000cc</option>
                  <option value="6000cc">6000cc</option>
                </select>
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
                <select
                  value={formData.seats}
                  onChange={(e) => handleInputChange("seats", Number.parseInt(e.target.value) || 5)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                  required
                >
                  <option value="">Select seats</option>
                  <option value="2">2 Seats</option>
                  <option value="3">3 Seats</option>
                  <option value="4">4 Seats</option>
                  <option value="5">5 Seats</option>
                  <option value="6">6 Seats</option>
                  <option value="7">7 Seats</option>
                  <option value="8">8 Seats</option>
                  <option value="9">9 Seats</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mileage</label>
                <select
                  value={formData.mileage}
                  onChange={(e) => handleInputChange("mileage", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                >
                  <option value="">Select mileage</option>
                  <option value="0 - 5,000 km">0 - 5,000 km</option>
                  <option value="5,000 - 10,000 km">5,000 - 10,000 km</option>
                  <option value="10,000 - 20,000 km">10,000 - 20,000 km</option>
                  <option value="20,000 - 30,000 km">20,000 - 30,000 km</option>
                  <option value="30,000 - 40,000 km">30,000 - 40,000 km</option>
                  <option value="40,000 - 50,000 km">40,000 - 50,000 km</option>
                  <option value="50,000 - 60,000 km">50,000 - 60,000 km</option>
                  <option value="60,000 - 80,000 km">60,000 - 80,000 km</option>
                  <option value="80,000 - 100,000 km">80,000 - 100,000 km</option>
                  <option value="100,000 - 120,000 km">100,000 - 120,000 km</option>
                  <option value="120,000 - 150,000 km">120,000 - 150,000 km</option>
                  <option value="150,000+ km">150,000+ km</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Exterior Color <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.exteriorColor}
                  onChange={(e) => handleInputChange("exteriorColor", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                  required
                >
                  <option value="">Select exterior color</option>
                  <option value="Pearl White">Pearl White</option>
                  <option value="Jet Black">Jet Black</option>
                  <option value="Silver Metallic">Silver Metallic</option>
                  <option value="Gun Metallic">Gun Metallic</option>
                  <option value="Deep Blue">Deep Blue</option>
                  <option value="Crimson Red">Crimson Red</option>
                  <option value="Forest Green">Forest Green</option>
                  <option value="Golden Bronze">Golden Bronze</option>
                  <option value="Charcoal Gray">Charcoal Gray</option>
                  <option value="Alpine White">Alpine White</option>
                  <option value="Midnight Black">Midnight Black</option>
                  <option value="Storm Gray">Storm Gray</option>
                  <option value="Ruby Red">Ruby Red</option>
                  <option value="Ocean Blue">Ocean Blue</option>
                  <option value="Sunset Orange">Sunset Orange</option>
                  <option value="Ivory Pearl">Ivory Pearl</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Interior Color</label>
                <select
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                >
                  <option value="">Select interior color</option>
                  <option value="Black Leather">Black Leather</option>
                  <option value="Beige Leather">Beige Leather</option>
                  <option value="Brown Leather">Brown Leather</option>
                  <option value="Gray Fabric">Gray Fabric</option>
                  <option value="Black Fabric">Black Fabric</option>
                  <option value="Tan Leather">Tan Leather</option>
                  <option value="White Leather">White Leather</option>
                  <option value="Red Leather">Red Leather</option>
                  <option value="Navy Fabric">Navy Fabric</option>
                  <option value="Charcoal Leather">Charcoal Leather</option>
                  <option value="Cream Leather">Cream Leather</option>
                  <option value="Saddle Brown">Saddle Brown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Number</label>
                <select
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                >
                  <option value="">Select stock number</option>
                  <option value="STK-001">STK-001</option>
                  <option value="STK-002">STK-002</option>
                  <option value="STK-003">STK-003</option>
                  <option value="STK-004">STK-004</option>
                  <option value="STK-005">STK-005</option>
                  <option value="STK-006">STK-006</option>
                  <option value="STK-007">STK-007</option>
                  <option value="STK-008">STK-008</option>
                  <option value="STK-009">STK-009</option>
                  <option value="STK-010">STK-010</option>
                  <option value="INV-2024-001">INV-2024-001</option>
                  <option value="INV-2024-002">INV-2024-002</option>
                  <option value="CAR-001">CAR-001</option>
                  <option value="CAR-002">CAR-002</option>
                  <option value="VIN-001">VIN-001</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                >
                  <option value="">Select country</option>
                  <option value="Japan">Japan</option>
                  <option value="Germany">Germany</option>
                  <option value="United States">United States</option>
                  <option value="South Korea">South Korea</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="France">France</option>
                  <option value="Italy">Italy</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="India">India</option>
                  <option value="China">China</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Brazil">Brazil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Region</label>
                <select
                  value={formData.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                >
                  <option value="">Select region</option>
                  <option value="Tokyo">Tokyo</option>
                  <option value="Osaka">Osaka</option>
                  <option value="Kyoto">Kyoto</option>
                  <option value="Yokohama">Yokohama</option>
                  <option value="Nagoya">Nagoya</option>
                  <option value="Kobe">Kobe</option>
                  <option value="Fukuoka">Fukuoka</option>
                  <option value="Sapporo">Sapporo</option>
                  <option value="Sendai">Sendai</option>
                  <option value="Hiroshima">Hiroshima</option>
                  <option value="Munich">Munich</option>
                  <option value="Berlin">Berlin</option>
                  <option value="Stuttgart">Stuttgart</option>
                  <option value="Frankfurt">Frankfurt</option>
                  <option value="California">California</option>
                  <option value="Texas">Texas</option>
                  <option value="New York">New York</option>
                  <option value="Florida">Florida</option>
                  <option value="Michigan">Michigan</option>
                  <option value="Ohio">Ohio</option>
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Keywords</label>
                <select
                  value={formData.keywords}
                  onChange={(e) => handleInputChange("keywords", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                >
                  <option value="">Select keywords</option>
                  <option value="hybrid, eco-friendly, family car, low mileage">
                    hybrid, eco-friendly, family car, low mileage
                  </option>
                  <option value="luxury, premium, leather seats, sunroof">
                    luxury, premium, leather seats, sunroof
                  </option>
                  <option value="sporty, performance, turbo, manual transmission">
                    sporty, performance, turbo, manual transmission
                  </option>
                  <option value="SUV, 4WD, spacious, cargo space">SUV, 4WD, spacious, cargo space</option>
                  <option value="compact, city car, fuel efficient, parking friendly">
                    compact, city car, fuel efficient, parking friendly
                  </option>
                  <option value="electric, zero emissions, modern technology">
                    electric, zero emissions, modern technology
                  </option>
                  <option value="reliable, well-maintained, single owner">
                    reliable, well-maintained, single owner
                  </option>
                  <option value="convertible, summer car, fun to drive">convertible, summer car, fun to drive</option>
                  <option value="truck, heavy duty, work vehicle, towing">
                    truck, heavy duty, work vehicle, towing
                  </option>
                  <option value="vintage, classic, collector, restored">vintage, classic, collector, restored</option>
                </select>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="lg:flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl mr-4">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Features</h2>
                  <p className="text-sm text-gray-600 mt-1">Add special features and equipment</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 mt-4 lg:mx-0 mx-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </button>
            </div>

            {formData.features.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Settings className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No features added yet</h3>
                <p className="text-gray-600 mb-4">Add features like ABS, leather seats, navigation system, etc.</p>
                <button
                  type="button"
                  onClick={addFeature}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Feature
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="lg:flex gap-4 items-center p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                      <select
                        value={feature.type}
                        onChange={(e) => updateFeature(index, "type", e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                        required
                      >
                        <option value="">Select Category</option>
                        {featureTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Feature Name</label>
                      <select
                        value={feature.name}
                        onChange={(e) => updateFeature(index, "name", e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                        required
                      >
                        <option value="">Select feature</option>
                        {/* Safety Features */}
                        <option value="ABS Brakes">ABS Brakes</option>
                        <option value="Airbags (Front)">Airbags (Front)</option>
                        <option value="Airbags (Side)">Airbags (Side)</option>
                        <option value="Airbags (Curtain)">Airbags (Curtain)</option>
                        <option value="Electronic Stability Control">Electronic Stability Control</option>
                        <option value="Traction Control">Traction Control</option>
                        <option value="Blind Spot Monitoring">Blind Spot Monitoring</option>
                        <option value="Lane Departure Warning">Lane Departure Warning</option>
                        <option value="Forward Collision Warning">Forward Collision Warning</option>
                        <option value="Automatic Emergency Braking">Automatic Emergency Braking</option>
                        <option value="Backup Camera">Backup Camera</option>
                        <option value="Parking Sensors">Parking Sensors</option>

                        {/* Interior Features */}
                        <option value="Leather Seats">Leather Seats</option>
                        <option value="Heated Seats">Heated Seats</option>
                        <option value="Ventilated Seats">Ventilated Seats</option>
                        <option value="Power Seats">Power Seats</option>
                        <option value="Memory Seats">Memory Seats</option>
                        <option value="Massage Seats">Massage Seats</option>
                        <option value="Premium Audio System">Premium Audio System</option>
                        <option value="Navigation System">Navigation System</option>
                        <option value="Dual Zone Climate Control">Dual Zone Climate Control</option>
                        <option value="Tri-Zone Climate Control">Tri-Zone Climate Control</option>
                        <option value="Heated Steering Wheel">Heated Steering Wheel</option>
                        <option value="Wireless Charging">Wireless Charging</option>

                        {/* Exterior Features */}
                        <option value="Sunroof">Sunroof</option>
                        <option value="Panoramic Sunroof">Panoramic Sunroof</option>
                        <option value="LED Headlights">LED Headlights</option>
                        <option value="HID Headlights">HID Headlights</option>
                        <option value="Fog Lights">Fog Lights</option>
                        <option value="Roof Rails">Roof Rails</option>
                        <option value="Running Boards">Running Boards</option>
                        <option value="Tow Package">Tow Package</option>
                        <option value="Alloy Wheels">Alloy Wheels</option>
                        <option value="Chrome Trim">Chrome Trim</option>

                        {/* Technology Features */}
                        <option value="Apple CarPlay">Apple CarPlay</option>
                        <option value="Android Auto">Android Auto</option>
                        <option value="Bluetooth Connectivity">Bluetooth Connectivity</option>
                        <option value="USB Ports">USB Ports</option>
                        <option value="WiFi Hotspot">WiFi Hotspot</option>
                        <option value="Remote Start">Remote Start</option>
                        <option value="Keyless Entry">Keyless Entry</option>
                        <option value="Push Button Start">Push Button Start</option>
                        <option value="Digital Dashboard">Digital Dashboard</option>
                        <option value="Head-Up Display">Head-Up Display</option>

                        {/* Performance Features */}
                        <option value="Turbo Engine">Turbo Engine</option>
                        <option value="Supercharged Engine">Supercharged Engine</option>
                        <option value="Sport Mode">Sport Mode</option>
                        <option value="Paddle Shifters">Paddle Shifters</option>
                        <option value="Limited Slip Differential">Limited Slip Differential</option>
                        <option value="Performance Suspension">Performance Suspension</option>
                        <option value="Sport Exhaust">Sport Exhaust</option>
                        <option value="Launch Control">Launch Control</option>

                        {/* Comfort Features */}
                        <option value="Cruise Control">Cruise Control</option>
                        <option value="Adaptive Cruise Control">Adaptive Cruise Control</option>
                        <option value="Rain Sensing Wipers">Rain Sensing Wipers</option>
                        <option value="Auto Dimming Mirrors">Auto Dimming Mirrors</option>
                        <option value="Power Liftgate">Power Liftgate</option>
                        <option value="Hands-Free Liftgate">Hands-Free Liftgate</option>
                        <option value="Third Row Seating">Third Row Seating</option>
                        <option value="Folding Rear Seats">Folding Rear Seats</option>

                        {/* Entertainment Features */}
                        <option value="Premium Sound System">Premium Sound System</option>
                        <option value="Subwoofer">Subwoofer</option>
                        <option value="Rear Entertainment System">Rear Entertainment System</option>
                        <option value="DVD Player">DVD Player</option>
                        <option value="Satellite Radio">Satellite Radio</option>
                        <option value="HD Radio">HD Radio</option>
                        <option value="Multiple USB Ports">Multiple USB Ports</option>
                        <option value="Wireless Audio Streaming">Wireless Audio Streaming</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors group"
                      title="Remove feature"
                    >
                      <Trash2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={addFeature}
                    className="inline-flex items-center px-4 py-2 text-blue-600 border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Feature
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Images */}
         {/* Images */}
<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300">
  <div className="flex flex-col sm:flex-row sm:items-center mb-6">
    <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl mb-3 sm:mb-0 sm:mr-4 w-fit">
      <ImageIcon className="h-6 w-6 text-white" />
    </div>
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Images</h2>
      <p className="text-sm text-gray-600 mt-1">Upload high-quality photos of your vehicle</p>
    </div>
  </div>

  <div className="space-y-6 sm:space-y-8">
    {/* Main Image Section */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Main Image <span className="text-red-500">*</span>
        <span className="block sm:inline text-xs text-gray-500 font-normal sm:ml-2">
          (This will be the primary photo shown)
        </span>
      </label>
      <div className="mt-1 flex justify-center px-4 sm:px-6 pt-6 sm:pt-8 pb-6 sm:pb-8 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-400 transition-all duration-200 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="space-y-2 text-center w-full">
          {mainImagePreview ? (
            <div className="relative group">
              <img
                src={mainImagePreview || "/placeholder.svg"}
                alt="Main preview"
                className="mx-auto h-32 w-48 sm:h-40 sm:w-60 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setMainImagePreview(null)
                    setFormData((prev) => ({ ...prev, mainImage: null }))
                  }}
                  className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-200 transform hover:scale-110"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
              <p className="text-xs text-green-600 font-medium mt-2">✓ Main image uploaded</p>
            </div>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4">
                <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <div className="flex justify-center text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500 px-3 py-2 sm:px-4 sm:py-2 border border-green-200 hover:border-green-300 transition-all duration-200">
                  <span className="text-xs sm:text-sm">Choose main image</span>
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
              <p className="text-xs text-blue-600">📱 Images will be automatically optimized</p>
            </>
          )}
        </div>
      </div>
    </div>

    {/* Gallery Images Section */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Gallery Images
        <span className="block sm:inline text-xs text-gray-500 font-normal sm:ml-2">
          (Max 10 images - {formData.galleryImages.length}/10 used)
        </span>
      </label>
      <div className="mt-1 flex justify-center px-4 sm:px-6 pt-6 sm:pt-8 pb-6 sm:pb-8 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-400 transition-all duration-200 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="space-y-2 text-center w-full">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4">
            <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          </div>
          <div className="flex justify-center text-sm text-gray-600">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500 px-3 py-2 sm:px-4 sm:py-2 border border-green-200 hover:border-green-300 transition-all duration-200">
              <span className="text-xs sm:text-sm">Add gallery images</span>
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
          <p className="text-xs text-blue-600">💡 Tip: Add interior, exterior, and engine photos</p>
          <p className="text-xs text-green-600">📱 All images will be automatically optimized</p>
        </div>
      </div>

      {/* Gallery Preview */}
      {galleryPreviews.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Gallery Preview ({galleryPreviews.length} images)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {galleryPreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview || "/placeholder.svg"}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-20 sm:h-24 object-cover rounded-lg shadow-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200 transform hover:scale-110"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
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
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Visibility Status</h2>
                <p className="text-sm text-gray-600 mt-1">Control whether this car appears on your website</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange("isActive", e.target.checked)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-3 text-sm font-medium text-gray-700">
                <span className="font-semibold">Make this car visible to customers</span>
                <span className="block text-xs text-gray-600 mt-1">
                  {formData.isActive
                    ? "✓ Car will appear in search results and listings"
                    : "⚠️ Car will be hidden from customers"}
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
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
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Car...
                </div>
              ) : (
                <div className="flex items-center">
                  <Car className="h-5 w-5 mr-2" />
                  Create Car
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
