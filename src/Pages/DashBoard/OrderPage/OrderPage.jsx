"use client";
import {
  AlertCircle,
  Anchor,
  Building,
  Car,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  CreditCard,
  DollarSign,
  Edit,
  Eye,
  Filter,
  Globe,
  Loader2,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShoppingCart,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  useAllOrders,
  useOrderStats,
  useRemoveOrderItem,
  useUpdateOrderStatus,
  useVerifyPayment,
} from "../../../hooks/useOrders";

// Import your portData
import { portData } from "../../../api/portData";

const AdminOrderManagement = () => {
  // State Management
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedOrderId, setCopiedOrderId] = useState(null);
  const [expandedCards, setExpandedCards] = useState(new Set());

  // New states for country and port selection
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [availablePorts, setAvailablePorts] = useState([]);

  // API Hooks
  const { data: ordersData, isLoading, error, refetch } = useAllOrders();
  console.log(ordersData);
  const { data: statsData } = useOrderStats();
  const updateOrderMutation = useUpdateOrderStatus();
  const removeItemMutation = useRemoveOrderItem();
  const verifyPaymentMutation = useVerifyPayment();

  // Data Processing
  const orders = ordersData?.orders || [];

  // Fetch countries from REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2"
        );
        const data = await response.json();

        // Filter countries that have ports in our portData
        const availableCountries = data
          .filter((country) => portData[country.cca2])
          .map((country) => ({
            code: country.cca2,
            name: country.name.common,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(availableCountries);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        // Fallback to countries we have in portData
        const fallbackCountries = Object.keys(portData).map((code) => ({
          code,
          name: code, // Use country code as name if API fails
        }));
        setCountries(fallbackCountries);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Update available ports when country changes
  useEffect(() => {
    if (selectedCountry && portData[selectedCountry]) {
      setAvailablePorts(portData[selectedCountry]);
    } else {
      setAvailablePorts([]);
    }
  }, [selectedCountry]);

  // Configuration Objects
  const statusConfig = {
    NEGOTIATING: {
      color: "yellow",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      icon: MessageSquare,
      label: "Negotiating",
    },
    CONFIRMED: {
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      icon: AlertCircle,
      label: "Confirmed",
    },
    SHIPPING: {
      color: "purple",
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
      icon: Package,
      label: "Shipping",
    },
    DELIVERED: {
      color: "emerald",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-800",
      icon: CheckCircle,
      label: "Delivered",
    },
    CANCELLED: {
      color: "red",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      icon: XCircle,
      label: "Cancelled",
    },
  };

  // Filtering Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderItems?.some((item) =>
        item.car?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Utility Functions
  const copyToClipboard = useCallback(async (orderId) => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopiedOrderId(orderId);
      setTimeout(() => setCopiedOrderId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      const textArea = document.createElement("textarea");
      textArea.value = orderId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedOrderId(orderId);
      setTimeout(() => setCopiedOrderId(null), 2000);
    }
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStatusCounts = () => {
    const counts = {};
    Object.keys(statusConfig).forEach((status) => {
      counts[status] = orders.filter((order) => order.status === status).length;
    });
    return counts;
  };

  const getPortLabel = (portValue, countryCode) => {
    if (!portValue) return "Not Selected";

    // If we have country code, look in that country's ports
    if (countryCode && portData[countryCode]) {
      const port = portData[countryCode].find((p) => p.value === portValue);
      if (port) return port.label;
    }

    // Fallback: search in all countries
    for (const country of Object.keys(portData)) {
      const port = portData[country].find((p) => p.value === portValue);
      if (port) return port.label;
    }

    return portValue; // Return the value itself if not found
  };

  // FIXED: Updated to handle VERIFIED status instead of COMPLETED
  const calculateTotalPaid = (paymentTransactions) => {
    if (!paymentTransactions || paymentTransactions.length === 0) return 0;
    return paymentTransactions
      .filter((payment) => payment.status === "VERIFIED")
      .reduce((total, payment) => total + (payment.amount || 0), 0);
  };

  const toggleCardExpansion = (orderId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedCards(newExpanded);
  };

  // Event Handlers
  const handleSetFinalPrice = async (orderId, finalPrice) => {
    try {
      const currentOrder = orders.find((order) => order.id === orderId);
      if (!currentOrder) {
        throw new Error("Order not found");
      }
      await updateOrderMutation.mutateAsync({
        orderId,
        statusData: {
          finalPrice: Number.parseFloat(finalPrice),
          status: currentOrder.status,
        },
      });
      Swal.fire({
        title: "Success!",
        text: "Final price has been set successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to set final price:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to set final price",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderMutation.mutateAsync({
        orderId,
        statusData: { status: newStatus },
      });
    } catch (error) {
      console.error("Failed to update order status:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update order status",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handlePortUpdate = async (orderId, newPort, newStatus, countryCode) => {
    try {
      await updateOrderMutation.mutateAsync({
        orderId,
        statusData: {
          status: newStatus,
          port: newPort,
          portCountry: countryCode, // Store country code with port
        },
      });
    } catch (error) {
      console.error("Failed to update order port:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update port",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleRemoveItem = async (orderId, itemId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this item from the order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });

    if (result.isConfirmed) {
      try {
        await removeItemMutation.mutateAsync({ orderId, itemId });
        Swal.fire({
          title: "Removed!",
          text: "The item has been removed from the order.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Failed to remove item:", error);
        Swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to remove item",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const openEditModal = (order) => {
    setEditingOrder({
      ...order,
      negotiatedPrice: order.negotiatedPrice || order.totalOriginalPrice,
      notes: order.notes || "",
      trackingInfo: order.trackingInfo || "",
      estimatedDelivery: order.estimatedDelivery
        ? new Date(order.estimatedDelivery).toISOString().split("T")[0]
        : "",
      port: order.port || "",
      portCountry: order.portCountry || "",
    });

    // Set selected country and available ports for editing
    if (order.portCountry) {
      setSelectedCountry(order.portCountry);
      setAvailablePorts(portData[order.portCountry] || []);
    } else {
      setSelectedCountry("");
      setAvailablePorts([]);
    }

    setShowEditModal(true);
  };

  const saveOrder = async () => {
    try {
      let estimatedDeliveryISO = null;
      if (editingOrder.estimatedDelivery) {
        try {
          const deliveryDate = new Date(
            editingOrder.estimatedDelivery + "T12:00:00"
          );
          if (isNaN(deliveryDate.getTime())) {
            throw new Error("Invalid date format");
          }
          estimatedDeliveryISO = deliveryDate.toISOString();
        } catch (dateError) {
          throw new Error("Invalid estimated delivery date");
        }
      }

      await updateOrderMutation.mutateAsync({
        orderId: editingOrder.id,
        statusData: {
          status: editingOrder.status,
          negotiatedPrice: Number.parseFloat(editingOrder.negotiatedPrice),
          notes: editingOrder.notes,
          trackingInfo: editingOrder.trackingInfo,
          estimatedDelivery: estimatedDeliveryISO,
          port: editingOrder.port,
          portCountry: selectedCountry,
        },
      });

      setShowEditModal(false);
      setEditingOrder(null);
      setSelectedCountry("");
      setAvailablePorts([]);

      Swal.fire({
        title: "Success!",
        text: "Order updated successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to save order:", error);
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          error.message ||
          "Failed to update order",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handlePaymentApproval = (payment) => {
    Swal.fire({
      title: "Verify Payment",
      html: `
      <div class="text-left space-y-3">
        <div class="bg-gray-50 p-4 rounded-lg">
          <p><strong>Amount:</strong> $${payment.amount.toLocaleString()}</p>
          <p><strong>Status:</strong> ${payment.status}</p>
          <p><strong>Date:</strong> ${new Date(
            payment.createdAt
          ).toLocaleDateString()}</p>
          <p><strong>Transaction ID:</strong> ${payment.id}</p>
        </div>
        <div class="mt-4">
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
            Admin Notes (optional):
          </label>
          <textarea 
            id="notes"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="3"
            placeholder="Add verification notes..."
          ></textarea>
        </div>
      </div>
    `,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "✅ Approve Payment",
      denyButtonText: "❌ Reject Payment",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10b981",
      denyButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      width: "90%",
      maxWidth: "500px",
      preConfirm: () => {
        const notes = document.getElementById("notes").value;
        return { action: "approve", notes };
      },
      preDeny: () => {
        return Swal.fire({
          title: "Reject Payment",
          html: `
          <div class="text-left">
            <div class="bg-red-50 p-4 rounded-lg mb-4">
              <p class="text-red-800"><strong>⚠️ You are about to reject this payment</strong></p>
              <p class="text-sm text-red-600 mt-1">Amount: $${payment.amount.toLocaleString()}</p>
            </div>
            <label for="rejection-reason" class="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason (Required):
            </label>
            <textarea 
              id="rejection-reason"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="3"
              placeholder="Please provide a detailed reason for rejection..."
              required
            ></textarea>
          </div>
        `,
          showCancelButton: true,
          confirmButtonText: "Reject Payment",
          confirmButtonColor: "#ef4444",
          width: "90%",
          maxWidth: "500px",
          preConfirm: () => {
            const rejectionReason =
              document.getElementById("rejection-reason").value;
            if (!rejectionReason.trim()) {
              Swal.showValidationMessage("Please provide a rejection reason");
              return false;
            }
            return { action: "reject", rejectionReason };
          },
        });
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await verifyPaymentMutation.mutateAsync({
            paymentId: payment.id,
            verificationData: {
              isApproved: true,
              notes: result.value?.notes || "",
              rejectionReason: null,
            },
          });
          Swal.fire({
            icon: "success",
            title: "✅ Payment Approved!",
            text: "Payment has been successfully verified and approved.",
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
          });
        } catch (error) {
          console.error("Payment verification error:", error);
          Swal.fire({
            icon: "error",
            title: "Verification Failed",
            text:
              error.response?.data?.message ||
              "Failed to verify payment. Please try again.",
            confirmButtonColor: "#3085d6",
          });
        }
      } else if (result.isDenied) {
        result.value.then(async (rejectResult) => {
          if (rejectResult.isConfirmed) {
            try {
              await verifyPaymentMutation.mutateAsync({
                paymentId: payment.id,
                verificationData: {
                  isApproved: false,
                  notes: "",
                  rejectionReason: rejectResult.value?.rejectionReason || "",
                },
              });
              Swal.fire({
                icon: "success",
                title: "❌ Payment Rejected",
                text: "Payment has been rejected with the provided reason.",
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
              });
            } catch (error) {
              console.error("Payment verification error:", error);
              Swal.fire({
                icon: "error",
                title: "Verification Failed",
                text:
                  error.response?.data?.message ||
                  "Failed to verify payment. Please try again.",
                confirmButtonColor: "#3085d6",
              });
            }
          }
        });
      }
    });
  };

  // Computed Values
  const statusCounts = getStatusCounts();

  // Loading and Error States
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <XCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="mb-4">Failed to load orders. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
          <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          <span className="hidden sm:inline">Admin Order Management</span>
          <span className="sm:hidden">Orders</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage customer orders and negotiations efficiently
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = statusCounts[status] || 0;
          const Icon = config.icon;
          return (
            <div
              key={status}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide truncate">
                    {config.label}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    {count}
                  </p>
                </div>
                <div
                  className={`p-2 sm:p-3 rounded-full ${config.bgColor} flex-shrink-0 ml-2`}
                >
                  <Icon
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${config.textColor}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, customers, or cars..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative sm:w-48">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              {Object.entries(statusConfig).map(([status, config]) => (
                <option key={status} value={status}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Port
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Payments
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const statusColor = statusConfig[order.status]?.color || "gray";
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Order ID Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm font-medium text-gray-900 font-mono cursor-pointer hover:text-blue-600 flex items-center gap-2 transition-colors"
                        onClick={() => copyToClipboard(order.id)}
                        title="Click to copy Order ID"
                      >
                        <span>{order.id.substring(0, 8)}...</span>
                        {copiedOrderId === order.id ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3 text-gray-400 hover:text-blue-600" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Updated: {formatDate(order.updatedAt)}
                      </div>
                    </td>

                    {/* Customer Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <User className="h-4 w-4 text-gray-400 mt-1" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {order.user?.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.user?.email}
                          </div>
                          {order.user?.phone && (
                            <div className="text-xs text-gray-500">
                              {order.user?.phone}
                            </div>
                          )}
                          {order.user?.country && (
                            <div className="text-xs text-gray-500">
                              {order.user?.country}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Items Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.orderItems && order.orderItems.length > 0 ? (
                          order.orderItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center mb-1"
                            >
                              <Car className="h-3 w-3 text-gray-400 mr-2" />
                              <span className="text-xs">
                                {item.car?.title} ({item.car?.year})
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            No items
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Price Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="flex items-center mb-1">
                          <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                          <span className="font-semibold text-gray-900">
                            {formatPrice(
                              order.finalPrice ||
                                order.negotiatedPrice ||
                                order.totalOriginalPrice
                            )}
                          </span>
                        </div>
                        {order.negotiatedPrice &&
                          order.negotiatedPrice !==
                            order.totalOriginalPrice && (
                            <div className="text-xs text-gray-500 line-through">
                              Original: {formatPrice(order.totalOriginalPrice)}
                            </div>
                          )}
                        <div className="text-xs text-blue-600 font-medium">
                          Paid:{" "}
                          {formatPrice(
                            calculateTotalPaid(order.paymentTransactions)
                          )}
                        </div>
                        {!order.finalPrice && (
                          <button
                            onClick={() => {
                              Swal.fire({
                                title: "Set Final Price",
                                html: `
                                  <div class="text-left">
                                    <p class="mb-4 text-gray-600">
                                      Current price: ${formatPrice(
                                        order.negotiatedPrice ||
                                          order.totalOriginalPrice
                                      )}
                                    </p>
                                    <label for="final-price" class="block text-sm font-medium text-gray-700 mb-2">
                                      Final Price:
                                    </label>
                                    <input
                                       id="final-price"
                                       type="number"
                                       step="0.01"
                                       min="0"
                                       value="${
                                         order.negotiatedPrice ||
                                         order.totalOriginalPrice
                                       }"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                       placeholder="Enter final price"
                                    >
                                  </div>
                                `,
                                showCancelButton: true,
                                confirmButtonText: "Set Final Price",
                                confirmButtonColor: "#10b981",
                                width: "90%",
                                maxWidth: "400px",
                                preConfirm: () => {
                                  const finalPriceInput =
                                    document.getElementById("final-price");
                                  const finalPrice = finalPriceInput.value;
                                  if (!finalPrice || finalPrice.trim() === "") {
                                    Swal.showValidationMessage(
                                      "Please enter a final price"
                                    );
                                    return false;
                                  }
                                  const numericPrice =
                                    Number.parseFloat(finalPrice);
                                  if (
                                    isNaN(numericPrice) ||
                                    numericPrice <= 0
                                  ) {
                                    Swal.showValidationMessage(
                                      "Please enter a valid final price greater than 0"
                                    );
                                    return false;
                                  }
                                  return numericPrice;
                                },
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  handleSetFinalPrice(order.id, result.value);
                                }
                              });
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 transition-colors"
                            title="Set Final Price"
                          >
                            Set Final Price
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusUpdate(order.id, e.target.value)
                        }
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border-0 ${
                          statusConfig[order.status]?.bgColor
                        } ${
                          statusConfig[order.status]?.textColor
                        } focus:ring-2 focus:ring-${statusColor}-500 transition-colors`}
                        disabled={updateOrderMutation.isPending}
                      >
                        {Object.entries(statusConfig).map(
                          ([status, config]) => (
                            <option key={status} value={status}>
                              {config.label}
                            </option>
                          )
                        )}
                      </select>
                    </td>

                    {/* Port Column - Updated with country selection */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs">
                        <div className="font-medium text-gray-900">
                          {getPortLabel(order.port, order.portCountry)}
                        </div>
                        {order.portCountry && (
                          <div className="text-gray-500 mt-1">
                            {countries.find((c) => c.code === order.portCountry)
                              ?.name || order.portCountry}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Payments Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {order.paymentTransactions &&
                        order.paymentTransactions.length > 0 ? (
                          <div className="space-y-1">
                            {order.paymentTransactions.map((payment) => (
                              <div
                                key={payment.id}
                                className="flex items-center gap-2"
                              >
                                <span className="text-xs font-medium">
                                  {formatPrice(payment.amount)}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    payment.status === "VERIFIED"
                                      ? "bg-green-100 text-green-800"
                                      : payment.status === "FAILED"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {payment.status}
                                </span>
                                {payment.status === "PENDING" && (
                                  <button
                                    onClick={() =>
                                      handlePaymentApproval(payment)
                                    }
                                    className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                                    title="Verify Payment"
                                    disabled={verifyPaymentMutation.isPending}
                                  >
                                    {verifyPaymentMutation.isPending ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <CreditCard className="h-3 w-3" />
                                    )}
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            No payments
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(order)}
                          className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50 transition-colors"
                          title="Edit Order"
                          disabled={updateOrderMutation.isPending}
                        >
                          {updateOrderMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Edit className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500">
                No orders match your current search criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500">
              No orders match your current search criteria.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isExpanded = expandedCards.has(order.id);
            const statusConfig_ =
              statusConfig[order.status] || statusConfig.NEGOTIATING;
            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="text-sm font-medium text-gray-900 font-mono cursor-pointer hover:text-blue-600 flex items-center gap-2 transition-colors"
                      onClick={() => copyToClipboard(order.id)}
                      title="Click to copy Order ID"
                    >
                      <span>{order.id.substring(0, 12)}...</span>
                      {copiedOrderId === order.id ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                    <button
                      onClick={() => toggleCardExpansion(order.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.fullName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.user?.email}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig_.bgColor} ${statusConfig_.textColor}`}
                    >
                      {statusConfig_.label}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-gray-900">
                        {formatPrice(
                          order.finalPrice ||
                            order.negotiatedPrice ||
                            order.totalOriginalPrice
                        )}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-4 space-y-4">
                    {/* Customer Details */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Customer Details
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        {order.user?.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span>{order.user.phone}</span>
                          </div>
                        )}
                        {order.user?.country && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span>{order.user.country}</span>
                          </div>
                        )}
                        {order.user?.companyName && (
                          <div className="flex items-center gap-2 text-sm">
                            <Building className="h-3 w-3 text-gray-400" />
                            <span>{order.user.companyName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    {order.orderItems && order.orderItems.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          Items ({order.orderItems.length})
                        </h4>
                        <div className="space-y-2">
                          {order.orderItems.map((item) => (
                            <div
                              key={item.id}
                              className="bg-gray-50 rounded-lg p-3"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    item.car?.mainImage ||
                                    "/placeholder.svg?height=40&width=40" ||
                                    "/placeholder.svg"
                                  }
                                  alt={item.car?.title}
                                  className="w-10 h-10 object-cover rounded border"
                                  onError={(e) => {
                                    e.target.src =
                                      "/placeholder.svg?height=40&width=40";
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {item.car?.title}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Year: {item.car?.year}
                                  </div>
                                  <div className="text-xs text-gray-600 font-medium">
                                    {formatPrice(
                                      item.negotiatedPrice || item.originalPrice
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Payment Information */}
                    {order.paymentTransactions &&
                      order.paymentTransactions.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Payments ({order.paymentTransactions.length})
                          </h4>
                          <div className="space-y-2">
                            {order.paymentTransactions.map((payment) => (
                              <div
                                key={payment.id}
                                className="bg-gray-50 rounded-lg p-3"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">
                                    {formatPrice(payment.amount)}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      payment.status === "VERIFIED"
                                        ? "bg-green-100 text-green-800"
                                        : payment.status === "FAILED"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {payment.status}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">
                                    {formatDate(payment.createdAt)}
                                  </span>
                                  {payment.status === "PENDING" && (
                                    <button
                                      onClick={() =>
                                        handlePaymentApproval(payment)
                                      }
                                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                      disabled={verifyPaymentMutation.isPending}
                                    >
                                      {verifyPaymentMutation.isPending
                                        ? "Verifying..."
                                        : "Verify"}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Order Controls */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value)
                          }
                          className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          disabled={updateOrderMutation.isPending}
                        >
                          {Object.entries(statusConfig).map(
                            ([status, config]) => (
                              <option key={status} value={status}>
                                {config.label}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Port
                        </label>
                        <div className="text-xs text-gray-900 px-2 py-1 bg-gray-50 rounded border">
                          {getPortLabel(order.port, order.portCountry) ||
                            "Not Selected"}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => openEditModal(order)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        disabled={updateOrderMutation.isPending}
                      >
                        {updateOrderMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Edit className="h-4 w-4" />
                        )}
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Order Details
                  </h3>
                  <p className="text-sm text-gray-600 font-mono mt-1">
                    {selectedOrder.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white rounded-full transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        Order Status
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-blue-900 mt-1">
                        {statusConfig[selectedOrder.status]?.label}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-200 rounded-full">
                      {React.createElement(
                        statusConfig[selectedOrder.status]?.icon || AlertCircle,
                        {
                          className: "h-6 w-6 text-blue-700",
                        }
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        Order Total
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-green-900 mt-1">
                        {formatPrice(
                          selectedOrder.finalPrice ||
                            selectedOrder.negotiatedPrice ||
                            selectedOrder.totalOriginalPrice
                        )}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Paid:{" "}
                        {formatPrice(
                          calculateTotalPaid(selectedOrder.paymentTransactions)
                        )}
                      </p>
                    </div>
                    <div className="p-3 bg-green-200 rounded-full">
                      <DollarSign className="h-6 w-6 text-green-700" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-xl border border-purple-200 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">
                        Payment Status
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-purple-900 mt-1">
                        {selectedOrder.paymentStatus}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-200 rounded-full">
                      <CreditCard className="h-6 w-6 text-purple-700" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Order Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Package className="h-5 w-5 mr-2 text-gray-600" />
                      Order Information
                    </h4>
                    <div className="bg-gray-50 p-4 sm:p-6 rounded-xl space-y-4">
                      {[
                        {
                          label: "Order ID",
                          value: selectedOrder.id,
                          mono: true,
                        },
                        {
                          label: "Status",
                          value: statusConfig[selectedOrder.status]?.label,
                          badge: true,
                          color: statusConfig[selectedOrder.status]?.color,
                        },
                        {
                          label: "Port",
                          value: getPortLabel(
                            selectedOrder.port,
                            selectedOrder.portCountry
                          ),
                        },
                        {
                          label: "Port Country",
                          value:
                            countries.find(
                              (c) => c.code === selectedOrder.portCountry
                            )?.name ||
                            selectedOrder.portCountry ||
                            "Not Selected",
                        },
                        {
                          label: "Payment Status",
                          value: selectedOrder.paymentStatus,
                        },
                        {
                          label: "Total Paid",
                          value: formatPrice(
                            calculateTotalPaid(
                              selectedOrder.paymentTransactions
                            )
                          ),
                        },
                        {
                          label: "Created",
                          value: formatDate(selectedOrder.createdAt),
                        },
                        {
                          label: "Last Updated",
                          value: formatDate(selectedOrder.updatedAt),
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 last:border-b-0 gap-1 sm:gap-0"
                        >
                          <span className="text-sm font-medium text-gray-600">
                            {item.label}:
                          </span>
                          <span
                            className={`text-sm ${
                              item.mono ? "font-mono" : "font-medium"
                            } ${
                              item.badge
                                ? `px-3 py-1 rounded-full ${
                                    statusConfig[selectedOrder.status]?.bgColor
                                  } ${
                                    statusConfig[selectedOrder.status]
                                      ?.textColor
                                  }`
                                : "text-gray-900"
                            }`}
                          >
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-gray-600" />
                      Customer Information
                    </h4>
                    <div className="bg-gray-50 p-4 sm:p-6 rounded-xl space-y-4">
                      {[
                        { label: "Name", value: selectedOrder.user?.fullName },
                        { label: "Email", value: selectedOrder.user?.email },
                        {
                          label: "Phone",
                          value: selectedOrder.user?.phone || "N/A",
                        },
                        {
                          label: "Country",
                          value: selectedOrder.user?.country || "N/A",
                        },
                        {
                          label: "Company",
                          value: selectedOrder.user?.companyName || "N/A",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 last:border-b-0 gap-1 sm:gap-0"
                        >
                          <span className="text-sm font-medium text-gray-600">
                            {item.label}:
                          </span>
                          <span className="text-sm font-medium text-gray-900 break-all">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Car className="h-5 w-5 mr-2 text-gray-600" />
                  Order Items ({selectedOrder.orderItems?.length || 0})
                </h4>
                <div className="space-y-4">
                  {selectedOrder.orderItems &&
                  selectedOrder.orderItems.length > 0 ? (
                    selectedOrder.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                          <img
                            src={
                              item.car?.mainImage ||
                              "/placeholder.svg?height=100&width=100" ||
                              "/placeholder.svg"
                            }
                            alt={item.car?.title}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200 mx-auto sm:mx-0"
                            onError={(e) => {
                              e.target.src =
                                "/placeholder.svg?height=100&width=100";
                            }}
                          />
                          <div className="flex-1 text-center sm:text-left">
                            <h5 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                              {item.car?.title}
                            </h5>
                            <p className="text-sm text-gray-600 mb-4">
                              Year: {item.car?.year}
                            </p>
                            <div className="flex flex-col sm:flex-row items-center sm:space-x-8 space-y-2 sm:space-y-0">
                              <div className="text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                  Original Price
                                </p>
                                <p className="text-lg font-semibold text-gray-900 mt-1">
                                  {formatPrice(item.originalPrice)}
                                </p>
                              </div>
                              {item.negotiatedPrice && (
                                <div className="text-center">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Negotiated Price
                                  </p>
                                  <p className="text-lg font-semibold text-green-600 mt-1">
                                    {formatPrice(item.negotiatedPrice)}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleRemoveItem(selectedOrder.id, item.id)
                            }
                            className="text-red-600 hover:text-red-800 p-3 hover:bg-red-50 rounded-full transition-colors"
                            title="Remove item"
                            disabled={removeItemMutation.isPending}
                          >
                            {removeItemMutation.isPending ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No items in this order
                      </h3>
                      <p className="text-gray-500">
                        This order doesn't contain any items yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment History */}
              {selectedOrder.paymentTransactions &&
                selectedOrder.paymentTransactions.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                      Payment History (
                      {selectedOrder.paymentTransactions.length})
                    </h4>
                    <div className="space-y-4">
                      {selectedOrder.paymentTransactions.map((payment) => (
                        <div
                          key={payment.id}
                          className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-3">
                                <div>
                                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {formatPrice(payment.amount)}
                                  </p>
                                  <p className="text-sm text-gray-600 font-mono">
                                    Transaction ID: {payment.id}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatDate(payment.createdAt)}
                                  </p>
                                </div>
                                <div
                                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    payment.status === "VERIFIED"
                                      ? "bg-green-100 text-green-800"
                                      : payment.status === "FAILED"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {payment.status}
                                </div>
                              </div>
                            </div>
                            {payment.status === "PENDING" && (
                              <button
                                onClick={() => handlePaymentApproval(payment)}
                                className="w-full sm:w-auto ml-0 sm:ml-6 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                disabled={verifyPaymentMutation.isPending}
                              >
                                {verifyPaymentMutation.isPending ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Verifying...
                                  </>
                                ) : (
                                  <>
                                    <CreditCard className="h-4 w-4" />
                                    Verify Payment
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Additional Information */}
              {(selectedOrder.notes || selectedOrder.trackingInfo) && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">
                    Additional Information
                  </h4>
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-xl space-y-6">
                    {selectedOrder.notes && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Notes:
                        </label>
                        <p className="text-gray-900 mt-2 leading-relaxed break-words">
                          {selectedOrder.notes}
                        </p>
                      </div>
                    )}
                    {selectedOrder.trackingInfo && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Tracking Info:
                        </label>
                        <p className="text-gray-900 mt-2 font-mono bg-white p-3 rounded-lg border break-all">
                          {selectedOrder.trackingInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && editingOrder && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Edit Order
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Update order information and settings
              </p>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={editingOrder.status}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, status: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <option key={status} value={status}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setEditingOrder({ ...editingOrder, port: "" }); // Reset port when country changes
                    }}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={loadingCountries}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Port Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Port
                </label>
                <div className="relative">
                  <Anchor className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    value={editingOrder.port || ""}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, port: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={!selectedCountry || availablePorts.length === 0}
                  >
                    <option value="">
                      {!selectedCountry
                        ? "Select country first"
                        : availablePorts.length === 0
                        ? "No ports available"
                        : "Select Port"}
                    </option>
                    {availablePorts.map((port) => (
                      <option key={port.value} value={port.value}>
                        {port.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Negotiated Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={editingOrder.negotiatedPrice || ""}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        negotiatedPrice: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter negotiated price"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tracking Information
                </label>
                <input
                  type="text"
                  value={editingOrder.trackingInfo || ""}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      trackingInfo: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter tracking number or info"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estimated Delivery
                </label>
                <input
                  type="date"
                  value={editingOrder.estimatedDelivery || ""}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      estimatedDelivery: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={editingOrder.notes || ""}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, notes: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Add notes about this order..."
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingOrder(null);
                    setSelectedCountry("");
                    setAvailablePorts([]);
                  }}
                  className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  disabled={updateOrderMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={saveOrder}
                  disabled={updateOrderMutation.isPending}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {updateOrderMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
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
