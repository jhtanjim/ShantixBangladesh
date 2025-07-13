"use client";

import {
  Calendar,
  Clock,
  Eye,
  Fuel,
  Heart,
  LogIn,
  MessageCircle,
  Palette,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // Add this import
import { useAuth } from "../../Context/AuthContext";
import { useShop } from "../../Context/ShopContext";
import { useCreateOrder } from "../../hooks/useOrders";

const Card = ({
  id,
  imageUrl,
  imageAlt,
  year,
  title,
  price,
  priceLabel = "USD",
  fuel = "Petrol",
  exteriorColor = "N/A",
  seats = 4,
  status = "available", // Default to available
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { mutate: createOrder } = useCreateOrder();
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  // Use both shop context and auth hook
  const { toggleWishlist, isInWishlist, exchangeRate, isInCart } = useShop();
  const { user, token, logout } = useAuth();

  // Create car object for context functions
  const carData = {
    id,
    title,
    price,
    imageUrl,
    year,
    fuel,
    exteriorColor,
    seats,
    status,
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(user && token);
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
    if (status === "ON_HOLD" || status === "on_hold" || status === "onhold") {
      Swal.fire({
        icon: "warning",
        title: "Negotiation Unavailable",
        text: "This car is currently ON HOLD and cannot be negotiated or ordered.",
        confirmButtonText: "Okay",
      });
      return;
    }

    // Check if car is sold
    if (status === "sold") {
      Swal.fire({
        icon: "warning",
        title: "Car Not Available",
        text: "This car is currently sold and not available for order.",
        confirmButtonText: "Okay",
      });
      return;
    }

    setOrderLoading(true);

    // Create order with single car item
    const cartItems = [{ ...carData, quantity: 1 }];

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
          const whatsappNumber = "+8801711123456";
          const message = `Hello, I just placed an order (ID: ${orderId}) for ${title}. I'd like to negotiate the price.`;
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
    // Redirect to login page
    window.location.href = "/login";
  };

  const handleToggleWishlist = () => {
    toggleWishlist(carData);
  };

  // Check if item is in cart/wishlist
  const itemIsInCart = isInCart(id);
  const itemIsInWishlist = isInWishlist(id);

  // Status configuration
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase() || "available";

    switch (statusLower) {
      case "sold":
        return {
          canAddToCart: false,
          buttonText: "Sold Out",
          buttonIcon: X,
          buttonClass: "bg-red-500 text-white cursor-not-allowed opacity-75",
          badgeClass: "bg-red-600 text-white",
          badgeText: "SOLD",
        };
      case "on_hold":
      case "on hold":
      case "onhold":
        return {
          canAddToCart: false,
          buttonText: "On Hold",
          buttonIcon: Clock,
          buttonClass: "bg-yellow-500 text-white cursor-not-allowed opacity-75",
          badgeClass: "bg-yellow-600 text-white",
          badgeText: "ON HOLD",
        };
      case "available":
      default:
        return {
          canAddToCart: true,
          buttonText: itemIsInCart ? "Added" : "Add to Cart",
          buttonIcon: ShoppingCart,
          buttonClass: itemIsInCart
            ? "bg-green-100 text-green-700 border border-green-200"
            : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md",
          badgeClass: "bg-green-600 text-white",
          badgeText: "AVAILABLE",
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <>
      <div
        className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 group w-full max-w-sm mx-auto sm:max-w-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden h-48 sm:h-44 md:h-52 lg:h-48 bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={imageUrl || "/placeholder.svg?height=300&width=400"}
            alt={imageAlt || title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            crossOrigin="anonymous"
          />

          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            </div>
          )}

          {/* Quick Actions */}
          <div
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1.5 sm:gap-2 transition-all duration-300 ${
              isHovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2"
            }`}
          >
            <button
              onClick={handleToggleWishlist}
              className={`cursor-pointer p-1.5 sm:p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
                itemIsInWishlist
                  ? "bg-red-500 text-white shadow-lg"
                  : "bg-white/90 text-gray-700 hover:bg-red-50 shadow-md"
              }`}
            >
              <Heart
                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                  itemIsInWishlist ? "fill-current" : ""
                }`}
              />
            </button>
            <Link to={`/cars/${id}`} className="">
              <button className="cursor-pointer p-1.5 sm:p-2 bg-white/90 text-gray-700 rounded-full hover:bg-blue-50 transition-all duration-200 hover:scale-110 shadow-md backdrop-blur-sm">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </Link>
          </div>

          {/* Year and Status Badges */}
          <div className="absolute top-2  sm:top-3 sm:left-3 flex justify-between gap-1.5 sm:gap-2">
            <div className="bg-blue-600 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold shadow-sm">
              {year}
            </div>
            <div
              className={`${statusConfig.badgeClass} px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold shadow-sm`}
            >
              {statusConfig.badgeText}
            </div>
          </div>

          {/* Price Display */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="text-white">
              <div className="text-2xl font-bold">
                ${typeof price === "number" ? price.toLocaleString() : price}
              </div>
              <div className="text-xs opacity-90">{priceLabel}</div>
            </div>
          </div>

          {/* Overlay for non-available items */}
          {!statusConfig.canAddToCart && (
            <div className="absolute inset-0 bg-black/10"></div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
              {title}
            </h3>
          </div>

          {/* Car Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="p-1 bg-blue-50 rounded">
                <Calendar className="w-3 h-3 text-blue-600" />
              </div>
              <span className="text-xs">{year}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="p-1 bg-green-50 rounded">
                <Fuel className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-xs">{fuel}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="p-1 bg-purple-50 rounded">
                <Users className="w-3 h-3 text-purple-600" />
              </div>
              <span className="text-xs">{seats} Seats</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="p-1 bg-orange-50 rounded">
                <Palette className="w-3 h-3 text-orange-600" />
              </div>
              <span className="text-xs">{exteriorColor}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleNegotiateOrder}
              disabled={
                orderLoading ||
                status === "sold" ||
                status === "ON_HOLD" ||
                status === "on_hold" ||
                status === "onhold"
              }
              className={`cursor-pointer flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                status === "ON_HOLD" ||
                status === "on_hold" ||
                status === "onhold"
                  ? "bg-yellow-100 text-yellow-700 cursor-not-allowed"
                  : status === "sold"
                  ? "bg-red-100 text-red-700 cursor-not-allowed"
                  : orderLoading
                  ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                  : !isAuthenticated()
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {status === "ON_HOLD" ||
              status === "on_hold" ||
              status === "onhold" ? (
                <>Currently on hold</>
              ) : status === "sold" ? (
                <>Sold Out</>
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
            </button>

            <Link to={`/cars/${id}`} className="">
              <button className="cursor-pointer px-3 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                View
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Login Required Modal */}
      {showLoginRequired && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Login Required</h3>
            <p className="text-gray-600 mb-6">
              You need to login to place an order and negotiate the price.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleLoginRequired}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </button>
              <button
                onClick={() => setShowLoginRequired(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
