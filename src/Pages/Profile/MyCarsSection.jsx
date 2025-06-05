import React from 'react'
import { Car } from 'lucide-react'
import OrderCard from './OrderCard'

const MyCarsSection = ({ordersData, orders, handleFileUpload, uploadPaymentMutation }) => {
    console.log(ordersData)
  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Car className="w-6 h-6" />
            My Car Orders ({ordersData.length})
          </h2>
          <p className="text-green-100 mt-1">Track your car purchases and upload payment documents</p>
        </div>
      </div>

      <div className="grid gap-6">
        {ordersData.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            handleFileUpload={handleFileUpload}
            uploadPaymentMutation={uploadPaymentMutation}
          />
        ))}
      </div>

      {orders.length === 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-0 p-12 text-center">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Car Orders Yet</h3>
          <p className="text-gray-500">Your car purchase history will appear here once you make an order.</p>
        </div>
      )}
    </div>
  )
}

export default MyCarsSection