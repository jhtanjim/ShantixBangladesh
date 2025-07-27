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
import { useCallback, useState } from "react";
import Swal from "sweetalert2";
import {
  useAllOrders,
  useOrderStats,
  useRemoveOrderItem,
  useUpdateOrderStatus,
  useVerifyPayment,
} from "../../../hooks/useOrders";

const AdminOrderManagement = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedOrderId, setCopiedOrderId] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(null);

  // API hooks
  const { data: ordersData, isLoading, error } = useAllOrders();
  const { data: statsData } = useOrderStats();
  const updateOrderMutation = useUpdateOrderStatus();
  const removeItemMutation = useRemoveOrderItem();
  const verifyPaymentMutation = useVerifyPayment();

  const orders = ordersData?.orders || [];

  const statusConfig = {
    NEGOTIATING: { color: "yellow", icon: MessageSquare, label: "Negotiating" },
    CONFIRMED: { color: "blue", icon: AlertCircle, label: "Confirmed" },
    SHIPPING: { color: "purple", icon: Package, label: "Shipping" },
    DELIVERED: { color: "emerald", icon: CheckCircle, label: "Delivered" },
    CANCELLED: { color: "red", icon: XCircle, label: "Cancelled" },
  };

  const portOptions = [
    { value: "mongla", label: "Mongla Port" },
    { value: "chittagong", label: "Chittagong Port" },
    { value: "payra", label: "Payra Port" },
    { value: "bondor", label: "Bondor Port" },
    { value: "dhaka", label: "Dhaka Port" },
    { value: "sylhet", label: "Sylhet Port" },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderItems?.some((item) =>
        item.car?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
        <div class="text-left">
          <p><strong>Amount:</strong> $${payment.amount}</p>
          <p><strong>Method:</strong> ${payment.paymentMethod}</p>
          <p><strong>Transaction Ref:</strong> ${payment.transactionRef}</p>
          <p><strong>Date:</strong> ${new Date(
            payment.createdAt
          ).toLocaleDateString()}</p>
        </div>
        <div class="mt-4">
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">Notes (optional):</label>
          <textarea id="notes" class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3" placeholder="Add verification notes..."></textarea>
        </div>
      `,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Approve",
      denyButtonText: "Reject",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10b981",
      denyButtonColor: "#ef4444",
      preConfirm: () => {
        const notes = document.getElementById("notes").value;
        return { action: "approve", notes };
      },
      preDeny: () => {
        return Swal.fire({
          title: "Reject Payment",
          html: `
            <div class="text-left">
              <label for="rejection-reason" class="block text-sm font-medium text-gray-700 mb-2">Rejection Reason:</label>
              <textarea id="rejection-reason" class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3" placeholder="Please provide a reason for rejection..." required></textarea>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: "Reject Payment",
          confirmButtonColor: "#ef4444",
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
              notes: result.value.notes || "",
              rejectionReason: "",
            },
          });

          Swal.fire({
            icon: "success",
            title: "Payment Approved!",
            text: "Payment has been successfully verified and approved.",
            timer: 2500,
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
                  rejectionReason: rejectResult.value.rejectionReason,
                },
              });

              Swal.fire({
                icon: "success",
                title: "Payment Rejected",
                text: "Payment has been rejected with the provided reason.",
                timer: 2500,
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

  const viewPaymentDetails = (payment) => {
    setShowPaymentDetails(payment);
  };

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

  const statusCounts = getStatusCounts();

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
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="h-8 w-8" />
          Admin Order Management
        </h1>
        <p className="text-gray-600">Manage customer orders and negotiations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-5 mb-6">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = statusCounts[status] || 0;
          const Icon = config.icon;
          return (
            <div key={status} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    {config.label}
                  </p>
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
                <option key={status} value={status}>
                  {config.label}
                </option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Port
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm font-medium text-gray-900 font-mono cursor-pointer hover:text-blue-600 flex items-center gap-1"
                        onClick={() => copyToClipboard(order.id)}
                        title="Click to copy Order ID"
                      >
                        {order.id.substring(0, 8)}...
                        {copiedOrderId === order.id ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3 text-gray-400 hover:text-blue-600" />
                        )}
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
                          <div className="text-sm text-gray-500">
                            {order.user?.email}
                          </div>
                          {order.user?.phone && (
                            <div className="text-sm text-gray-500">
                              {order.user?.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.orderItems?.map((item, index) => (
                          <div key={item.id} className="flex items-center mb-1">
                            <Car className="h-4 w-4 text-gray-400 mr-2" />
                            <span>
                              {item.car?.title} ({item.car?.year})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                          <span className="font-medium">
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
                        {!order.finalPrice && (
                          <button
                            onClick={() => {
                              Swal.fire({
                                title: "Set Final Price",
                                html: `
                                  <div class="text-left">
                                    <p class="mb-4">Current negotiated price: ${formatPrice(
                                      order.negotiatedPrice ||
                                        order.totalOriginalPrice
                                    )}</p>
                                    <label for="final-price" class="block text-sm font-medium text-gray-700 mb-2">Final Price:</label>
                                    <input id="final-price" type="number" step="0.01" min="0" value="${
                                      order.negotiatedPrice ||
                                      order.totalOriginalPrice
                                    }" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter final price">
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
                            className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                            title="Set Final Price"
                          >
                            Set Final Price
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusUpdate(order.id, e.target.value)
                        }
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 bg-${statusColor}-100 text-${statusColor}-800 focus:ring-2 focus:ring-${statusColor}-500`}
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
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 bg-blue-100 text-blue-800 focus:ring-2 focus:ring-blue-500"
                        disabled={updateOrderMutation.isPending}
                      >
                        {portOptions.map((port) => (
                          <option key={port.value} value={port.value}>
                            {port.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.payments && order.payments.length > 0 ? (
                          <div className="space-y-1">
                            {order.payments.map((payment) => (
                              <div
                                key={payment.id}
                                className="flex items-center gap-2"
                              >
                                <span className="text-xs">
                                  {formatPrice(payment.amount)}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    payment.isVerified
                                      ? "bg-green-100 text-green-800"
                                      : payment.isApproved === false
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {payment.isVerified
                                    ? "Verified"
                                    : payment.isApproved === false
                                    ? "Rejected"
                                    : "Pending"}
                                </span>
                                <button
                                  onClick={() => viewPaymentDetails(payment)}
                                  className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                  title="View Payment Details"
                                >
                                  <Eye className="h-3 w-3" />
                                </button>
                                {!payment.isVerified &&
                                  payment.isApproved !== false && (
                                    <button
                                      onClick={() =>
                                        handlePaymentApproval(payment)
                                      }
                                      className="text-green-600 hover:text-green-800 p-1 rounded"
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
                          <span className="text-gray-400 text-xs">
                            No payments
                          </span>
                        )}
                      </div>
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
                        disabled={updateOrderMutation.isPending}
                      >
                        {updateOrderMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Edit className="h-4 w-4" />
                        )}
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
              <p className="text-gray-500">
                No orders found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Details Modal */}
      {showPaymentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Details
              </h3>
              <button
                onClick={() => setShowPaymentDetails(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Amount
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {formatPrice(showPaymentDetails.amount)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Payment Method
                </label>
                <p className="text-gray-900">
                  {showPaymentDetails.paymentMethod}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Transaction Reference
                </label>
                <p className="text-gray-900 font-mono">
                  {showPaymentDetails.transactionRef}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    showPaymentDetails.isVerified
                      ? "bg-green-100 text-green-800"
                      : showPaymentDetails.isApproved === false
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {showPaymentDetails.isVerified
                    ? "Verified"
                    : showPaymentDetails.isApproved === false
                    ? "Rejected"
                    : "Pending"}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Date
                </label>
                <p className="text-gray-900">
                  {formatDate(showPaymentDetails.createdAt)}
                </p>
              </div>
              {showPaymentDetails.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Admin Notes
                  </label>
                  <p className="text-gray-900">{showPaymentDetails.notes}</p>
                </div>
              )}
              {showPaymentDetails.rejectionReason && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Rejection Reason
                  </label>
                  <p className="text-red-600">
                    {showPaymentDetails.rejectionReason}
                  </p>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                {!showPaymentDetails.isVerified &&
                  showPaymentDetails.isApproved !== false && (
                    <button
                      onClick={() => {
                        setShowPaymentDetails(null);
                        handlePaymentApproval(showPaymentDetails);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Verify Payment
                    </button>
                  )}
                <button
                  onClick={() => setShowPaymentDetails(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Order Details
              </h3>
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
                  <h4 className="font-semibold text-gray-900">
                    Order Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Order ID
                      </label>
                      <p className="text-gray-900 font-mono text-sm">
                        {selectedOrder.id}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Status
                      </label>
                      <p className="text-gray-900 capitalize">
                        {statusConfig[selectedOrder.status]?.label}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Port
                      </label>
                      <p className="text-gray-900">
                        {getPortLabel(selectedOrder.port)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Created Date
                      </label>
                      <p className="text-gray-900">
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Last Updated
                      </label>
                      <p className="text-gray-900">
                        {formatDate(selectedOrder.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">
                    Customer Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Name
                      </label>
                      <p className="text-gray-900">
                        {selectedOrder.user?.firstName}{" "}
                        {selectedOrder.user?.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Email
                      </label>
                      <p className="text-gray-900">
                        {selectedOrder.user?.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Phone
                      </label>
                      <p className="text-gray-900">
                        {selectedOrder.user?.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  Order Items
                </h4>
                <div className="space-y-4">
                  {selectedOrder.orderItems?.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 flex items-center space-x-4"
                    >
                      <img
                        src={
                          item.car?.mainImage ||
                          "/placeholder.svg?height=64&width=64"
                        }
                        alt={item.car?.title}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=64&width=64";
                        }}
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">
                          {item.car?.title}
                        </h5>
                        <p className="text-sm text-gray-600">
                          Year: {item.car?.year}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">
                            Original: {formatPrice(item.originalPrice)}
                          </span>
                          {item.negotiatedPrice && (
                            <span className="text-sm font-medium text-green-600">
                              Negotiated: {formatPrice(item.negotiatedPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleRemoveItem(selectedOrder.id, item.id)
                        }
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Remove item"
                        disabled={removeItemMutation.isPending}
                      >
                        {removeItemMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment History */}
              {selectedOrder.payments && selectedOrder.payments.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Payment History
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="border rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {formatPrice(payment.amount)}
                              </p>
                              <p className="text-sm text-gray-600">
                                {payment.paymentMethod} •{" "}
                                {payment.transactionRef}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(payment.createdAt)}
                              </p>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                payment.isVerified
                                  ? "bg-green-100 text-green-800"
                                  : payment.isApproved === false
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {payment.isVerified
                                ? "Verified"
                                : payment.isApproved === false
                                ? "Rejected"
                                : "Pending"}
                            </div>
                          </div>
                          {payment.notes && (
                            <p className="text-sm text-gray-600 mt-2">
                              <strong>Notes:</strong> {payment.notes}
                            </p>
                          )}
                          {payment.rejectionReason && (
                            <p className="text-sm text-red-600 mt-2">
                              <strong>Rejection Reason:</strong>{" "}
                              {payment.rejectionReason}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewPaymentDetails(payment)}
                            className="px-3 py-1 text-blue-600 hover:text-blue-800 border border-blue-300 rounded text-sm"
                          >
                            View
                          </button>
                          {!payment.isVerified &&
                            payment.isApproved !== false && (
                              <button
                                onClick={() => handlePaymentApproval(payment)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
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

              {/* Pricing Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span>
                    {formatPrice(
                      selectedOrder.finalPrice ||
                        selectedOrder.negotiatedPrice ||
                        selectedOrder.totalOriginalPrice
                    )}
                  </span>
                </div>
              </div>

              {/* Additional Information */}
              {(selectedOrder.notes ||
                selectedOrder.trackingInfo ||
                selectedOrder.paymentScreenshot) && (
                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-semibold text-gray-900">
                    Additional Information
                  </h4>
                  {selectedOrder.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Notes
                      </label>
                      <p className="text-gray-900">{selectedOrder.notes}</p>
                    </div>
                  )}
                  {selectedOrder.trackingInfo && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Tracking Info
                      </label>
                      <p className="text-gray-900">
                        {selectedOrder.trackingInfo}
                      </p>
                    </div>
                  )}
                  {selectedOrder.paymentScreenshot && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Payment Screenshot
                      </label>
                      <img
                        src={
                          selectedOrder.paymentScreenshot || "/placeholder.svg"
                        }
                        alt="Payment screenshot"
                        className="mt-2 max-w-sm rounded border"
                        onError={(e) => {
                          e.target.src =
                            "/placeholder.svg?height=200&width=300";
                        }}
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
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Order
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editingOrder.status}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <option key={status} value={status}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Port
                </label>
                <div className="relative">
                  <Anchor className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <select
                    value={editingOrder.port || "mongla"}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, port: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Negotiated Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter negotiated price"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tracking number or info"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={editingOrder.notes || ""}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add notes about this order..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingOrder(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={updateOrderMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={saveOrder}
                  disabled={updateOrderMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
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
