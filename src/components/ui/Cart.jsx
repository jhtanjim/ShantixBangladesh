"use client"

import { useState } from "react"
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  CreditCard,
  Shield,
  Truck,
  MessageCircle,
  DollarSign,
} from "lucide-react"
import { useShop } from "../../Context/ShopContext"
import { useCreateOrder } from "../../hooks/useOrders";
import Button from "./Button";

// Currency Toggle Component
const CurrencyToggle = ({ currency, onCurrencyChange }) => {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
      <button
        onClick={() => onCurrencyChange("USD")}
        className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
          currency === "USD" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        <DollarSign size={14} />
        USD
      </button>
      <button
        onClick={() => onCurrencyChange("JPY")}
        className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
          currency === "JPY" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        ¥ JPY
      </button>
    </div>
  )
}

// Price Display Component
const PriceDisplay = ({ amount, currency, className = "", showBothCurrencies = false, exchangeRate, exchangeRateLoading }) => {
  const usdAmount = amount
  const jpyAmount = exchangeRate ? Math.round(amount * exchangeRate) : Math.round(amount * 150) // fallback

  if (showBothCurrencies) {
    return (
      <div className={className}>
        <div className="text-2xl font-bold" style={{ color: "var(--color-red)" }}>
          {currency === "USD" ? `$${usdAmount.toLocaleString()}` : `¥${jpyAmount.toLocaleString()}`}
        </div>
        <div className="text-sm text-gray-500">
          {exchangeRateLoading ? (
            <span className="animate-pulse">Loading exchange rate...</span>
          ) : (
            currency === "USD" ? `≈ ¥${jpyAmount.toLocaleString()}` : `≈ $${usdAmount.toLocaleString()}`
          )}
        </div>
      </div>
    )
  }

  return (
    <span className={className}>
      {currency === "USD" ? `$${usdAmount.toLocaleString()}` : `¥${jpyAmount.toLocaleString()}`}
    </span>
  )
}

