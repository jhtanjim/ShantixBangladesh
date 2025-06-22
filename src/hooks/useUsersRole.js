import { useEffect, useState } from "react"
import { useAuth } from "../Context/AuthContext"

const useUsersRole = () => {
  const { user, token } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        setError(null)
        if (token) {
          const currentUser = await user()
          setUserData(currentUser)
        } else {
          setUserData(null)
        }
      } catch (err) {
        setError("Failed to fetch user data")
        console.error("Error fetching user:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [token, user])

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