"use client"
import { useState } from "react"
import Swal from 'sweetalert2'

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

export default function Profile() {
  const { data: user, isLoading: userLoading, error: userError } = useCurrentUser()
  const { data: ordersData, isLoading: ordersLoading, error: ordersError, refetch: refetchOrders } = useMyOrders()
  
  const uploadPaymentMutation = useUploadPayment()
  const updateUserMutation = useUpdateUser()
  
  const [activeTab, setActiveTab] = useState("profile")
  
  // Extract orders array from the API response structure
  const orders = ordersData?.orders || []
  
  // Enhanced file upload handler with comprehensive validation
  const handleFileUpload = async (orderId, file) => {
    try {
      // Comprehensive file validation
      const validateFile = (file) => {
        // Check if file exists
        if (!file) {
          throw new Error("No file provided")
        }
        
        // Check file type
        const allowedTypes = [
          'image/jpeg', 
          'image/jpg', 
          'image/png', 
          'image/gif', 
          'image/webp',
          'application/pdf'
        ]
        
        if (!allowedTypes.includes(file.type)) {
          throw new Error("Invalid file type. Please upload an image (JPG, PNG, GIF, WebP) or PDF file.")
        }
        
        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
          throw new Error(`File size is too large. Maximum allowed size is ${(maxSize / (1024 * 1024)).toFixed(0)}MB.`)
        }
        
        // Check if file is empty
        if (file.size === 0) {
          throw new Error("File appears to be empty or corrupted.")
        }
        
        return true
      }
      
      // Validate the fileSS
      validateFile(file)
      
      // Create FormData
      const paymentData = new FormData()
      paymentData.append('image', file)
      
      // Show loading toast
      const loadingToast = Swal.fire({
        title: 'Uploading Payment Screenshot...',
        text: 'Please wait while we upload your payment screenshot.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })
      
      // Attempt upload
      const result = await uploadPaymentMutation.mutateAsync({ 
        orderId, 
        paymentData 
      })
      
      // Close loading toast
      loadingToast.close()
      
      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Upload Successful!',
        text: 'Your payment screenshot has been uploaded successfully and is being reviewed.',
        timer: 3000,
        showConfirmButton: true,
        confirmButtonText: 'Great!',
        timerProgressBar: true
      })
      
      // Refresh orders data to show updated status
      await refetchOrders()
      
      return result
      
    } catch (error) {
      console.error(`Failed to upload file for order ${orderId}:`, error)
      
      // Determine error message
      let errorMessage = "Failed to upload payment screenshot. Please try again."
      
      if (error.message.includes('file type') || error.message.includes('Invalid file')) {
        errorMessage = error.message
      } else if (error.message.includes('size') || error.message.includes('large')) {
        errorMessage = error.message
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = "Network error. Please check your internet connection and try again."
      } else if (error.message.includes('empty') || error.message.includes('corrupted')) {
        errorMessage = error.message
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: errorMessage,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Try Again'
      })
      
      throw error
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
