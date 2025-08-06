import {
  AlertCircle,
  ArrowLeft,
  Car,
  ImageIcon,
  Info,
  Plus,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  driveTypes,
  fuelTypes,
  transmissionTypes,
} from "../../../../api/cardata";
import { useCar, useCreateCar, useUpdateCar } from "../../../../hooks/useCars";

export function CarForm() {
  const featureTypes = [
    "Safety",
    "Interior",
    "Exterior",
    "Technology",
    "Performance",
    "Comfort",
    "Entertainment",
  ];
  const navigate = useNavigate();
  const params = useParams();
  const carId = params.id;
  const isEditMode = Boolean(carId);

  const { data: car, isLoading, error } = useCar(carId);
  const updateMutation = useUpdateCar();
  const createMutation = useCreateCar();
  // Complete formData state with all required fields
  const [formData, setFormData] = useState({
    title: "",
    make: "",
    model: "",
    modelCode: "",
    type: "",
    mainImage: null,
    gallery: [],
    year: new Date().getFullYear(),
    fuel: "",
    engineCC: "",
    transmission: "",
    drive: "",
    exteriorColor: "",
    color: "", // interior color
    seats: "",
    mileage: "",
    stock: "",
    country: "",
    region: "",
    keywords: "",
    price: "",
    isActive: true,
    features: [],
  });

  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

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
      });

      // Set image previews if editing existing car
      if (car.mainImage) {
        setMainImagePreview(car.mainImage);
      }
      if (car.gallery && car.gallery.length > 0) {
        setGalleryPreviews(car.gallery);
      }
    }
  }, [car]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBackClick = () => {
    navigate("/admin/cars");
  };

  const handleCancel = () => {
    navigate("/admin/cars");
  };

  const compressImage = (
    file,
    maxWidth = 1200,
    maxHeight = 800,
    quality = 0.8
  ) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > height && width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        } else if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file); // fallback if blob is null
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleMainImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressedFile = await compressImage(file);
      setFormData((prev) => ({ ...prev, mainImage: compressedFile }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setMainImagePreview(e.target?.result);
      };
      reader.readAsDataURL(compressedFile);
    }
  };

  const handleGalleryImagesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    const maxImages = 10;
    const allowedFiles = files.slice(0, maxImages - formData.gallery.length);

    const compressedFiles = await Promise.all(
      allowedFiles.map((file) => compressImage(file))
    );

    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...compressedFiles],
    }));

    // Create previews
    compressedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGalleryPreviews((prev) => [...prev, e.target?.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { type: "", name: "" }],
    }));
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? { ...feature, [field]: value } : feature
      ),
    }));
  };

  const handleSubmit = async () => {
    // Basic validation with Swal
    if (!formData.title.trim()) {
      return await Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter a car title",
        confirmButtonColor: "#ffc107",
      });
    }

    if (!formData.make.trim()) {
      return await Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter the car make",
        confirmButtonColor: "#ffc107",
      });
    }

    if (!formData.model.trim()) {
      return await Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter the car model",
        confirmButtonColor: "#ffc107",
      });
    }

    if (!formData.fuel) {
      return await Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please select a fuel type",
        confirmButtonColor: "#ffc107",
      });
    }

    if (!formData.exteriorColor.trim()) {
      return await Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter the exterior color",
        confirmButtonColor: "#ffc107",
      });
    }

    // Number validations
    if (
      formData.year &&
      (isNaN(formData.year) ||
        formData.year < 1900 ||
        formData.year > new Date().getFullYear() + 1)
    ) {
      return await Swal.fire({
        icon: "warning",
        title: "Invalid Year",
        text:
          "Please enter a valid year (1900 - " +
          (new Date().getFullYear() + 1) +
          ")",
        confirmButtonColor: "#ffc107",
      });
    }

    if (
      formData.price &&
      (isNaN(formData.price) || Number(formData.price) < 0)
    ) {
      return await Swal.fire({
        icon: "warning",
        title: "Invalid Price",
        text: "Please enter a valid price (numbers only)",
        confirmButtonColor: "#ffc107",
      });
    }

    if (
      formData.seats &&
      (isNaN(formData.seats) ||
        Number(formData.seats) < 1 ||
        Number(formData.seats) > 50)
    ) {
      return await Swal.fire({
        icon: "warning",
        title: "Invalid Seats",
        text: "Please enter a valid number of seats (1-50)",
        confirmButtonColor: "#ffc107",
      });
    }

    if (
      formData.engineCC &&
      (isNaN(formData.engineCC) ||
        Number(formData.engineCC) < 100 ||
        Number(formData.engineCC) > 10000)
    ) {
      return await Swal.fire({
        icon: "warning",
        title: "Invalid Engine CC",
        text: "Please enter a valid engine CC (100-10000)",
        confirmButtonColor: "#ffc107",
      });
    }

    if (
      formData.mileage &&
      (isNaN(formData.mileage) || Number(formData.mileage) < 0)
    ) {
      return await Swal.fire({
        icon: "warning",
        title: "Invalid Mileage",
        text: "Please enter a valid mileage (numbers only)",
        confirmButtonColor: "#ffc107",
      });
    }

    if (!isEditMode && !formData.mainImage) {
      return await Swal.fire({
        icon: "warning",
        title: "Missing Image",
        text: "Please upload a main image",
        confirmButtonColor: "#ffc107",
      });
    }

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        if (key === "gallery") {
          value.forEach((file) => {
            submitData.append("galleryImages", file); // Adjust field name to match backend
          });
        } else if (key === "mainImage") {
          if (value) submitData.append("mainImage", value);
        } else if (key === "features") {
          submitData.append("features", JSON.stringify(value));
        } else if (
          key === "year" ||
          key === "seats" ||
          key === "price" ||
          key === "stock" ||
          key === "engineCC" ||
          key === "mileage"
        ) {
          if (value !== null && value !== "") {
            submitData.append(key, String(value));
          }
        } else if (key === "isActive") {
          submitData.append("isActive", String(value));
        } else if (value !== null && value !== "") {
          submitData.append(key, value);
        }
      });

      if (isEditMode) {
        await updateMutation.mutateAsync({ id: carId, data: submitData });
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Car updated successfully",
          confirmButtonColor: "#28a745",
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        await createMutation.mutateAsync(submitData);
        await Swal.fire({
          icon: "success",
          title: "Car Created!",
          text: "The car has been added successfully.",
          confirmButtonColor: "#007bff",
          timer: 2000,
          timerProgressBar: true,
        });
      }
      navigate("/admin/cars");
    } catch (error) {
      console.error("Failed to save car:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save car. Please try again.",
        confirmButtonColor: "#dc3545",
      });
    }
  };
  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading car details...</p>
      </div>
    );
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="lg:p-6 max-w-6xl mx-auto">
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
              {isEditMode
                ? "Update vehicle information"
                : "Add a new vehicle to your inventory"}
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
              <h2 className="text-2xl font-bold text-gray-800">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Car Title */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Car Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter car title (e.g., Toyota Corolla Cross Z Leather 2022 Pearl White Hybrid)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              {/* Make */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.make}
                  onChange={(e) => handleInputChange("make", e.target.value)}
                  placeholder="Enter brand (e.g., Toyota)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Model & Package <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  placeholder="Enter model (e.g., Corolla Cross)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              {/* Model Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Score & Model Code
                </label>
                <input
                  type="text"
                  value={formData.modelCode}
                  onChange={(e) =>
                    handleInputChange("modelCode", e.target.value)
                  }
                  placeholder="Enter model code (e.g., ZX-123)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  placeholder="Enter year (e.g., 2022)"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  placeholder="Enter type (e.g., SUV, Sedan, Hatchback)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="Enter price (e.g., 25000)"
                  min="0"
                  step="100"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
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
              <h2 className="text-2xl font-bold text-gray-800">
                Technical Specifications
              </h2>
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
                    <option key={fuel} value={fuel}>
                      {fuel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Engine CC */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Engine CC
                </label>
                <input
                  type="number"
                  value={formData.engineCC}
                  onChange={(e) =>
                    handleInputChange("engineCC", e.target.value)
                  }
                  placeholder="Enter engine CC (e.g., 1500cc)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transmission
                </label>
                <select
                  value={formData.transmission}
                  onChange={(e) =>
                    handleInputChange("transmission", e.target.value)
                  }
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

              {/* Drive Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Drive Type
                </label>
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

              {/* Seats */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Seats
                </label>
                <input
                  type="number"
                  value={formData.seats}
                  onChange={(e) => handleInputChange("seats", e.target.value)}
                  placeholder="Enter number of seats (e.g., 5)"
                  min="2"
                  max="9"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              {/* Mileage */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mileage
                </label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange("mileage", e.target.value)}
                  placeholder="Enter mileage (e.g., 50,000 km)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              {/* Exterior Color */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Exterior Color <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.exteriorColor}
                  onChange={(e) =>
                    handleInputChange("exteriorColor", e.target.value)
                  }
                  placeholder="Enter exterior color"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              {/* Interior Color */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Interior Color
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  placeholder="Enter interior color"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              {/* Stock Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stock Number
                </label>
                <input
                  type="text"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  placeholder="Enter stock number (e.g., STK-001)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="Enter country (e.g., Japan, USA)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              {/* Region */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Region
                </label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  placeholder="Enter region (e.g., Tokyo, California)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    handleInputChange("isActive", e.target.checked)
                  }
                  className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Active (visible to customers)
                </span>
              </label>
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
                  <p className="text-sm text-gray-600 mt-1">
                    Add special features and equipment
                  </p>
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
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No features added yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Add features like ABS, leather seats, navigation system, etc.
                </p>
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
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Category
                      </label>
                      <select
                        value={feature.type}
                        onChange={(e) =>
                          updateFeature(index, "type", e.target.value)
                        }
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
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Feature Name
                      </label>
                      <input
                        type="text"
                        value={feature.name}
                        onChange={(e) =>
                          updateFeature(index, "name", e.target.value)
                        }
                        placeholder="Enter feature name"
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                        required
                      />
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
                Main Image{" "}
                {!isEditMode && <span className="text-red-500">*</span>}
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
                        setMainImagePreview(null);
                        setFormData((prev) => ({ ...prev, mainImage: null }));
                        // Reset file input
                        const fileInput =
                          document.getElementById("mainImageInput");
                        if (fileInput) fileInput.value = "";
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 mb-4">
                      Click to upload main image
                    </p>
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
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Gallery Images (Max 10)
              </label>
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
                    <label
                      htmlFor="galleryInput"
                      className="cursor-pointer text-center"
                    >
                      <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Add Images</p>
                    </label>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {galleryPreviews.length}/10 images uploaded
              </p>
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
              disabled={updateMutation.isPending || createMutation.isPending}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {updateMutation.isPending || createMutation.isPending ? (
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
  );
}
