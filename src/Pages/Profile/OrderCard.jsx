import React from 'react'
import { Package, Calendar, CreditCard, MapPin, FileText } from 'lucide-react'
import Swal from 'sweetalert2'

const OrderCard = ({ order, handleFileUpload, uploadPaymentMutation }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-300"
      case "CONFIRMED":
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "NEGOTIATING":
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatPrice = (price) => {
    if (!price) return "N/A"
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const copyOrderId = (id) => {
    navigator.clipboard.writeText(id)
    Swal.fire({
      icon: 'success',
      title: 'Copied!',
      text: `Order ID ${id} copied to clipboard.`,
      timer: 1500,
      showConfirmButton: false,
    })
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-0 hover:shadow-xl transition-shadow p-6">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3
                className="text-xl font-bold text-blue-600 cursor-pointer hover:underline"
                onClick={() => copyOrderId(order.id)}
                title="Click to copy full Order ID"
              >
                Order #{order.id.slice(0, 8)}...
              </h3>
              <p className="text-gray-600">{order.orderItems?.length || 0} item(s)</p>
            </div>
          </div>

          {order.user && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-800">Customer Information:</p>
              <p className="text-sm text-blue-700">
                {order.user.firstName} {order.user.lastName} ({order.user.email})
              </p>
              {order.user.phone && (
                <p className="text-sm text-blue-700">Phone: {order.user.phone}</p>
              )}
            </div>
          )}

          {order.orderItems && order.orderItems.length > 0 && (
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={item.car.mainImage}
                    alt={item.car.title}
                    className="w-16 h-12 object-cover rounded-md"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.car.title}</h4>
                    <p className="text-sm text-gray-600">Year: {item.car.year}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatPrice(item.negotiatedPrice || item.originalPrice)}
                    </p>
                    {item.negotiatedPrice && item.negotiatedPrice !== item.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        {formatPrice(item.originalPrice)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm pt-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Order Date:</span>
              <span className="font-semibold">{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold text-green-600">
                {formatPrice(order.finalPrice || order.negotiatedPrice || order.totalOriginalPrice)}
              </span>
            </div>
            {order.estimatedDelivery && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Est. Delivery:</span>
                <span className="font-semibold">{formatDate(order.estimatedDelivery)}</span>
              </div>
            )}
          </div>

          {order.trackingInfo && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-800">Tracking Information:</p>
              <p className="text-sm text-blue-700">{order.trackingInfo}</p>
            </div>
          )}

          {order.notes && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-semibold text-yellow-800">Notes:</p>
              <p className="text-sm text-yellow-700">{order.notes}</p>
            </div>
          )}

          {order.whatsappMessageSent && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-800">WhatsApp message sent to customer</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-3 min-w-[250px]">
          <div
            className={`${getStatusColor(order.status)} border px-3 py-1 rounded-full text-sm font-medium`}
          >
            {formatStatus(order.status)}
          </div>

          <a
            href={`https://wa.me/8801234567890?text=${encodeURIComponent(`Hello, I have a question about Order ID: ${order.id}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-sm font-medium px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Chat on WhatsApp
          </a>

          <div className="flex flex-col gap-2 w-full">
            {/* You can add payment screenshot upload logic here */}
            ...
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderCard
