import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Package, CreditCard, Truck, Calendar, ArrowLeft } from 'lucide-react';
import instance from '../api/axios'; // Adjust path as needed
import Button from '../components/Button'; // Adjust path as needed

const Order = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const response = await instance.get(`/order/${orderId}`);
        setOrderData(response.data);
      } catch (err) {
        setError('Failed to fetch order details');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Confirmation</h1>
            {orderData && (
              <p className="text-gray-600 mt-1">Order ID: {orderData.id}</p>
            )}
          </div>
        </div>

        {/* Order Success Message */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 text-lg">
              Thank you for your purchase. We'll process your order and send you updates soon.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Package size={24} />
                  Order Items
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {orderData?.items?.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <img
                          src={item.mainImage || "/placeholder.svg?height=120&width=160"}
                          alt={item.title}
                          className="w-full md:w-40 h-32 object-cover rounded-xl border"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 mb-4">
                          <div>
                            <span className="font-medium text-gray-900">Year: </span>
                            <span>{item.year}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">Fuel: </span>
                            <span>{item.fuel}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">Color: </span>
                            <span>{item.exteriorColor}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">Seats: </span>
                            <span>{item.seats}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            Quantity: <span className="font-medium">{item.quantity}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-blue-600">
                              ${(item.price * item.quantity).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              ${item.price.toLocaleString()} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Status */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <CreditCard size={24} />
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({orderData?.itemCount || 0} items)</span>
                  <span className="font-medium">${orderData?.total?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Insurance</span>
                  <span className="text-green-600 font-medium">Included</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-2xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>${orderData?.total?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <Truck size={24} />
                Order Status
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div>
                    <div className="font-medium text-blue-900">Order Confirmed</div>
                    <div className="text-sm text-blue-600">
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-60">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div>
                    <div className="font-medium text-gray-600">Processing</div>
                    <div className="text-sm text-gray-500">Pending</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-60">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div>
                    <div className="font-medium text-gray-600">Shipped</div>
                    <div className="text-sm text-gray-500">Pending</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-60">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div>
                    <div className="font-medium text-gray-600">Delivered</div>
                    <div className="text-sm text-gray-500">Pending</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <Calendar size={20} />
                What's Next?
              </h3>
              <div className="text-sm text-blue-700 space-y-2">
                <p>• You'll receive an email confirmation shortly</p>
                <p>• We'll notify you when your order ships</p>
                <p>• Track your order status here anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;