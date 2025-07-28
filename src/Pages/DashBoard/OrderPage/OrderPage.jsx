"use client";

import {
  AlertCircle,
  Anchor,
  Car,
  Check,
  CheckCircle,
  Copy,
  CreditCard,
  DollarSign,
  Edit,
  Eye,
  Filter,
  Loader2,
  MessageSquare,
  Package,
  Search,
  ShoppingCart,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import React, { useCallback, useState } from "react";
import Swal from "sweetalert2";
import {
  useAllOrders,
  useOrderStats,
  useRemoveOrderItem,
  useUpdateOrderStatus,
  useVerifyPayment,
} from "../../../hooks/useOrders";

const AdminOrderManagement = () => {
  // State Management
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedOrderId, setCopiedOrderId] = useState(null);

  // API Hooks
  const { data: ordersData, isLoading, error } = useAllOrders();
  const { data: statsData } = useOrderStats();
  const updateOrderMutation = useUpdateOrderStatus();
  const removeItemMutation = useRemoveOrderItem();
  const verifyPaymentMutation = useVerifyPayment();

  // Data Processing
  const orders = ordersData?.orders || [];

  // Configuration Objects
  const statusConfig = {
    NEGOTIATING: {
      color: "yellow",
      icon: MessageSquare,
      label: "Negotiating",
    },
    CONFIRMED: {
      color: "blue",
      icon: AlertCircle,
      label: "Confirmed",
    },
    SHIPPING: {
      color: "purple",
      icon: Package,
      label: "Shipping",
    },
    DELIVERED: {
      color: "emerald",
      icon: CheckCircle,
      label: "Delivered",
    },
    CANCELLED: {
      color: "red",
      icon: XCircle,
      label: "Cancelled",
    },
  };

  const portOptions = [
    { value: "mongla", label: "Mongla Port" },
    { value: "chittagong", label: "Chittagong Port" },
    { value: "payra", label: "Payra Port" },
    { value: "bondor", label: "Bondor Port" },
    { value: "dhaka", label: "Dhaka Port" },
    { value: "sylhet", label: "Sylhet Port" },
  ];

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

  const getPortLabel = (portValue) => {
    const port = portOptions.find((p) => p.value === portValue);
    return port ? port.label : "Not Selected";
  };

  const calculateTotalPaid = (paymentTransactions) => {
    if (!paymentTransactions || paymentTransactions.length === 0) return 0;
    return paymentTransactions
      .filter((payment) => payment.status === "COMPLETED")
      .reduce((total, payment) => total + (payment.amount || 0), 0);
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

  const handlePortUpdate = async (orderId, newPort, newStatus) => {
    try {
      await updateOrderMutation.mutateAsync({
        orderId,
        statusData: { status: newStatus, port: newPort },
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
      port: order.port || "mongla",
    });
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
        },
      });

      setShowEditModal(false);
      setEditingOrder(null);

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
      width: "500px",
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
          width: "500px",
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
              isApproved: true, // Explicitly set as boolean true
              notes: result.value?.notes || "",
              rejectionReason: null, // Set as null for approved payments
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
                  isApproved: false, // Explicitly set as boolean false
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
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
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
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="lg:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="h-8 w-8 text-blue-600" />
          Admin Order Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage customer orders and negotiations efficiently
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-5 mb-6">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = statusCounts[status] || 0;
          const Icon = config.icon;
          return (
            <div
              key={status}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    {config.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {count}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${config.color}-100`}>
                  <Icon className={`h-5 w-5 text-${config.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
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
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                const StatusIcon =
                  statusConfig[order.status]?.icon || AlertCircle;
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
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border-0 bg-${statusColor}-100 text-${statusColor}-800 focus:ring-2 focus:ring-${statusColor}-500 transition-colors`}
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

                    {/* Port Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.port || "mongla"}
                        onChange={(e) =>
                          handlePortUpdate(
                            order.id,
                            e.target.value,
                            order.status
                          )
                        }
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border-0 bg-blue-100 text-blue-800 focus:ring-2 focus:ring-blue-500 transition-colors"
                        disabled={updateOrderMutation.isPending}
                      >
                        {portOptions.map((port) => (
                          <option key={port.value} value={port.value}>
                            {port.label}
                          </option>
                        ))}
                      </select>
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
                                    payment.status === "COMPLETED"
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
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
            <div className="p-6 space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        Order Status
                      </p>
                      <p className="text-xl font-bold text-blue-900 mt-1">
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
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        Order Total
                      </p>
                      <p className="text-xl font-bold text-green-900 mt-1">
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
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">
                        Payment Status
                      </p>
                      <p className="text-xl font-bold text-purple-900 mt-1">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Package className="h-5 w-5 mr-2 text-gray-600" />
                      Order Information
                    </h4>
                    <div className="bg-gray-50 p-6 rounded-xl space-y-4">
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
                          value: getPortLabel(selectedOrder.port),
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
                          className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                        >
                          <span className="text-sm font-medium text-gray-600">
                            {item.label}:
                          </span>
                          <span
                            className={`text-sm ${
                              item.mono ? "font-mono" : "font-medium"
                            } ${
                              item.badge
                                ? `px-3 py-1 rounded-full bg-${item.color}-100 text-${item.color}-800`
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
                    <div className="bg-gray-50 p-6 rounded-xl space-y-4">
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
                          className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                        >
                          <span className="text-sm font-medium text-gray-600">
                            {item.label}:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
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
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center space-x-6">
                          <img
                            src={
                              item.car?.mainImage ||
                              "/placeholder.svg?height=100&width=100" ||
                              "/placeholder.svg"
                            }
                            alt={item.car?.title}
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.src =
                                "/placeholder.svg?height=100&width=100";
                            }}
                          />
                          <div className="flex-1">
                            <h5 className="text-xl font-semibold text-gray-900 mb-2">
                              {item.car?.title}
                            </h5>
                            <p className="text-sm text-gray-600 mb-4">
                              Year: {item.car?.year}
                            </p>
                            <div className="flex items-center space-x-8">
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
                          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-6 mb-3">
                                <div>
                                  <p className="text-2xl font-bold text-gray-900">
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
                                    payment.status === "COMPLETED"
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
                                className="ml-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
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
                  <div className="bg-gray-50 p-6 rounded-xl space-y-6">
                    {selectedOrder.notes && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Notes:
                        </label>
                        <p className="text-gray-900 mt-2 leading-relaxed">
                          {selectedOrder.notes}
                        </p>
                      </div>
                    )}
                    {selectedOrder.trackingInfo && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Tracking Info:
                        </label>
                        <p className="text-gray-900 mt-2 font-mono bg-white p-3 rounded-lg border">
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
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <h3 className="text-xl font-bold text-gray-900">Edit Order</h3>
              <p className="text-sm text-gray-600 mt-1">
                Update order information and settings
              </p>
            </div>
            <div className="p-6 space-y-6">
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Port
                </label>
                <div className="relative">
                  <Anchor className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    value={editingOrder.port || "mongla"}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, port: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {portOptions.map((port) => (
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

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingOrder(null);
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  disabled={updateOrderMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={saveOrder}
                  disabled={updateOrderMutation.isPending}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
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
