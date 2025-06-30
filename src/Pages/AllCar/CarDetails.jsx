"use client";

import {
  ArrowLeft,
  Calendar,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Fuel,
  Mail,
  MapPin,
  Palette,
  Phone,
  Settings,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useShop } from "../../Context/ShopContext";
import { useCar } from "../../hooks/useCars";

const CarDetailsPage = () => {
  const { id } = useParams();
  const { addToCart, isInCart, formatYenPrice, exchangeRateLoading } =
    useShop();
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: car, isLoading, isError } = useCar(id);

  const handleAddToCart = () => {
    if (!car) return;
    setAddingToCart(true);
    try {
      addToCart(car);
      setTimeout(() => setAddingToCart(false), 1000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setAddingToCart(false);
    }
  };

  const getFeatureIcon = (type) => {
    const icons = {
      Safety: <Shield size={18} className="text-[#0072BC]" />,
      Interior: <Car size={18} className="text-[#003366]" />,
      Exterior: <Sparkles size={18} className="text-[#0072BC]" />,
      Special: <Settings size={18} className="text-[#C9252B]" />,
    };
    return icons[type] || <Star size={18} className="text-[#003366]" />;
  };

  const getFeatureColor = (type) => {
    const colors = {
      Safety: "bg-blue-50 border-[#0072BC]/20 text-[#003366]",
      Interior: "bg-gray-50 border-[#003366]/20 text-[#003366]",
      Exterior: "bg-blue-50 border-[#0072BC]/20 text-[#003366]",
      Special: "bg-red-50 border-[#C9252B]/20 text-[#003366]",
    };
    return colors[type] || "bg-gray-50 border-gray-200 text-[#003366]";
  };

  const allImages = car
    ? [car.mainImage, ...(car.gallery || [])].filter(Boolean)
    : [];
  const yenPrice = car ? formatYenPrice(car.price) : null;

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#E5E5E5" }}
      >
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: "#0072BC" }}
          ></div>
          <div className="text-xl font-medium" style={{ color: "#003366" }}>
            Loading car details...
          </div>
        </div>
      </div>
    );
  }

  if (isError || !car) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#E5E5E5" }}
      >
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-6xl mb-4">🚗</div>
          <div
            className="text-xl mb-4 font-medium"
            style={{ color: "#C9252B" }}
          >
            Car not found
          </div>
          <Link to="/allCars">
            <button
              className="px-6 py-3 rounded-lg flex items-center gap-2 text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#0072BC" }}
            >
              <ArrowLeft size={16} />
              Back to Cars
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E5E5E5" }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/allCars">
            <button
              className="px-4 py-2 rounded-lg flex items-center gap-2 text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#003366" }}
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Cars</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Title & Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1
                    className="text-3xl font-bold mb-2 capitalize"
                    style={{ color: "#003366" }}
                  >
                    {car.title}
                  </h1>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        car.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {car.isActive ? "Available" : "Sold Out"}
                    </span>
                    <span className="text-gray-500 text-sm">
                      Listed {new Date(car.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Price</div>
                  <div
                    className="text-3xl font-bold"
                    style={{ color: "#C9252B" }}
                  >
                    ${car.price?.toLocaleString()}
                  </div>
                  <div className="text-lg" style={{ color: "#0072BC" }}>
                    {exchangeRateLoading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : yenPrice ? (
                      `¥${yenPrice.toLocaleString()}`
                    ) : (
                      "¥Price unavailable"
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={
                      allImages[selectedImageIndex] ||
                      "/placeholder.svg?height=600&width=800"
                    }
                    alt={`${car.title} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setSelectedImageIndex((prev) =>
                            prev > 0 ? prev - 1 : allImages.length - 1
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() =>
                          setSelectedImageIndex((prev) =>
                            prev < allImages.length - 1 ? prev + 1 : 0
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>

                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {selectedImageIndex + 1} / {allImages.length}
                      </div>
                    </>
                  )}
                </div>

                {allImages.length > 1 && (
                  <div className="p-4 bg-gray-50">
                    <div className="flex gap-2 overflow-x-auto">
                      {allImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImageIndex === index
                              ? "border-[#0072BC] ring-2 ring-[#0072BC]/20"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={
                              image || "/placeholder.svg?height=100&width=100"
                            }
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2
                className="text-2xl font-bold mb-6 flex items-center"
                style={{ color: "#003366" }}
              >
                <Car className="mr-3" style={{ color: "#0072BC" }} size={24} />
                Specifications
              </h2>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <Calendar
                    className="mx-auto mb-3"
                    style={{ color: "#0072BC" }}
                    size={28}
                  />
                  <h3 className="font-semibold mb-2 text-gray-600">Year</h3>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#003366" }}
                  >
                    {car.year}
                  </p>
                </div>

                <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <Fuel
                    className="mx-auto mb-3"
                    style={{ color: "#0072BC" }}
                    size={28}
                  />
                  <h3 className="font-semibold mb-2 text-gray-600">Fuel</h3>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#003366" }}
                  >
                    {car.fuel}
                  </p>
                </div>

                <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <Palette
                    className="mx-auto mb-3"
                    style={{ color: "#0072BC" }}
                    size={28}
                  />
                  <h3 className="font-semibold mb-2 text-gray-600">Color</h3>
                  <p
                    className="text-2xl font-bold capitalize"
                    style={{ color: "#003366" }}
                  >
                    {car.exteriorColor}
                  </p>
                </div>

                <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <Users
                    className="mx-auto mb-3"
                    style={{ color: "#0072BC" }}
                    size={28}
                  />
                  <h3 className="font-semibold mb-2 text-gray-600">Seats</h3>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#003366" }}
                  >
                    {car.seats}
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2
                  className="text-2xl font-bold mb-6 flex items-center"
                  style={{ color: "#003366" }}
                >
                  <Star
                    className="mr-3"
                    style={{ color: "#C9252B" }}
                    size={24}
                  />
                  Features & Equipment
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["Safety", "Interior", "Exterior", "Special"].map((type) => {
                    const typeFeatures = car.features.filter(
                      (feature) => feature.type === type
                    );
                    if (typeFeatures.length === 0) return null;

                    return (
                      <div
                        key={type}
                        className={`p-6 rounded-xl border-2 ${getFeatureColor(
                          type
                        )}`}
                      >
                        <div className="flex items-center mb-4">
                          {getFeatureIcon(type)}
                          <h3
                            className="font-bold text-lg ml-2"
                            style={{ color: "#003366" }}
                          >
                            {type}
                          </h3>
                        </div>
                        <ul className="space-y-2">
                          {typeFeatures.map((feature) => (
                            <li key={feature.id} className="flex items-start">
                              <div
                                className="w-2 h-2 rounded-full mr-3 mt-2 flex-shrink-0"
                                style={{ backgroundColor: "#0072BC" }}
                              ></div>
                              <span className="font-medium text-gray-700">
                                {feature.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Purchase & Contact */}
          <div className="lg:col-span-1 space-y-6">
            {/* Purchase Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-sm text-gray-500 mb-2">Total Price</div>
                <div
                  className="text-4xl font-bold mb-2"
                  style={{ color: "#C9252B" }}
                >
                  ${car.price?.toLocaleString()}
                </div>
                <div className="text-lg" style={{ color: "#0072BC" }}>
                  {exchangeRateLoading ? (
                    <span className="animate-pulse">Loading yen price...</span>
                  ) : yenPrice ? (
                    `¥${yenPrice.toLocaleString()}`
                  ) : (
                    "¥Price unavailable"
                  )}
                </div>
              </div>

              {car.status === "ON_HOLD" ? (
                <div className="w-full py-4 text-lg font-semibold text-center text-red-600 bg-red-100 rounded-lg">
                  This car is currently on hold — negotiation in progress
                </div>
              ) : car.status === "SOLD" ? (
                <div className="w-full py-4 text-lg font-semibold text-center text-red-600 bg-red-100  rounded-lg">
                  This car has been sold
                </div>
              ) : (
                <button
                  className={`w-full py-4 text-lg font-semibold flex items-center justify-center gap-3 rounded-lg transition-all ${
                    isInCart(car.id)
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "text-white hover:opacity-90"
                  }`}
                  style={
                    !isInCart(car.id) ? { backgroundColor: "#0072BC" } : {}
                  }
                  onClick={handleAddToCart}
                  disabled={addingToCart || !car.isActive}
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                      Adding...
                    </>
                  ) : isInCart(car.id) ? (
                    <>
                      <Check size={20} />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Add to Cart
                    </>
                  )}
                </button>
              )}

              {!car.isActive && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center border border-red-200">
                  <span className="text-sm font-medium">
                    This vehicle is no longer available
                  </span>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: "#003366" }}
              >
                Contact Dealer
              </h3>
              <h4
                className="text-2xl font-bold mb-6"
                style={{ color: "#0072BC" }}
              >
                SHANTIX Corporation
              </h4>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div
                    className="p-3 rounded-lg mr-4 flex-shrink-0"
                    style={{ backgroundColor: "#E5E5E5" }}
                  >
                    <MapPin className="h-5 w-5" style={{ color: "#0072BC" }} />
                  </div>
                  <div>
                    <p
                      className="font-semibold mb-1"
                      style={{ color: "#003366" }}
                    >
                      Locations
                    </p>
                    <p className="text-gray-600 text-sm">Dhaka, Bangladesh</p>
                    <p className="text-gray-600 text-sm">
                      Chattogram, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className="p-3 rounded-lg mr-4 flex-shrink-0"
                    style={{ backgroundColor: "#E5E5E5" }}
                  >
                    <Phone className="h-5 w-5" style={{ color: "#0072BC" }} />
                  </div>
                  <div>
                    <p
                      className="font-semibold mb-1"
                      style={{ color: "#003366" }}
                    >
                      Phone
                    </p>
                    <p className="text-gray-600 text-sm">+81-45-936-0776</p>
                    <p className="text-gray-600 text-sm">+81-45-932-2376</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className="p-3 rounded-lg mr-4 flex-shrink-0"
                    style={{ backgroundColor: "#E5E5E5" }}
                  >
                    <Mail className="h-5 w-5" style={{ color: "#0072BC" }} />
                  </div>
                  <div>
                    <p
                      className="font-semibold mb-1"
                      style={{ color: "#003366" }}
                    >
                      Email
                    </p>
                    <p className="text-gray-600 text-sm">sales@shantix.info</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Reference ID</p>
                <p
                  className="font-mono text-lg font-bold"
                  style={{ color: "#003366" }}
                >
                  #{car.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold mb-4" style={{ color: "#003366" }}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link to="/cars" className="block">
                  <button
                    className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#E5E5E5", color: "#003366" }}
                  >
                    <ArrowLeft size={16} />
                    Back to Listings
                  </button>
                </Link>

                <Link to="/cart" className="block">
                  <button
                    className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-white font-medium transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#0072BC" }}
                  >
                    <ShoppingCart size={16} />
                    View Cart
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
