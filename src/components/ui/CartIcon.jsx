import { ShoppingCart } from "lucide-react"
import { useShop } from "../context/shop-context"

export default function CartIcon() {
  const { cartCount } = useShop()

  return (
    <div className="relative">
      <ShoppingCart size={24} />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {cartCount}
        </span>
      )}
    </div>
  )
}
