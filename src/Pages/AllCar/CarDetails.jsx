"use client";

import {
  ArrowLeft,
  Calendar,
  Car,
  CarIcon,
  ChevronLeft,
  ChevronRight,
  Fuel,
  LogIn,
  Mail,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  Settings,
  Shield,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2"; // Make sure to import Swal
import Button from "../../components/ui/Button";
import LoginRequiredModal from "../../components/ui/LoginRequiredModal";
import { useShop } from "../../Context/ShopContext";
import { useCar } from "../../hooks/useCars";
import { useCreateOrder } from "../../hooks/useOrders";

const CarDetailsPage = () => {
  const { id } = useParams();
  const {
    addToCart,
    isInCart,
    formatYenPrice,
    exchangeRateLoading,
    isAuthenticated,
  } = useShop();
  const [orderLoading, setOrderLoading] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false); // Added missing state
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null); // Added missing state

  const { mutate: createOrder } = useCreateOrder();
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: car, isLoading, isError } = useCar(id);
  console.log(car);
  const handleLoginRequired = () => {
    setShowLoginRequired(false);
    // Set redirect URL to current car page or wherever appropriate
    setRedirectAfterLogin(window.location.pathname);
    // Redirect to login page
    window.location.href = "/login";
  };
  const CompactSpecCard = ({ icon, label, value }) => (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
      <div className="text-[#0072BC] flex-shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-gray-600 truncate">{label}</div>
        <div className="font-semibold text-[#003366] truncate">
          {value || "N/A"}
        </div>
      </div>
    </div>
  );

  const handleNegotiateOrder = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated
    if (!isAuthenticated()) {
      setShowLoginRequired(true);
      return;
    }

    // Check if car is ON_HOLD
    if (car.status === "ON_HOLD") {
      Swal.fire({
        icon: "warning",
        title: "Negotiation Unavailable",
        text: "This car is currently ON HOLD and cannot be negotiated or ordered.",
        confirmButtonText: "Okay",
      });
      return;
    }

    // Check if car is not active
    if (!car.isActive) {
      Swal.fire({
        icon: "warning",
        title: "Car Not Available",
        text: "This car is currently not available for order.",
        confirmButtonText: "Okay",
      });
      return;
    }

    setOrderLoading(true);

    // Create order with single car item
    const cartItems = [{ ...car, quantity: 1 }];

    createOrder(cartItems, {
      onSuccess: (data) => {
        console.log("Order created successfully:", data);
        setOrderLoading(false);

        // Show SweetAlert before redirecting to WhatsApp
        Swal.fire({
          icon: "success",
          title: "Order Placed",
          text: "Your order was placed successfully. You'll now be redirected to WhatsApp to negotiate.",
          showConfirmButton: true,
          confirmButtonText: "Go to WhatsApp",
        }).then(() => {
          const orderId = data.order.id;
          const whatsappNumber = "+817083931325";
          const message = `Hello, I just placed an order (ID: ${orderId}) for ${
            car.title || `${car.make} ${car.model}`
          }. I'd like to negotiate the price.`;
          window.open(
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              message
            )}`,
            "_blank"
          );
        });
      },
      onError: (error) => {
        console.error("Failed to create order:", error);
        setOrderLoading(false);
        Swal.fire({
          icon: "error",
          title: "Order Failed",
          text: "Failed to create order. Please try again later.",
          confirmButtonText: "Okay",
        });
      },
    });
  };

  const getFeatureIcon = (type) => {
    const icons = {
      Safety: <Shield size={16} />,
      Interior: <Car size={16} />,
      Exterior: <Sparkles size={16} />,
      Technology: <Settings size={16} />,
      Performance: <Star size={16} />,
      Comfort: <Users size={16} />,
      Entertainment: <Star size={16} />,
    };
    return icons[type] || <Star size={16} />;
  };

  const allImages = car
    ? [car.mainImage, ...(car.gallery || [])].filter(Boolean)
    : [];
  const yenPrice = car ? formatYenPrice(car.price) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0072BC] mx-auto mb-4"></div>
          <p className="text-[#003366]">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (isError || !car) {
    return (
      <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="text-4xl mb-4">🚗</div>
          <p className="text-[#C9252B] text-lg mb-4">Car not found</p>
          <Link to="/allCars">
            <button className="bg-[#0072BC] text-white px-6 py-2 rounded hover:opacity-90 transition-opacity">
              <ArrowLeft size={16} className="inline mr-2" />
              Back to Cars
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5E5E5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link to="/allCars">
            <button className="bg-[#003366] text-white px-4 py-2 rounded hover:opacity-90 transition-opacity">
              <ArrowLeft size={16} className="inline mr-2" />
              Back to Cars
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Car Title and Price */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#003366] mb-2 capitalize">
                {car.title}
              </h1>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
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
              <div className="text-2xl font-bold text-[#C9252B] mb-1">
                ${car.price?.toLocaleString()}
              </div>
              <div className="text-lg text-[#0072BC]">
                {exchangeRateLoading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : yenPrice ? (
                  `¥${yenPrice.toLocaleString()}`
                ) : (
                  "¥Price To be announced"
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="relative">
                <div className="aspect-video">
                  <img
                    src={
                      allImages[selectedImageIndex] ||
                      "/placeholder.svg?height=400&width=600"
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
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() =>
                          setSelectedImageIndex((prev) =>
                            prev < allImages.length - 1 ? prev + 1 : 0
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                        {selectedImageIndex + 1} / {allImages.length}
                      </div>
                    </>
                  )}
                </div>
                {allImages.length > 1 && (
                  <div className="p-4 bg-gray-50 border-t">
                    <div className="flex gap-2 overflow-x-auto">
                      {allImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                            selectedImageIndex === index
                              ? "border-[#0072BC]"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={image || "/placeholder.svg?height=80&width=80"}
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
            <div className="bg-white rounded-lg shadow-sm px-4 py-3 mb-4">
              <h2 className="text-base font-semibold text-[#003366] mb-3">
                Specifications
              </h2>

              {/* Compact Grid Layout */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-sm">
                <CompactSpecCard
                  icon={<Calendar size={14} />}
                  label="Year"
                  value={car.year}
                />
                <CompactSpecCard
                  icon={<Fuel size={14} />}
                  label="Fuel"
                  value={car.fuel}
                />
                <CompactSpecCard
                  icon={<Palette size={14} />}
                  label="Exterior"
                  value={car.exteriorColor}
                />
                <CompactSpecCard
                  icon={<Users size={14} />}
                  label="Seats"
                  value={car.seats}
                />
                <CompactSpecCard
                  icon={<Car size={14} />}
                  label="Make"
                  value={car.make}
                />
                <CompactSpecCard
                  icon={<Car size={14} />}
                  label="Model"
                  value={car.model}
                />
                <CompactSpecCard
                  icon={<Car size={14} />}
                  label="Model Code"
                  value={car.modelCode}
                />
                <CompactSpecCard
                  icon={<Car size={14} />}
                  label="Type"
                  value={car.type}
                />
                <CompactSpecCard
                  icon={<Car size={14} />}
                  label="Engine (cc)"
                  value={car.engineCC}
                />
                <CompactSpecCard
                  icon={<Car size={14} />}
                  label="Mileage"
                  value={`${car.mileage} km`}
                />
                <CompactSpecCard
                  icon={<MapPin size={14} />}
                  label="Country"
                  value={car.country}
                />
                <CompactSpecCard
                  icon={<MapPin size={14} />}
                  label="Region"
                  value={car.region}
                />
                <CompactSpecCard
                  icon={<Palette size={14} />}
                  label="Interior"
                  value={car.color}
                />
                <CompactSpecCard
                  icon={<Car size={14} />}
                  label="Drive"
                  value={car.drive}
                />
                <CompactSpecCard
                  icon={<Settings size={14} />}
                  label="Transmission"
                  value={car.transmission}
                />
                <CompactSpecCard
                  icon={<Shield size={14} />}
                  label="Stock"
                  value={car.stock}
                />
              </div>
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-[#003366] mb-6">
                  Features
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[
                    "Safety",
                    "Interior",
                    "Exterior",
                    "Technology",
                    "Performance",
                    "Comfort",
                    "Entertainment",
                  ].map((type) => {
                    const typeFeatures = car.features.filter(
                      (feature) => feature.type === type
                    );
                    if (typeFeatures.length === 0) return null;

                    return (
                      <div key={type}>
                        <h3 className="text-md font-semibold text-[#003366] mb-2 border-b pb-1">
                          {type}
                        </h3>
                        <ul className="space-y-1">
                          {typeFeatures.map((feature) => (
                            <li
                              key={feature.id}
                              className="text-sm text-gray-700 flex items-center"
                            >
                              <span className="text-[#0072BC] mr-2">
                                <CarIcon size={19} />
                              </span>
                              {feature.name}
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
          <div className="lg:col-span-1">
            {/* Purchase Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-sm text-gray-600 mb-2">Total Price</div>
                <div className="text-3xl font-bold text-[#C9252B] mb-2">
                  ${car.price?.toLocaleString()}
                </div>
                <div className="text-lg text-[#0072BC]">
                  {exchangeRateLoading ? (
                    <span className="animate-pulse">Loading yen price...</span>
                  ) : yenPrice ? (
                    `¥${yenPrice.toLocaleString()}`
                  ) : (
                    "¥Price To be announced"
                  )}
                </div>
              </div>

              {car.status === "ON_HOLD" ? (
                <div className="w-full py-3 text-center text-red-600 bg-red-100 rounded font-medium">
                  This car is currently on hold — negotiation in progress
                </div>
              ) : car.status === "SOLD" ? (
                <div className="w-full py-3 text-center text-red-600 bg-red-100 rounded font-medium">
                  This car has been sold
                </div>
              ) : !car.price || car.price === 0 ? (
                <div className="w-full py-3 text-center text-yellow-800 bg-yellow-100 rounded font-medium">
                  To be announced
                </div>
              ) : (
                <Button
                  onClick={handleNegotiateOrder}
                  disabled={orderLoading || !car.isActive}
                  className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  {orderLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating Order...
                    </>
                  ) : !isAuthenticated() ? (
                    <>
                      <LogIn size={16} />
                      Login to Negotiate
                    </>
                  ) : (
                    <>
                      <MessageCircle size={16} />
                      Order to Negotiate
                    </>
                  )}
                </Button>
              )}

              {!car.isActive && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-center text-sm">
                  This vehicle is no longer available
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-[#003366] mb-1">
                Contact Dealer
              </h3>
              <h4 className="text-xl font-bold text-[#0072BC] mb-4">
                SHANTIX Corporation
              </h4>

              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-[#E5E5E5] p-2 rounded mr-3">
                    <MapPin className="h-4 w-4 text-[#0072BC]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#003366] text-sm">
                      Locations
                    </p>
                    <p className="text-gray-600 text-sm">Dhaka, Bangladesh</p>
                    <p className="text-gray-600 text-sm">
                      Chattogram, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#E5E5E5] p-2 rounded mr-3">
                    <Phone className="h-4 w-4 text-[#0072BC]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#003366] text-sm">Phone</p>
                    <p className="text-gray-600 text-sm">+81-45-936-0776</p>
                    <p className="text-gray-600 text-sm">+81-45-932-2376</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#E5E5E5] p-2 rounded mr-3">
                    <Mail className="h-4 w-4 text-[#0072BC]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#003366] text-sm">Email</p>
                    <p className="text-gray-600 text-sm">sales@shantix.info</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Reference ID</p>
                <p className="font-mono font-bold text-[#003366]">
                  #{car.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-[#003366] mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/allCars" className="block">
                  <button className="w-full py-3 px-4 rounded bg-[#E5E5E5] text-[#003366] font-medium hover:opacity-90 transition-opacity">
                    <ArrowLeft size={16} className="inline mr-2" />
                    Back to All Cars
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Required Modal */}
      <LoginRequiredModal
        isOpen={showLoginRequired}
        onClose={() => setShowLoginRequired(false)}
        onLogin={handleLoginRequired}
      />
    </div>
  );
};

export default CarDetailsPage;