export default function Cart() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    clearCart, 
    cartCount,
    exchangeRate,
    exchangeRateLoading
  } = useShop()
  
  const [currency, setCurrency] = useState("USD") // Default currency
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showOrderSuccess, setShowOrderSuccess] = useState(false)
  const [createdOrder, setCreatedOrder] = useState(null)
  const { mutate: createOrder, isPending: orderLoading } = useCreateOrder()

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleClearCart = () => {
    clearCart()
    setShowClearConfirm(false)
  }

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency)
  }

  const handleNegotiateOrder = () => {
    createOrder(cartItems, {
      onSuccess: (data) => {
        console.log("Order created successfully:", data)
        setCreatedOrder(data.order)
        setShowOrderSuccess(true)
        clearCart()
        // Redirect to WhatsApp with order ID
        const orderId = data.order.id
        const whatsappNumber = "8801752742031" // change to your business number
        const message = `Hello, I just placed an order (ID: ${orderId}). I'd like to negotiate the price.`

        window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
      },
      onError: (error) => {
        console.error("Failed to create order:", error)
        alert("Failed to create order. Please try again.")
      },
    })
  }

  const handleOrderSuccessClose = () => {
    setShowOrderSuccess(false)
    setCreatedOrder(null)
  }

  const goBack = () => {
    window.history.back()
  }

  // Helper function to get converted price
  const getConvertedPrice = (usdPrice) => {
    if (currency === "USD") return usdPrice
    return exchangeRate ? Math.round(usdPrice * exchangeRate) : Math.round(usdPrice * 150)
  }

  // Helper function to get exchange rate display
  const getExchangeRateDisplay = (usdAmount) => {
    if (exchangeRateLoading) return "Loading..."
    const jpyAmount = exchangeRate ? Math.round(usdAmount * exchangeRate) : Math.round(usdAmount * 150)
    return currency === "USD" 
      ? `≈ ¥${jpyAmount.toLocaleString()} JPY`
      : `≈ $${usdAmount.toLocaleString()} USD`
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="min-h-screen py-12" style={{ backgroundColor: "var(--color-background)" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <ShoppingCart size={80} className="mx-auto text-gray-300 mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Looks like you haven't added any cars to your cart yet. Browse our collection and find your perfect car!
              </p>
              <Button size="lg" className="px-8" onClick={() => (window.location.href = "/cars")}>
                Browse Cars
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: "var(--color-background)" }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={goBack}
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">
                {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <CurrencyToggle currency={currency} onCurrencyChange={handleCurrencyChange} />
            <Button variant="outline" onClick={() => setShowClearConfirm(true)}>
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Section: Cart Items */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Cart Items</h2>
                  <div className="text-sm text-gray-600">
                    Prices in {currency === "USD" ? "US Dollars" : "Japanese Yen"}
                    {exchangeRateLoading && (
                      <div className="text-xs text-blue-600 mt-1 animate-pulse">
                        Loading exchange rates...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <img
                          src={item.mainImage || "/placeholder.svg?height=120&width=160"}
                          alt={item.title}
                          className="w-full md:w-40 h-32 object-cover rounded-xl border"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{item.title}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 mb-4">
                          <div>
                            <span className="font-medium text-gray-900">Year: </span>
                            {item.year}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">Fuel: </span>
                            {item.fuel}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">Color: </span>
                            {item.exteriorColor}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">Seats: </span>
                            {item.seats}
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-100"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>

                          <div className="text-right">
                            <PriceDisplay
                              amount={item.price * item.quantity}
                              currency={currency}
                              exchangeRate={exchangeRate}
                              exchangeRateLoading={exchangeRateLoading}
                              className="text-2xl font-bold mb-1"
                              style={{ color: "var(--color-red)" }}
                            />
                            <div className="text-sm text-gray-500 mb-2">
                              <PriceDisplay 
                                amount={item.price} 
                                currency={currency}
                                exchangeRate={exchangeRate}
                                exchangeRateLoading={exchangeRateLoading}
                              /> each
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1 ml-auto"
                            >
                              <Trash2 size={14} />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section: Order Summary */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                <CurrencyToggle currency={currency} onCurrencyChange={handleCurrencyChange} />
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-medium">
                    <PriceDisplay 
                      amount={cartTotal} 
                      currency={currency}
                      exchangeRate={exchangeRate}
                      exchangeRateLoading={exchangeRateLoading}
                    />
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Insurance</span>
                  <span className="text-green-600 font-medium">Included</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-2xl font-bold text-gray-900">
                  <span>Total</span>
                  <PriceDisplay 
                    amount={cartTotal} 
                    currency={currency}
                    exchangeRate={exchangeRate}
                    exchangeRateLoading={exchangeRateLoading}
                  />
                </div>
                <div className="text-center text-sm text-gray-500">
                  {getExchangeRateDisplay(cartTotal)}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Button
                  onClick={handleNegotiateOrder}
                  disabled={orderLoading}
                  className="w-full py-3 text-base font-medium flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle size={20} />
                  {orderLoading ? "Creating Order..." : "Order to Negotiate"}
                </Button>

                <Button variant="outline" className="w-full py-3" onClick={() => (window.location.href = "/checkout")}>
                  <CreditCard size={20} className="mr-2" />
                  Proceed to Checkout
                </Button>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield size={16} />
                  Secure Payment
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} />
                  Fast Delivery
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Cart Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Clear Cart?</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to remove all items from your cart?</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleClearCart}>
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Order Success Modal */}
        {showOrderSuccess && createdOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Order Created Successfully!</h3>
                <p className="text-gray-600 mb-4">Your order has been created and is now in negotiation status.</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Order ID:</span>
                      <span className="text-gray-600">{createdOrder.id.slice(0, 8)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className="text-orange-600 font-medium">{createdOrder.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total Price:</span>
                      <PriceDisplay
                        amount={createdOrder.totalOriginalPrice}
                        currency={currency}
                        exchangeRate={exchangeRate}
                        exchangeRateLoading={exchangeRateLoading}
                        className="text-gray-900 font-medium"
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Items:</span>
                      <span className="text-gray-600">{createdOrder.orderItems.length} car(s)</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-6">We'll contact you soon to discuss the negotiation details.</p>
                <Button onClick={handleOrderSuccessClose} className="w-full">
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}