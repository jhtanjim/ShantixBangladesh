"use client"

import { ShoppingCart } from "lucide-react"
import { useShop } from "../context/shop-context"

export default function CartIndicator() {
  const { cartCount } = useShop()

  if (cartCount === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-red-600 text-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
        <ShoppingCart size={20} />
        <span className="font-bold">{cartCount}</span>
        <span className="text-sm">items in cart</span>
      </div>
    </div>
  )
}
