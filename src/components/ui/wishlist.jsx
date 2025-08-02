import {
  ArrowLeft,
  Grid,
  Heart,
  List,
  LogIn,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../Context/AuthContext"; // Add this import
import { useShop } from "../../Context/ShopContext";
import { useCreateOrder } from "../../hooks/useOrders";
import Button from "./Button";
import LoginRequiredModal from "./LoginRequiredModal";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, isInCart, wishlistCount } =
    useShop();
  const { user, token, logout } = useAuth(); // Use the auth context
  const [viewType, setViewType] = useState("grid");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const { mutate: createOrder } = useCreateOrder();

  // Updated authentication check function
  const isAuthenticated = () => {
    return !!(user && token); // Use the auth context instead of localStorage
  };

  const handleLoginRequired = () => {
    setShowLoginRequired(false);
    // Store the current page URL for redirect after login
    localStorage.setItem("redirectAfterLogin", window.location.pathname);
    // Redirect to login page
    window.location.href = "/login";
  };

  const handleNegotiateOrder = (car) => {
    if (!isAuthenticated()) {
      setShowLoginRequired(true);
      return;
    }

    if (!car.isActive || car.status === "ON_HOLD") {
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

  const handleClearWishlist = () => {
    wishlistItems.forEach((item) => removeFromWishlist(item.id));
    setShowClearConfirm(false);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <Heart size={64} className="mx-auto text-gray-300 mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Wishlist is Empty
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Save your favorite cars to your wishlist and never lose track of
                them!
              </p>
              <Link to="/allCars" className="inline-block">
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors">
                  Browse Cars
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-1">
                {wishlistCount} {wishlistCount === 1 ? "car" : "cars"} saved
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewType("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewType === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewType("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewType === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <List size={18} />
              </button>
            </div>

            {/* Clear Wishlist */}
            {wishlistItems.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Wishlist Items */}
        <div
          className={`${
            viewType === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
          }`}
        >
          {wishlistItems.map((car) => (
            <div
              key={car.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
                viewType === "list" ? "flex" : ""
              }`}
            >
              {/* Image */}
              <div
                className={`relative overflow-hidden ${
                  viewType === "list" ? "w-48 flex-shrink-0" : "aspect-[4/3]"
                }`}
              >
                <img
                  src={car.mainImage || "/placeholder.svg?height=200&width=300"}
                  alt={car.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Remove from Wishlist */}
                <button
                  onClick={() => removeFromWishlist(car.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200"
                >
                  <Heart size={18} className="text-red-500 fill-red-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {car.title}
                  </h3>

                  <div className="flex justify-between items-center mb-4">
                    <div className="text-2xl font-bold text-red-600">
                      ${car.price?.toLocaleString() || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      ¥{((car.price || 0) * 150).toLocaleString()}
                    </div>
                  </div>

                  {/* Quick Specs */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Year:</span>
                      <span className="font-medium">{car.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fuel:</span>
                      <span className="font-medium">{car.fuel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Color:</span>
                      <span className="font-medium">{car.exteriorColor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Seats:</span>
                      <span className="font-medium">{car.seats}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    to={`/cars/${car.id}`}
                    className="flex-1 text-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </Link>

                  <Button
                    onClick={() => handleNegotiateOrder(car)}
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
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="text-center mb-6">
                <Heart size={48} className="mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Clear Wishlist?</h3>
                <p className="text-gray-600">
                  Are you sure you want to remove all cars from your wishlist?
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearWishlist}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Login Required Modal */}
        <LoginRequiredModal
          isOpen={showLoginRequired}
          onClose={() => setShowLoginRequired(false)}
          onLogin={handleLoginRequired}
        />
      </div>
    </div>
  );
}
