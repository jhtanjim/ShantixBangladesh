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
  Car
} from 'lucide-react';

const OrderPage = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: "ORD-001",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      carName: "Toyota Corolla Cross Z",
      originalPrice: 79888,
      negotiatedPrice: 75000,
      status: "pending",
      orderDate: "2024-06-01",
      lastUpdated: "2024-06-02"
    },
    {
      id: 2,
      orderNumber: "ORD-002",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      carName: "Honda Civic Type R",
      originalPrice: 65000,
      negotiatedPrice: 62000,
      status: "confirmed",
      orderDate: "2024-06-01",
      lastUpdated: "2024-06-02"
    },
    {
      id: 3,
      orderNumber: "ORD-003",
      customerName: "Mike Johnson",
      customerEmail: "mike@example.com",
      carName: "BMW X5 M Sport",
      originalPrice: 120000,
      negotiatedPrice: 118000,
      status: "completed",
      orderDate: "2024-05-30",
      lastUpdated: "2024-06-01"
    },
    {
      id: 4,
      orderNumber: "ORD-004",
      customerName: "Sarah Wilson",
      customerEmail: "sarah@example.com",
      carName: "Toyota Corolla Cross Z",
      originalPrice: 79888,
      negotiatedPrice: 79888,
      status: "cancelled",
      orderDate: "2024-05-29",
      lastUpdated: "2024-05-30"
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusConfig = {
    pending: { color: 'yellow', icon: Clock, label: 'Pending' },
    confirmed: { color: 'blue', icon: AlertCircle, label: 'Confirmed' },
    completed: { color: 'green', icon: CheckCircle, label: 'Completed' },
    cancelled: { color: 'red', icon: XCircle, label: 'Cancelled' }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.carName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] }
        : order
    ));
  };

  const handlePriceUpdate = (orderId, newPrice) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, negotiatedPrice: parseFloat(newPrice), lastUpdated: new Date().toISOString().split('T')[0] }
        : order
    ));
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  const openEditModal = (order) => {
    setEditingOrder({ ...order });
    setShowEditModal(true);
  };

  const saveOrder = () => {
    setOrders(orders.map(order => 
      order.id === editingOrder.id ? editingOrder : order
    ));
    setShowEditModal(false);
    setEditingOrder(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="h-8 w-8" />
          Order Management
        </h1>
        <p className="text-gray-600">Manage customer orders and negotiations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = orders.filter(order => order.status === status).length;
          const Icon = config.icon;
          return (
            <div key={status} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{config.label} Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                <div className={`p-3 rounded-full bg-${config.color}-100`}>
                  <Icon className={`h-6 w-6 text-${config.color}-600`} />
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
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                const statusColor = statusConfig[order.status].color;
                
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">Updated: {order.lastUpdated}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                          <div className="text-sm text-gray-500">{order.customerEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Car className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{order.carName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                          <span className="font-medium">${order.negotiatedPrice.toLocaleString()}</span>
                        </div>
                        {order.originalPrice !== order.negotiatedPrice && (
                          <div className="text-xs text-gray-500 line-through">
                            Original: ${order.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 bg-${statusColor}-100 text-${statusColor}-800 focus:ring-2 focus:ring-${statusColor}-500`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.orderDate}
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
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete Order"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Order Number</label>
                  <p className="text-gray-900">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-gray-900 capitalize">{selectedOrder.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer Name</label>
                  <p className="text-gray-900">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer Email</label>
                  <p className="text-gray-900">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Car</label>
                  <p className="text-gray-900">{selectedOrder.carName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Order Date</label>
                  <p className="text-gray-900">{selectedOrder.orderDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Original Price</label>
                  <p className="text-gray-900">${selectedOrder.originalPrice.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Negotiated Price</label>
                  <p className="text-gray-900 font-semibold">${selectedOrder.negotiatedPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
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
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Negotiated Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={editingOrder.negotiatedPrice}
                    onChange={(e) => setEditingOrder({...editingOrder, negotiatedPrice: parseFloat(e.target.value) || 0})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter negotiated price"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={saveOrder}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;