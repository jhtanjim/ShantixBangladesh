"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { useAuth } from "./AuthContext" // Import your auth context

const ShopContext = createContext()

export function ShopProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { token, user } = useAuth() // Get token and user from auth context
  const [currentUser, setCurrentUser] = useState(null)

  // ✅ Hardcoded exchange rate
  const exchangeRate = 142.08

  // Get current user data
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await user()
          setCurrentUser(userData)
        } catch (error) {
          console.error("Error fetching user:", error)
          setCurrentUser(null)
        }
      } else {
        setCurrentUser(null)
      }
    }

    fetchUser()
  }, [token, user])

  // Generate user-specific storage keys
  const getStorageKey = (type) => {
    if (!currentUser?.id) return `shantix-${type}-guest`
    return `shantix-${type}-${currentUser.id}`
  }

  // Load data from localStorage on mount or when user changes
  useEffect(() => {
    const loadUserData = () => {
      try {
        const cartKey = getStorageKey("cart")
        const wishlistKey = getStorageKey("wishlist")
        
        const savedCart = localStorage.getItem(cartKey)
        const savedWishlist = localStorage.getItem(wishlistKey)

        if (savedCart) {
          setCartItems(JSON.parse(savedCart))
        } else {
          setCartItems([]) // Clear cart if no data for this user
        }

        if (savedWishlist) {
          setWishlistItems(JSON.parse(savedWishlist))
        } else {
          setWishlistItems([]) // Clear wishlist if no data for this user
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error)
        setCartItems([])
        setWishlistItems([])
      } finally {
        setIsLoaded(true)
      }
    }

    // Load data when user changes or on initial load
    if (currentUser !== undefined) { // Wait for user data to be determined
      loadUserData()
    }
  }, [currentUser])

  // Clear cart and wishlist when user logs out
  useEffect(() => {
    if (token === null && isLoaded) {
      // User logged out, clear current session data
      setCartItems([])
      setWishlistItems([])
    }
  }, [token, isLoaded])

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    if (isLoaded && currentUser !== undefined) {
      try {
        const cartKey = getStorageKey("cart")
        localStorage.setItem(cartKey, JSON.stringify(cartItems))
      } catch (error) {
        console.error("Error saving cart to localStorage:", error)
      }
    }
  }, [cartItems, isLoaded, currentUser])

  // Save wishlist to localStorage whenever wishlistItems changes
  useEffect(() => {
    if (isLoaded && currentUser !== undefined) {
      try {
        const wishlistKey = getStorageKey("wishlist")
        localStorage.setItem(wishlistKey, JSON.stringify(wishlistItems))
      } catch (error) {
        console.error("Error saving wishlist to localStorage:", error)
      }
    }
  }, [wishlistItems, isLoaded, currentUser])

  // Cart functions
  const addToCart = (car) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === car.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === car.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [...prevItems, { ...car, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (carId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== carId))
  }

  const updateQuantity = (carId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(carId)
      return
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === carId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const isInCart = (carId) => {
    return cartItems.some((item) => item.id === carId)
  }

  const getItemQuantity = (carId) => {
    const item = cartItems.find((item) => item.id === carId)
    return item ? item.quantity : 0
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  // Wishlist functions
  const addToWishlist = (car) => {
    setWishlistItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === car.id)
      if (existingItem) {
        return prevItems
      } else {
        return [...prevItems, car]
      }
    })
  }

  const removeFromWishlist = (carId) => {
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item.id !== carId)
    )
  }

  const toggleWishlist = (car) => {
    if (isInWishlist(car.id)) {
      removeFromWishlist(car.id)
    } else {
      addToWishlist(car)
    }
  }

  const isInWishlist = (carId) => {
    return wishlistItems.some((item) => item.id === carId)
  }

  const wishlistCount = wishlistItems.length

  // Convert USD price to JPY
  const formatYenPrice = (usdPrice) => {
    if (!usdPrice || !exchangeRate) return null
    return Math.round(usdPrice * exchangeRate)
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!currentUser
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    cartCount,
    cartTotal,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    wishlistCount,
    exchangeRate,
    formatYenPrice,
    isAuthenticated,
    currentUser,
    exchangeRateLoading: false, // Since we're using hardcoded rate
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider")
  }
  return context
}