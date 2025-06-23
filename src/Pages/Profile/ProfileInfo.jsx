import React, { useState, useEffect } from 'react'
import { Edit, Save, X } from 'lucide-react'
import AlertMessage from './AlertMessage'

const ProfileInfo = ({ user, updateUserMutation }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  })
  const [updateError, setUpdateError] = useState("")
  const [updateSuccess, setUpdateSuccess] = useState("")

  // Helper functions to split and combine names
  const splitFullName = (fullName) => {
    if (!fullName) return { firstName: "", lastName: "" }
    const names = fullName.trim().split(' ')
    if (names.length === 1) {
      return { firstName: names[0], lastName: "" }
    }
    return {
      firstName: names[0],
      lastName: names.slice(1).join(' ') // Handle multiple last names
    }
  }

  const combineNames = (firstName, lastName) => {
    return `${firstName.trim()} ${lastName.trim()}`.trim()
  }

  useEffect(() => {
    if (user) {
      const { firstName, lastName } = splitFullName(user.fullName)
      setFormData({
        firstName,
        lastName,
        phone: user.phone || "",
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setUpdateError("")
    setUpdateSuccess("")
  }

  const handleSave = async () => {
    try {
      setUpdateError("")
      setUpdateSuccess("")
      
      if (!formData.firstName.trim()) {
        setUpdateError("First name is required")
        return
      }

      // Combine names back to fullName for API
      const fullName = combineNames(formData.firstName, formData.lastName)

      await updateUserMutation.mutateAsync({
        id: user.id,
        data: {
          fullName: fullName,
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

  const handleCancel = () => {
    setIsEditing(false)
    const { firstName, lastName } = splitFullName(user.fullName)
    setFormData({
      firstName,
      lastName,
      phone: user.phone || "",
    })
    setUpdateError("")
    setUpdateSuccess("")
  }

  // Get current names for display
  const currentNames = splitFullName(user.fullName)

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border-0 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-4 border-white text-2xl font-bold">
              {currentNames.firstName?.[0] || ''}
              {currentNames.lastName?.[0] || ''}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {user.fullName}
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
        {updateSuccess && <AlertMessage type="success" message={updateSuccess} />}
        {updateError && <AlertMessage type="error" message={updateError} />}

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

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Country</label>
            <input
              type="text"
              value={user.country || ""}
              disabled
              className="w-full px-4 py-3 border rounded-lg bg-gray-100 text-gray-600 border-gray-200"
            />
            <p className="text-xs text-gray-500">Country information from your account</p>
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
                  onClick={handleCancel}
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
  )
}

export default ProfileInfo