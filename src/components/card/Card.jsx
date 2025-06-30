"use client";

import {
  Calendar,
  Clock,
  Eye,
  Fuel,
  Heart,
  Palette,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../../Context/ShopContext";

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

  // Use shop context instead of props
  const {
    addToCart,
    toggleWishlist,
    isInCart,
    isInWishlist,
    // isAuthenticated
  } = useShop();

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

  const handleAddToCart = () => {
    // Only allow adding to cart if status is available
    if (status?.toLowerCase() === "available") {
      addToCart(carData);
    }
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
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
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
            onClick={handleAddToCart}
            disabled={!statusConfig.canAddToCart}
            className={`cursor-pointer flex-1 py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${statusConfig.buttonClass}`}
          >
            <statusConfig.buttonIcon className="w-4 h-4" />
            {statusConfig.buttonText}
          </button>

          <Link to={`/cars/${id}`} className="">
            <button className="cursor-pointer px-3 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
              View
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
