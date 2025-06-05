"use client"

import { useState } from "react"

// Component imports
import ProfileHeader from './ProfileHeader'
import TabNavigation from './TabNavigation'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import ProfileInfo from './ProfileInfo'
import MyCarsSection from './MyCarsSection'

// Hook imports
import { useCurrentUser, useUpdateUser } from "../../hooks/useUsers"
import { useMyOrders, useUploadPayment } from "../../hooks/useOrders"

export default function ProfilePage() {
  const { data: user, isLoading: userLoading, error: userError } = useCurrentUser()
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useMyOrders()
console.log(ordersData)
  const uploadPaymentMutation = useUploadPayment()
  const updateUserMutation = useUpdateUser()

  const [activeTab, setActiveTab] = useState("profile")

  // Extract orders array from the API response structure
  const orders = ordersData?.orders || []

  const handleFileUpload = async (orderId, file) => {
    try {
      // Validate file size (5MB limit)
     

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

  // Loading state
  if (userLoading || ordersLoading) {
    return <LoadingSpinner message="Loading your profile..." />
  }

  // Error state
  if (userError || ordersError) {
    return (
      <ErrorMessage
        error={userError || ordersError}
        title="Failed to load profile"
      />
    )
  }

  // No user data
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
        <ProfileHeader user={user} />

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "profile" && (
          <ProfileInfo
            user={user}
            updateUserMutation={updateUserMutation}
          />
        )}

        {activeTab === "mycar" && (
          <MyCarsSection
            orders={orders}
            handleFileUpload={handleFileUpload}
            uploadPaymentMutation={uploadPaymentMutation}
            ordersData={ordersData}
          />
        )}
      </div>
    </div>
  )
}
