"use client"

import { createContext, useContext, useState } from "react"
import { loginUser } from "../api/auth"
import { getCurrentUser } from "../api/users"

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  })

  const login = async (data) => {
    const result = await loginUser(data)
    if (typeof window !== "undefined") {
      localStorage.setItem("token", result.accessToken)
    }
    setToken(result.accessToken)
    return result
  }

  const user = async () => {
    return await getCurrentUser()
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
    setToken(null)
  }

  return <AuthContext.Provider value={{ token, login, logout, user }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
