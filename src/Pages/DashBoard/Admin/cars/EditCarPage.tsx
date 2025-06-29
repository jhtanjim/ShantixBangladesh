"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Plus, X, AlertCircle, Car, Info, Settings, ImageIcon, Trash2 } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useCar, useUpdateCar } from "../../../../hooks/useCars"
import type { CarFeature } from "../../../../api/carService"
import Swal from "sweetalert2"

// Define the options arrays
const carTypes = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Wagon", "Truck", "Van"]
const fuelTypes = ["Gasoline", "Diesel", "Hybrid", "Electric", "CNG", "LPG"]
const transmissionTypes = ["Manual", "Automatic", "CVT", "Semi-Automatic"]
const driveTypes = ["FWD", "RWD", "AWD", "4WD"]
const featureTypes = ["Safety", "Special", "Exterior", "Interior"]

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
const engineCCOptions = [
  "1000cc",
  "1200cc",
  "1500cc",
  "1600cc",
  "1800cc",
  "2000cc",
  "2200cc",
  "2500cc",
  "3000cc",
  "3500cc",
  "4000cc",
];
const seatOptions = [2, 4, 5, 6, 7, 8, 9];
const mileageOptions = [
  "0 km",
  "10,000 km",
  "20,000 km",
  "30,000 km",
  "50,000 km",
  "75,000 km",
  "100,000 km",
  "150,000 km",
  "200,000 km+",
];
const keywordOptions = [
  "hybrid",
  "eco-friendly",
  "family car",
  "sports",
  "low mileage",
  "luxury",
  "off-road",
  "compact",
  "city car",
  "imported",
];
const stockNumberOptions = [
  "STK-001",
  "STK-002",
  "STK-003",
  "STK-004",
  "STK-005",
  "STK-006",
  "STK-007",
];



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


  const compressImage = (
  file: File,
  maxWidth = 1200,
  maxHeight = 800,
  quality = 0.8
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      let { width, height } = img

      if (width > height && width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      } else if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      canvas.width = width
      canvas.height = height
      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob!], file.name, {
            type: file.type,
            lastModified: Date.now(),
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


const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (file) {
    const compressedFile = await compressImage(file)
    setFormData((prev) => ({ ...prev, mainImage: compressedFile }))

    const reader = new FileReader()
    reader.onload = (e) => {
      setMainImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(compressedFile)
  }
}

const handleGalleryImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || [])
  const maxImages = 10
  const allowedFiles = files.slice(0, maxImages - formData.gallery.length)

  const compressedFiles = await Promise.all(allowedFiles.map(file => compressImage(file)))

  setFormData((prev) => ({
    ...prev,
    gallery: [...prev.gallery, ...compressedFiles],
  }))

  // Create previews
  compressedFiles.forEach((file) => {
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
  if (!formData.title.trim()) return alert("Please enter a car title")
  if (!formData.make.trim()) return alert("Please enter the car make")
  if (!formData.model.trim()) return alert("Please enter the car model")
  if (!formData.fuel) return alert("Please select a fuel type")
  if (!formData.exteriorColor.trim()) return alert("Please enter the exterior color")
  if (!isEditMode && !formData.mainImage) return alert("Please upload a main image")

  try {
    const submitData = new FormData()

    Object.keys(formData).forEach((key) => {
      const value = formData[key]

      if (key === "gallery") {
        value.forEach((file) => {
          submitData.append("galleryImages", file) // Adjust field name to match backend
        })
      } else if (key === "mainImage") {
        if (value) submitData.append("mainImage", value)
      } else if (key === "features") {
        submitData.append("features", JSON.stringify(value))
      } else if (
        key === "year" ||
        key === "seats" ||
        key === "price" ||
        key === "stock" ||
        key === "engineCC" ||
        key === "mileage"
      ) {
        if (value !== null && value !== "") {
          submitData.append(key, String(value))
        }
      } else if (key === "isActive") {
        submitData.append("isActive", String(value))
      } else if (value !== null && value !== "") {
        submitData.append(key, value)
      }
    })

    if (isEditMode) {
      await updateMutation.mutateAsync({ id: carId, data: submitData })

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Car updated successfully",
        confirmButtonColor: "#28a745",
        timer: 2000,
        timerProgressBar: true,
      })
    } else {
      await createMutation.mutateAsync(submitData)

      await Swal.fire({
        icon: "success",
        title: "Car Created!",
        text: "The car has been added successfully.",
        confirmButtonColor: "#007bff",
        timer: 2000,
        timerProgressBar: true,
      })
    }

    navigate("/admin/cars")
  } catch (error) {
    console.error("Failed to save car:", error)
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to save car. Please try again.",
    })
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
    {/* Car Title */}
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
        <option value="Honda CR-V EX-L 2023 Black Premium SUV">
          Honda CR-V EX-L 2023 Black Premium SUV
        </option>
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

    {/* Make */}
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
        {carMakes.map((make) => (
          <option key={make} value={make}>{make}</option>
        ))}
      </select>
    </div>

    {/* Model */}
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
        {carModels.map((model) => (
          <option key={model} value={model}>{model}</option>
        ))}
      </select>
    </div>

    {/* Model Code */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Model Code</label>
      <select
        value={formData.modelCode}
        onChange={(e) => handleInputChange("modelCode", e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
      >
        <option value="">Select model code</option>
        {["ZX-123","LX-456","EX-789","DX-321","SX-654","GX-987","HX-147","MX-258","NX-369","PX-741"].map((code) => (
          <option key={code} value={code}>{code}</option>
        ))}
      </select>
    </div>

    {/* Year */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
      <select
        value={formData.year}
        onChange={(e) => handleInputChange("year", parseInt(e.target.value))}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
        required
      >
        <option value="">Select year</option>
        {Array.from({ length: (new Date().getFullYear() + 1) - 1990 }, (_, i) => 1990 + i).map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>

    {/* Type */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
      <select
        value={formData.type}
        onChange={(e) => handleInputChange("type", e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
      >
        <option value="">Select type</option>
        {carTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>

    {/* Price */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
      <select
        value={formData.price}
        onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
        required
      >
        <option value="">Select price</option>
        {[
          10000,15000,20000,25000,30000,35000,40000,45000,50000,60000,
          75000,100000,150000,200000
        ].map((price) => (
          <option key={price} value={price}>{`$${price.toLocaleString()}`}</option>
        ))}
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

    {/* Fuel Type */}
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
          <option key={fuel} value={fuel}>{fuel}</option>
        ))}
      </select>
    </div>

    {/* Engine CC */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Engine CC</label>
      <select
        value={formData.engineCC}
        onChange={(e) => handleInputChange("engineCC", e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
      >
        <option value="">Select engine CC</option>
        {["1000cc","1200cc","1500cc","1600cc","1800cc","2000cc","2200cc","2500cc","3000cc","3500cc","4000cc"].map((cc) => (
          <option key={cc} value={cc}>{cc}</option>
        ))}
      </select>
    </div>

    {/* Transmission */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Transmission</label>
      <select
        value={formData.transmission}
        onChange={(e) => handleInputChange("transmission", e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
      >
        <option value="">Select transmission</option>
        {transmissionTypes.map((trans) => (
          <option key={trans} value={trans}>{trans}</option>
        ))}
      </select>
    </div>

    {/* Drive Type */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Drive Type</label>
      <select
        value={formData.drive}
        onChange={(e) => handleInputChange("drive", e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
      >
        <option value="">Select drive type</option>
        {driveTypes.map((drive) => (
          <option key={drive} value={drive}>{drive}</option>
        ))}
      </select>
    </div>

    {/* Seats */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Seats</label>
      <select
        value={formData.seats}
        onChange={(e) => handleInputChange("seats", parseInt(e.target.value))}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
        required
      >
        <option value="">Select seats</option>
        {[2,4,5,6,7,8,9].map((seat) => (
          <option key={seat} value={seat}>{seat}</option>
        ))}
      </select>
    </div>

    {/* Mileage */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Mileage</label>
      <select
        value={formData.mileage}
        onChange={(e) => handleInputChange("mileage", e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
      >
        <option value="">Select mileage</option>
        {["0 km","10,000 km","20,000 km","30,000 km","50,000 km","75,000 km","100,000 km","150,000 km","200,000 km+"].map((mile) => (
          <option key={mile} value={mile}>{mile}</option>
        ))}
      </select>
    </div>

    {/* Exterior Color */}
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
        {exteriorColors.map((color) => (
          <option key={color} value={color}>{color}</option>
        ))}
      </select>
    </div>

    {/* Interior Color */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Interior Color</label>
      <select
        value={formData.color}
        onChange={(e) => handleInputChange("color", e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
      >
        <option value="">Select interior color</option>
        {interiorColors.map((color) => (
          <option key={color} value={color}>{color}</option>
        ))}
      </select>
    </div>

    {/* Stock Number */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Number</label>
      <select
        value={formData.stock}
        onChange={(e) => handleInputChange("stock", e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
      >
        <option value="">Select stock number</option>
        {["STK-001","STK-002","STK-003","STK-004","STK-005"].map((stock) => (
          <option key={stock} value={stock}>{stock}</option>
        ))}
      </select>
    </div>

    {/* Country */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
      <select
        value={formData.country}
        onChange={(e) => handleInputChange("country", e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
      >
        <option value="">Select country</option>
        {countries.map((country) => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>
    </div>

    {/* Region */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Region</label>
      <select
        value={formData.region}
        onChange={(e) => handleInputChange("region", e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
      >
        <option value="">Select region</option>
        {regions.map((region) => (
          <option key={region} value={region}>{region}</option>
        ))}
      </select>
    </div>

    {/* Keywords */}
    <div className="md:col-span-2 lg:col-span-3">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Keywords</label>
      <select
        value={formData.keywords}
        onChange={(e) => handleInputChange("keywords", e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
      >
        <option value="">Select keyword</option>
        {["hybrid","eco-friendly","family car","sports","low mileage","luxury","off-road","compact","city car","imported"].map((kw) => (
          <option key={kw} value={kw}>{kw}</option>
        ))}
      </select>
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
      <div key={index} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl flex-wrap">
        {/* Select for type */}
        <select
          value={feature.type}
          onChange={(e) => {
            updateFeature(index, "type", e.target.value);
            updateFeature(index, "name", ""); // reset name if type changes
          }}
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-200"
        >
          <option value="">Select type</option>
          {Object.keys(featureOptions).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Select for name based on type */}
        <select
          value={feature.name}
          onChange={(e) => updateFeature(index, "name", e.target.value)}
          disabled={!feature.type}
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-200 disabled:opacity-50"
        >
          <option value="">Select feature</option>
          {feature.type &&
            featureOptions[feature.type].map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
        </select>

        {/* Delete button */}
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
