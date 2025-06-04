"use client"

import { useState, useEffect } from "react"
import { Car, User, CreditCard, FileText, Calendar, MapPin, Edit, Save, X, Package, AlertCircle } from "lucide-react"

// Import your actual hooks
import { useCurrentUser, useUpdateUser } from "../../hooks/useUsers"
import { useMyOrders, useUploadPayment } from "../../hooks/useOrders"

export default function ProfilePage() {
  const { data: user, isLoading: userLoading, error: userError } = useCurrentUser()
  console.log(user)
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useMyOrders()
  console.log(ordersData)
  const uploadPaymentMutation = useUploadPayment()
  const updateUserMutation = useUpdateUser()
  
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  })
  const [updateError, setUpdateError] = useState("")
  const [updateSuccess, setUpdateSuccess] = useState("")

  // Extract orders array from the API response structure
  const orders = ordersData?.orders || []

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear messages when user starts typing
    setUpdateError("")
    setUpdateSuccess("")
  }

  const handleSave = async () => {
    try {
      setUpdateError("")
      setUpdateSuccess("")
      
      // Validate required fields
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setUpdateError("First name and last name are required")
        return
      }

      await updateUserMutation.mutateAsync({
        id: user.id,
        data: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
        }
      })
      
      setUpdateSuccess("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
      setUpdateError(error.response?.data?.message || "Failed to update profile. Please try again.")
    }
  }

  const handleFileUpload = async (orderId, file) => {
    try {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a valid file (PDF, JPG, or PNG)")
        return
      }

      const paymentData = new FormData()
      paymentData.append('paymentScreenshot', file)
      
      await uploadPaymentMutation.mutateAsync({ orderId, paymentData })
    } catch (error) {
      console.error(`Failed to upload file for order ${orderId}:`, error)
      alert("Failed to upload payment screenshot. Please try again.")
    }
  }

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

  if (userLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (userError || ordersError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg">Failed to load profile</p>
          <p className="text-gray-500 text-sm mt-2">
            {userError?.message || ordersError?.message || 'An error occurred'}
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">👤</div>
          <p className="text-gray-600 text-lg">No user data found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-600 mt-2">Manage your account and view your car orders</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg border">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("mycar")}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "mycar"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Car className="w-4 h-4" />
              My Cars
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border-0 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-4 border-white text-2xl font-bold">
                    {user.firstName?.[0] || ''}
                    {user.lastName?.[0] || ''}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-blue-100">{user.email}</p>
                  </div>
                </div>
                <div className="bg-white/20 text-white px-3 py-1 rounded-full text-sm border border-white/30">
                  {user.role || 'User'}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Success/Error Messages */}
              {updateSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-green-800">{updateSuccess}</span>
                </div>
              )}

              {updateError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-800">{updateError}</span>
                </div>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing || updateUserMutation.isPending}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200 text-gray-600"
                      }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing || updateUserMutation.isPending}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200 text-gray-600"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full px-4 py-3 border rounded-lg bg-gray-100 text-gray-600 border-gray-200"
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing || updateUserMutation.isPending}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  {!isEditing ? (
                    <button
                      onClick={() => {
                        setIsEditing(true)
                        setUpdateError("")
                        setUpdateSuccess("")
                      }}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={updateUserMutation.isPending}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4" />
                        {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setFormData({
                            firstName: user.firstName || "",
                            lastName: user.lastName || "",
                            phone: user.phone || "",
                          })
                          setUpdateError("")
                          setUpdateSuccess("")
                        }}
                        disabled={updateUserMutation.isPending}
                        className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Cars Tab */}
        {activeTab === "mycar" && (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
                <h2 className="flex items-center gap-2 text-2xl font-bold">
                  <Car className="w-6 h-6" />
                  My Car Orders ({orders.length})
                </h2>
                <p className="text-green-100 mt-1">Track your car purchases and upload payment documents</p>
              </div>
            </div>

            <div className="grid gap-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-0 hover:shadow-xl transition-shadow p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Order #{order.id.slice(0, 8)}...
                          </h3>
                          <p className="text-gray-600">{order.orderItems?.length || 0} item(s)</p>
                        </div>
                      </div>

                      {/* Customer Information */}
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

                      {/* Order Items */}
                      {order.orderItems && order.orderItems.length > 0 && (
                        <div className="space-y-3">
                          {order.orderItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                              <img
                                src={item.car.mainImage}
                                alt={item.car.title}
                                className="w-16 h-12 object-cover rounded-md"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                }}
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

                      <div className="flex flex-col gap-2 w-full">
                        <label className="text-sm font-semibold text-gray-700">Payment Screenshot</label>
                        {order.paymentScreenshot ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                              <FileText className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-700 flex-1">Payment uploaded</span>
                            </div>
                            <img
                              src={order.paymentScreenshot}
                              alt="Payment screenshot"
                              className="w-full h-32 object-cover rounded-lg border"
                              onError={(e) => {
                                e.target.style.display = 'none'
                              }}
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFileUpload(order.id, file)
                              }}
                              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={uploadPaymentMutation.isPending}
                            />
                            <p className="text-xs text-gray-500">Upload PDF, JPG, or PNG (Max 5MB)</p>
                            {uploadPaymentMutation.isPending && (
                              <p className="text-xs text-blue-600">Uploading...</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {orders.length === 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-0 p-12 text-center">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Car Orders Yet</h3>
                <p className="text-gray-500">Your car purchase history will appear here once you make an order.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}