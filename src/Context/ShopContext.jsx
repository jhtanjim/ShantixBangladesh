"use client"

import { createContext, useState, useContext, useEffect } from "react"

const ShopContext = createContext()

export function ShopProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("shantix-cart")
      const savedWishlist = localStorage.getItem("shantix-wishlist")

      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }

      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist))
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("shantix-cart", JSON.stringify(cartItems))
      } catch (error) {
        console.error("Error saving cart to localStorage:", error)
      }
    }
  }, [cartItems, isLoaded])

  // Save wishlist to localStorage whenever wishlistItems changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("shantix-wishlist", JSON.stringify(wishlistItems))
      } catch (error) {
        console.error("Error saving wishlist to localStorage:", error)
      }
    }
  }, [wishlistItems, isLoaded])

  // Cart functions
  const addToCart = (car) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === car.id)

      if (existingItem) {
        return prevItems.map((item) => (item.id === car.id ? { ...item, quantity: item.quantity + 1 } : item))
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

    setCartItems((prevItems) => prevItems.map((item) => (item.id === carId ? { ...item, quantity } : item)))
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
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

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
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== carId))
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
