import { useState } from "react"
import { useAuth } from "../Context/AuthContext"

const useUsersRole = () => {
  const { user:userData, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

 
  // Helper functions
  const isAdmin = () => userData?.role === 'ADMIN'
  const isAuthenticated = () => !!token && !!userData
  const getUserRole = () => userData?.role || null
  const getUserInfo = () => userData || null

  return {
    userData,
    loading,
    error,
    isAdmin,
    isAuthenticated,
    getUserRole,
    getUserInfo,
    // Direct access to specific user properties
    userRole: userData?.role || null,
    userEmail: userData?.email || null,
    userFullName: userData?.fullName || null,
    userCountry: userData?.country || null,
    userPhone: userData?.phone || null,
    userCompany: userData?.companyName || null,
    userId: userData?.id || null
  }
}

export default useUsersRole