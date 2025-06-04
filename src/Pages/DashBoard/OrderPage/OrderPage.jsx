import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Eye, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Car,
  MessageSquare,
  Upload,
  Package,
  Calendar,
  FileText,
  Phone,
  Mail
} from 'lucide-react';
import { 
  useOrderStats, 
  useUpdateOrderStatus, 
  useRemoveOrderItem 
} from '../../../hooks/useOrders';
import { useAllOrders } from '../../../hooks/useOrders';

const AdminOrderManagement = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // API hooks
  const { data: ordersData, isLoading, error } = useAllOrders();
  console.log(ordersData)
  const { data: statsData } = useOrderStats();
  const updateOrderMutation = useUpdateOrderStatus();
  const removeItemMutation = useRemoveOrderItem();

  const orders = ordersData?.orders || [];

const statusConfig = {
  NEGOTIATING: { color: 'yellow', icon: MessageSquare, label: 'Negotiating' },
  CONFIRMED: { color: 'blue', icon: AlertCircle, label: 'Confirmed' },
  PENDING_PAYMENT: { color: 'orange', icon: DollarSign, label: 'Payment Pending' },
  PAYMENT_UPLOADED: { color: 'amber', icon: Upload, label: 'Payment Uploaded' }, // ✅ added
  PAID: { color: 'green', icon: CheckCircle, label: 'Paid' },
  SHIPPING: { color: 'purple', icon: Package, label: 'Shipped' },
  DELIVERED: { color: 'emerald', icon: CheckCircle, label: 'Delivered' },
  CANCELLED: { color: 'red', icon: XCircle, label: 'Cancelled' }
};


  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderItems?.some(item => 
        item.car?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderMutation.mutateAsync({
        orderId,
        statusData: { status: newStatus }
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handlePriceUpdate = async (orderId, newPrice) => {
    try {
      await updateOrderMutation.mutateAsync({
        orderId,
        statusData: { negotiatedPrice: parseFloat(newPrice) }
      });
    } catch (error) {
      console.error('Failed to update price:', error);
    }
  };

  const handleRemoveItem = async (orderId, itemId) => {
    if (window.confirm('Are you sure you want to remove this item from the order?')) {
      try {
        await removeItemMutation.mutateAsync({ orderId, itemId });
      } catch (error) {
        console.error('Failed to remove item:', error);
      }
    }
  };

  const openEditModal = (order) => {
    setEditingOrder({ 
      ...order,
      negotiatedPrice: order.negotiatedPrice || order.totalOriginalPrice,
      notes: order.notes || '',
      trackingInfo: order.trackingInfo || '',
      estimatedDelivery: order.estimatedDelivery || ''
    });
    setShowEditModal(true);
  };

  const saveOrder = async () => {
    try {
      await updateOrderMutation.mutateAsync({
        orderId: editingOrder.id,
        statusData: {
          status: editingOrder.status,
          negotiatedPrice: editingOrder.negotiatedPrice,
          notes: editingOrder.notes,
          trackingInfo: editingOrder.trackingInfo,
          estimatedDelivery: editingOrder.estimatedDelivery
        }
      });
      setShowEditModal(false);
      setEditingOrder(null);
    } catch (error) {
      console.error('Failed to save order:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusCounts = () => {
    const counts = {};
    Object.keys(statusConfig).forEach(status => {
      counts[status] = orders.filter(order => order.status === status).length;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <XCircle className="h-12 w-12 mx-auto mb-4" />
          <p>Failed to load orders. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="h-8 w-8" />
          Admin Order Management
        </h1>
        <p className="text-gray-600">Manage customer orders and negotiations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7 mb-6">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = statusCounts[status] || 0;
          const Icon = config.icon;
          return (
            <div key={status} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">{config.label}</p>
                  <p className="text-xl font-bold text-gray-900">{count}</p>
                </div>
                <div className={`p-2 rounded-full bg-${config.color}-100`}>
                  <Icon className={`h-4 w-4 text-${config.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, customers, or cars..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              {Object.entries(statusConfig).map(([status, config]) => (
                <option key={status} value={status}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status]?.icon || AlertCircle;
                const statusColor = statusConfig[order.status]?.color || 'gray';
                
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.id.substring(0, 8)}...
                      </div>
                      <div className="text-sm text-gray-500">
                        Updated: {formatDate(order.updatedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.user?.firstName} {order.user?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{order.user?.email}</div>
                          <div className="text-sm text-gray-500">{order.user?.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.orderItems?.map((item, index) => (
                          <div key={item.id} className="flex items-center mb-1">
                            <Car className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{item.car?.title} ({item.car?.year})</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                          <span className="font-medium">
                            ${(order.negotiatedPrice || order.finalPrice || order.totalOriginalPrice).toLocaleString()}
                          </span>
                        </div>
                        {order.negotiatedPrice && order.negotiatedPrice !== order.totalOriginalPrice && (
                          <div className="text-xs text-gray-500 line-through">
                            Original: ${order.totalOriginalPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 bg-${statusColor}-100 text-${statusColor}-800 focus:ring-2 focus:ring-${statusColor}-500`}
                        disabled={updateOrderMutation.isPending}
                      >
                        {Object.entries(statusConfig).map(([status, config]) => (
                          <option key={status} value={status}>{config.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(order)}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Edit Order"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No orders found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Order Information</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Order ID</label>
                      <p className="text-gray-900 font-mono text-sm">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <p className="text-gray-900 capitalize">{statusConfig[selectedOrder.status]?.label}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created Date</label>
                      <p className="text-gray-900">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-gray-900">{formatDate(selectedOrder.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Customer Information</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-gray-900">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedOrder.user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{selectedOrder.user?.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                <div className="space-y-4">
                  {selectedOrder.orderItems?.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 flex items-center space-x-4">
                      <img 
                        src={item.car?.mainImage} 
                        alt={item.car?.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{item.car?.title}</h5>
                        <p className="text-sm text-gray-600">Year: {item.car?.year}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">
                            Original: ${item.originalPrice?.toLocaleString()}
                          </span>
                          {item.negotiatedPrice && (
                            <span className="text-sm font-medium text-green-600">
                              Negotiated: ${item.negotiatedPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(selectedOrder.id, item.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span>${(selectedOrder.negotiatedPrice || selectedOrder.finalPrice || selectedOrder.totalOriginalPrice).toLocaleString()}</span>
                </div>
              </div>

              {/* Additional Information */}
              {(selectedOrder.notes || selectedOrder.trackingInfo || selectedOrder.paymentScreenshot) && (
                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-semibold text-gray-900">Additional Information</h4>
                  {selectedOrder.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Notes</label>
                      <p className="text-gray-900">{selectedOrder.notes}</p>
                    </div>
                  )}
                  {selectedOrder.trackingInfo && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tracking Info</label>
                      <p className="text-gray-900">{selectedOrder.trackingInfo}</p>
                    </div>
                  )}
                  {selectedOrder.paymentScreenshot && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Payment Screenshot</label>
                      <img 
                        src={selectedOrder.paymentScreenshot} 
                        alt="Payment screenshot"
                        className="mt-2 max-w-sm rounded border"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Edit Order</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editingOrder.status}
                  onChange={(e) => setEditingOrder({...editingOrder, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <option key={status} value={status}>{config.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Negotiated Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={editingOrder.negotiatedPrice || ''}
                    onChange={(e) => setEditingOrder({...editingOrder, negotiatedPrice: parseFloat(e.target.value) || 0})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter negotiated price"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Information</label>
                <input
                  type="text"
                  value={editingOrder.trackingInfo || ''}
                  onChange={(e) => setEditingOrder({...editingOrder, trackingInfo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tracking number or info"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery</label>
                <input
                  type="date"
                  value={editingOrder.estimatedDelivery || ''}
                  onChange={(e) => setEditingOrder({...editingOrder, estimatedDelivery: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={editingOrder.notes || ''}
                  onChange={(e) => setEditingOrder({...editingOrder, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add notes about this order..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={updateOrderMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={saveOrder}
                  disabled={updateOrderMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {updateOrderMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;