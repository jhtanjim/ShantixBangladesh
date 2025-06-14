
"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../Context/AuthContext"


const useUserRole = () => {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || !user.role) {
      setIsAdmin(false)
      setIsLoading(false)
      return
    }

    setIsAdmin(user.role === "ADMIN")
  
    setIsLoading(false)
  }, [user])

  return { isAdmin, isLoading }
}

export default useUserRole
