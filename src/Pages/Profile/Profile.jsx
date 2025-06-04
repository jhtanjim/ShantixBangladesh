"use client"


import { useState, useEffect } from "react"
import { Car, User, CreditCard, FileText, Calendar, MapPin, Edit, Save, X } from "lucide-react"

// Import your actual hook
import { useCurrentUser } from "../../hooks/useUsers"

// Mock orders data - replace with your actual orders hook
const mockOrders = [
  {
    id: "ORD-001",
    carModel: "Toyota Camry 2023",
    orderDate: "2024-01-15",
    status: "Delivered",
    amount: "$28,500",
    location: "New York, NY",
    transactionSlip: null,
  },
  {
    id: "ORD-002",
    carModel: "Honda Civic 2024",
    orderDate: "2024-02-20",
    status: "Processing",
    amount: "$24,800",
    location: "Los Angeles, CA",
    transactionSlip: "slip-002.pdf",
  },
  {
    id: "ORD-003",
    carModel: "BMW X5 2023",
    orderDate: "2024-03-10",
    status: "Pending Payment",
    amount: "$65,900",
    location: "Chicago, IL",
    transactionSlip: null,
  },
]

export default function ProfilePage() {
  const { data: user, isLoading, error } = useCurrentUser()
  const [orders] = useState(mockOrders)
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  })

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
  }

  const handleSave = () => {
    // Implement your update user logic here
    console.log("Saving user data:", formData)
    setIsEditing(false)
  }

  const handleFileUpload = (orderId, file) => {
    console.log(`Uploading file for order ${orderId}:`, file.name)
    // Implement your file upload logic here
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-300"
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "Pending Payment":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg">Failed to load profile</p>
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
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-blue-100">{user?.email}</p>
                  </div>
                </div>
                <div className="bg-white/20 text-white px-3 py-1 rounded-full text-sm border border-white/30">
                  {user?.role}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 border rounded-lg bg-gray-100 text-gray-600 border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      isEditing ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setFormData({
                            firstName: user?.firstName || "",
                            lastName: user?.lastName || "",
                            phone: user?.phone || "",
                          })
                        }}
                        className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-all"
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
                  My Car Orders
                </h2>
                <p className="text-green-100 mt-1">Track your car purchases and upload transaction documents</p>
              </div>
            </div>

            <div className="grid gap-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-0 hover:shadow-xl transition-shadow p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Car className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{order.carModel}</h3>
                          <p className="text-gray-600">Order #{order.id}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Order Date:</span>
                          <span className="font-semibold">{order.orderDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-semibold text-green-600">{order.amount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Location:</span>
                          <span className="font-semibold">{order.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div
                        className={`${getStatusColor(order.status)} border px-3 py-1 rounded-full text-sm font-medium`}
                      >
                        {order.status}
                      </div>

                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <label className="text-sm font-semibold text-gray-700">Transaction Slip</label>
                        {order.transactionSlip ? (
                          <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                            <FileText className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-700 flex-1">{order.transactionSlip}</span>
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
                            />
                            <p className="text-xs text-gray-500">Upload PDF, JPG, or PNG (Max 5MB)</p>
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
