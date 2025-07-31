import {
  Calendar,
  Eye,
  Fuel,
  Heart,
  LogIn,
  MessageCircle,
  Palette,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../Context/AuthContext";
import { useShop } from "../../Context/ShopContext";
import { useCreateOrder } from "../../hooks/useOrders";
import Button from "./Button";

// Login Required Modal Component
const LoginRequiredModal = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            Login Required
          </h3>
          <p className="text-gray-600 mb-6">
            Please log in to place an order and start negotiating. You'll need
            an account to track your orders and communicate with our team.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onLogin} className="flex-1">
              <LogIn size={16} className="mr-2" />
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CarCard = ({ car }) => {
  const { toggleWishlist, isInWishlist, exchangeRate, isAuthenticated } =
    useShop();
  const { setRedirectAfterLogin } = useAuth();
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const { mutate: createOrder } = useCreateOrder();

  console.log(car);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingToWishlist(true);
    try {
      toggleWishlist(car);
      setTimeout(() => setAddingToWishlist(false), 500);
    } catch (error) {
      console.error("Error updating wishlist:", error);
      setAddingToWishlist(false);
    }
  };

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
          const whatsappNumber = "8801711123456";
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

  const handleLoginRequired = () => {
    setShowLoginRequired(false);
    // Set redirect URL to current car page or wherever appropriate
    setRedirectAfterLogin(window.location.pathname);
    // Redirect to login page
    window.location.href = "/login";
  };

  // Format yen price with dynamic exchange rate
  const formatYenPrice = (usdPrice) => {
    if (!usdPrice || !exchangeRate) return "N/A";
    return `¥${Math.round(usdPrice * exchangeRate).toLocaleString()}`;
  };

  return (
    <>
      <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
              car.status === "ON_HOLD"
                ? "bg-red-500 text-white"
                : car.isActive
                ? "bg-green-500 text-white"
                : "bg-gray-400 text-white"
            }`}
          >
            {car.status === "ON_HOLD" ? "On Hold" : car.status}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={addingToWishlist}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200"
        >
          <Heart
            size={20}
            className={`transition-colors ${
              isInWishlist(car.id)
                ? "text-red-500 fill-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Image Section */}
          <div className="lg:w-2/5 relative overflow-hidden">
            <div className="aspect-[4/3] lg:h-full">
              <img
                src={car.mainImage || "/placeholder.svg?height=300&width=400"}
                alt={car.title || "Car image"}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=300&width=400";
                }}
              />
            </div>

            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <Link to={`/cars/${car.id}`} className="">
                <Button className="cursor-pointer bg-blue text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Eye size={16} />
                  View Details
                </Button>
              </Link>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:w-3/5 p-6 flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {car.title || `${car.make} ${car.model}` || "Car Title"}
                </h3>
                <div className="text-right ml-4 mt-8">
                  <div className="text-2xl font-bold text-red-600">
                    {!car.price || car.price === 0
                      ? "TBA"
                      : `$${car.price.toLocaleString()}`}
                  </div>

                  {car.price && exchangeRate && (
                    <div className="text-sm text-gray-500">
                      {formatYenPrice(car.price)}
                    </div>
                  )}
                  {car.price && !exchangeRate && (
                    <div className="text-sm text-gray-400">
                      Exchange rate loading...
                    </div>
                  )}
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <Calendar className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                  <div className="text-xs text-gray-500 mb-1">Year</div>
                  <div className="font-bold text-gray-900">
                    {car.year || "N/A"}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <Fuel className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                  <div className="text-xs text-gray-500 mb-1">Fuel</div>
                  <div className="font-bold text-gray-900">
                    {car.fuel || "N/A"}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <Palette className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                  <div className="text-xs text-gray-500 mb-1">Color</div>
                  <div className="font-bold text-gray-900">
                    {car.exteriorColor || "N/A"}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <Users className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                  <div className="text-xs text-gray-500 mb-1">Seats</div>
                  <div className="font-bold text-gray-900">
                    {car.seats || "N/A"}
                  </div>
                </div>
              </div>

              {/* Features */}
              {car.features && car.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {car.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={feature.id || index}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        feature.type === "Safety"
                          ? "bg-blue-100 text-blue-800"
                          : feature.type === "Interior"
                          ? "bg-yellow-100 text-yellow-800"
                          : feature.type === "Exterior"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {feature.name}
                    </span>
                  ))}
                  {car.features.length > 3 && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      +{car.features.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Reference */}
              <div className="text-sm text-gray-500 mb-4">
                Ref: #{car.id?.toString().slice(0, 8) || "N/A"}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={`/cars/${car.id}`} className="flex-1">
                <button className="cursor-pointer w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-medium transition-colors">
                  More Details
                </button>
              </Link>

              {!car.price || car.price === 0 ? (
                <div className="flex-1 bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg text-center font-semibold">
                  To be announced
                </div>
              ) : (
                <Button
                  onClick={handleNegotiateOrder}
                  disabled={
                    orderLoading || !car.isActive || car.status === "ON_HOLD"
                  }
                  className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  {car.status === "ON_HOLD" ? (
                    <>Currently on hold — negotiation in progress</>
                  ) : orderLoading ? (
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
    </>
  );
};

export default CarCard;
