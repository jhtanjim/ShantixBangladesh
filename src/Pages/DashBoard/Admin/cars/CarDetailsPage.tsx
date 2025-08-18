"use client";

import {
  ArrowLeft,
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  Fuel,
  MapPin,
  Palette,
  Settings,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { DollarSign, Edit, Eye, EyeOff, Tag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CompactSpecCard } from "../../../../components/CompactSpecCard/CompactSpecCard";
import {
  useActivateCar,
  useCar,
  useDeactivateCar,
  useDeleteCar,
} from "../../../../hooks/useCars";

export function CarDetailsPage() {
  const navigate = useNavigate();
  const params = useParams();
  const carId = params.id as string;

  const { data: car, isLoading, error, refetch } = useCar(carId);
  console.log(car);
  const deleteMutation = useDeleteCar();
  const activateMutation = useActivateCar();
  const deactivateMutation = useDeactivateCar();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(carId, {
      onSuccess: () => {
        alert("Car deleted successfully");
        navigate("/admin/cars");
      },
      onError: (error) => {
        console.error("Failed to delete car:", error);
        alert("Failed to delete car. Please try again.");
      },
    });
  };

  const handleToggleStatus = () => {
    if (!car) return;

    const mutation = car.isActive ? deactivateMutation : activateMutation;
    mutation.mutate(car.id!, {
      onSuccess: () => refetch(),
      onError: (error) => {
        console.error("Failed to toggle car status:", error);
        alert("Failed to update car status. Please try again.");
      },
    });
  };

  const handleEdit = () => {
    navigate(`/admin/cars/edit/${carId}`);
  };

  const handlePreviousImage = () => {
    if (!car) return;
    const allImages = [car.mainImage, ...car.gallery].filter(Boolean);
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!car) return;
    const allImages = [car.mainImage, ...car.gallery].filter(Boolean);
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading car details...</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="p-4 sm:p-6">
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
    );
  }

  const allImages = [car.mainImage, ...car.gallery].filter(Boolean);
  const currentImage = allImages[currentImageIndex];

  // Group features by type, handling empty types
  const featuresByType = car.features.reduce((acc, feature) => {
    const featureType = feature.type || "Other";
    if (!acc[featureType]) {
      acc[featureType] = [];
    }
    acc[featureType].push(feature);
    return acc;
  }, {} as Record<string, typeof car.features>);

  // Helper function to format values
  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") {
      return "Not specified";
    }
    return value.toString();
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800";
      case "SOLD":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/cars")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cars
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {car.title}
            </h1>
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 flex-wrap">
              {car.make && (
                <span className="flex items-center">
                  <Car className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {car.make} {car.model && `${car.model}`}
                </span>
              )}
              <span className="flex items-center">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {car.year}
              </span>
              <span className="flex items-center">
                <Fuel className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {car.fuel}
              </span>
              <span className="flex items-center">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {car.seats} seats
              </span>
              <span className="flex items-center">
                <Palette className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {car.exteriorColor}
              </span>
              {car.type && (
                <span className="flex items-center">
                  <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {car.type}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(
                car.status
              )}`}
            >
              {car.status}
            </span>
            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                car.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {car.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Images Section */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            {/* Main Image */}
            <div className="relative h-64 sm:h-80 lg:h-96 bg-gray-100">
              <img
                src={currentImage || "/placeholder.svg?height=400&width=600"}
                alt={car.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=400&width=600";
                }}
              />

              {/* Image Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-full hover:bg-opacity-70"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-full hover:bg-opacity-70"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black bg-opacity-50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="p-3 sm:p-4 bg-gray-50">
                <div className="flex gap-2 overflow-x-auto">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-12 sm:w-20 sm:h-16 rounded-md overflow-hidden border-2 ${
                        index === currentImageIndex
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg?height=64&width=80"}
                        alt={`${car.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/placeholder.svg?height=64&width=80";
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-sm px-4 py-3">
            <h2 className="text-sm sm:text-base font-semibold text-[#003366] mb-3">
              Specifications
            </h2>

            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-2 text-xs sm:text-sm">
              <CompactSpecCard
                icon={<Calendar size={12} className="sm:w-3.5 sm:h-3.5" />}
                label="Year"
                value={car.year}
              />
              <CompactSpecCard
                icon={<Fuel size={12} className="sm:w-3.5 sm:h-3.5" />}
                label="Fuel"
                value={car.fuel}
              />
              <CompactSpecCard
                icon={<Palette size={12} className="sm:w-3.5 sm:h-3.5" />}
                label="Exterior"
                value={car.exteriorColor}
              />
              <CompactSpecCard
                icon={<Users size={12} className="sm:w-3.5 sm:h-3.5" />}
                label="Seats"
                value={car.seats}
              />
              <CompactSpecCard
                icon={<Car size={12} className="sm:w-3.5 sm:h-3.5" />}
                label="Brand"
                value={car.make}
              />
              <CompactSpecCard
                icon={<Car size={12} className="sm:w-3.5 sm:h-3.5" />}
                label="Package"
                value={car.model}
              />
              <CompactSpecCard
                icon={<Car size={12} className="sm:w-3.5 sm:h-3.5" />}
                label="Model Code"
                value={car.modelCode}
              />
              <CompactSpecCard
                icon={<Car size={12} className="sm:w-3.5 sm:h-3.5" />}
                label="Type"
                value={car.type}
              />
              <CompactSpecCard
                icon={<Car size={12} className="sm:w-3.5 sm:h-3.5" />}
                label="Engine (cc)"
                value={car.engineCC}
              />
              <CompactSpecCard
                icon={<Car size={12} className="sm:w-3.5 sm:h-3.5" />}
                label="Mileage"
                value={`${car.mileage} km`}
              />
              <CompactSpecCard
                icon={<MapPin size={12} className="sm:w-3.5 sm:h-3.5" />}
                label="Country"
                value={car.country}
              />
              <CompactSpecCard
                icon={<MapPin size={12} className="sm:w-3.5 sm:h-3.5" />}
                label="Region"
                value={car.region}
              />
              <CompactSpecCard
                icon={<Palette size={12} className="sm:w-3.5 sm:h-3.5" />}
                label="Interior"
                value={car.color}
              />
              <CompactSpecCard
                icon={<Car size={12} className="sm:w-3.5 sm:h-3.5" />}
                label="Drive"
                value={car.drive}
              />
              <CompactSpecCard
                icon={<Settings size={12} className="sm:w-3.5 sm:h-3.5" />}
                label="Transmission"
                value={car.transmission}
              />
              <CompactSpecCard
                icon={<Shield size={12} className="sm:w-3.5 sm:h-3.5" />}
                label="Stock"
                value={car.stock}
              />
              <CompactSpecCard
                icon={<Shield size={12} className="sm:w-3.5 sm:h-3.5" />}
                label="Auction Score"
                value={car.auctionScore}
              />
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4 sm:space-y-6">
          {/* Price and Actions */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-2xl sm:text-3xl font-bold text-gray-900">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 mr-1" />
                {car.price.toLocaleString()}
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={handleEdit}
                className="w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Car
              </button>

              <button
                onClick={handleToggleStatus}
                disabled={
                  activateMutation.isPending || deactivateMutation.isPending
                }
                className={`w-full flex items-center justify-center py-2 px-4 rounded-md transition-colors disabled:opacity-50 text-sm sm:text-base ${
                  car.isActive
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {car.isActive ? (
                  <EyeOff className="w-4 h-4 mr-2" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                {activateMutation.isPending || deactivateMutation.isPending
                  ? "Updating..."
                  : car.isActive
                  ? "Deactivate"
                  : "Activate"}
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={deleteMutation.isPending}
                className="w-full flex items-center justify-center bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleteMutation.isPending ? "Deleting..." : "Delete Car"}
              </button>
            </div>
          </div>

          {/* Basic Specifications */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="space-y-3 text-sm">
              {car.make && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand</span>
                  <span className="font-medium text-right">{car.make}</span>
                </div>
              )}
              {car.model && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Model</span>
                  <span className="font-medium text-right">{car.model}</span>
                </div>
              )}
              {car.modelCode && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Model Code</span>
                  <span className="font-medium text-right">
                    {car.modelCode}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Year</span>
                <span className="font-medium">{car.year}</span>
              </div>
              {car.type && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium text-right">{car.type}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Fuel Type</span>
                <span className="font-medium text-right">{car.fuel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seating Capacity</span>
                <span className="font-medium">{car.seats} seats</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span
                  className={`font-medium px-2 py-1 rounded text-xs ${getStatusColor(
                    car.status
                  )}`}
                >
                  {car.status}
                </span>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          {/* <div className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Technical Details
            </h3>
            <div className="space-y-3 text-sm">
              {car.engineCC && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Engine CC
                  </span>
                  <span className="font-medium">{car.engineCC}cc</span>
                </div>
              )}
              {car.transmission && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Transmission
                  </span>
                  <span className="font-medium text-right">
                    {car.transmission}
                  </span>
                </div>
              )}
              {car.drive && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Drive Type</span>
                  <span className="font-medium text-right">{car.drive}</span>
                </div>
              )}
              {car.mileage && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Gauge className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Mileage
                  </span>
                  <span className="font-medium">
                    {parseInt(car.mileage).toLocaleString()} km
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Exterior Color</span>
                <span className="font-medium text-right">
                  {car.exteriorColor}
                </span>
              </div>
              {car.color && car.color !== car.exteriorColor && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Interior Color</span>
                  <span className="font-medium text-right">{car.color}</span>
                </div>
              )}
              {car.country && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Country
                  </span>
                  <span className="font-medium text-right">
                    {car.country.trim()}
                  </span>
                </div>
              )}
              {car.region && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Region</span>
                  <span className="font-medium text-right">
                    {car.region.trim()}
                  </span>
                </div>
              )}
              {car.stock && (
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Hash className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Stock ID
                  </span>
                  <span className="font-medium text-right">{car.stock}</span>
                </div>
              )}
            </div>
          </div> */}

          {/* Compact Specifications */}

          {/* Metadata */}
          {/* <div className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              System Information
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-gray-600">Car ID</span>
                <span className="font-mono text-xs break-all">{car.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Status</span>
                <span
                  className={`font-medium ${
                    car.isActive ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {car.isActive ? "Active" : "Inactive"}
                </span>
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
              {car.keywords && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-gray-600">Keywords</span>
                  <span className="font-medium break-words">
                    {car.keywords}
                  </span>
                </div>
              )}
            </div>
          </div> */}
        </div>
      </div>

      {/* Features Section */}
      {car.features && car.features.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-6">
              Features ({car.features.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Object.entries(featuresByType).map(([type, features]) => (
                <div key={type} className="space-y-3">
                  <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2 text-sm sm:text-base">
                    {type === "Other" ? "Miscellaneous" : type}
                    <span className="text-xs sm:text-sm text-gray-500 ml-2">
                      ({features.length})
                    </span>
                  </h4>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li
                        key={feature.id || index}
                        className="flex items-start text-xs sm:text-sm text-gray-600"
                      >
                        <Star className="w-3 h-3 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span
                          className={feature.name ? "" : "italic text-gray-400"}
                        >
                          {feature.name || "Unnamed feature"}
                        </span>
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
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <h2 className="text-base sm:text-lg font-bold mb-2">
              Confirm Deletion
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Are you sure you want to delete "{car.title}"? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 text-sm sm:text-base"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
