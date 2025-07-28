"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  FileText,
  Loader2,
  MapPin,
  Package,
  Plus,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useAddPaymentToOrder, useUploadPayment } from "../../hooks/useOrders";

const OrderCard = ({ order }) => {
  console.log(order);
  const [uploadingPayment, setUploadingPayment] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentMethod: "",
    transactionRef: "",
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Use React Query hooks
  const addPaymentMutation = useAddPaymentToOrder();
  const uploadPaymentMutation = useUploadPayment();

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-300";
      case "CONFIRMED":
      case "SHIPPING":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "NEGOTIATING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "FAILED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  // Calculate total submitted amount from all transactions
  const calculateTotalSubmitted = () => {
    if (!order.paymentTransactions || order.paymentTransactions.length === 0)
      return 0;
    return order.paymentTransactions.reduce(
      (total, payment) => total + (payment.amount || 0),
      0
    );
  };

  // Calculate total confirmed amount from completed transactions only
  const calculateTotalConfirmed = () => {
    if (!order.paymentTransactions || order.paymentTransactions.length === 0)
      return 0;
    return order.paymentTransactions
      .filter((payment) => payment.status === "COMPLETED")
      .reduce((total, payment) => total + (payment.amount || 0), 0);
  };

  // Calculate pending amount
  const calculatePendingAmount = () => {
    if (!order.paymentTransactions || order.paymentTransactions.length === 0)
      return 0;
    return order.paymentTransactions
      .filter((payment) => payment.status === "PENDING")
      .reduce((total, payment) => total + (payment.amount || 0), 0);
  };

  // Calculate remaining balance based on submitted payments
  const calculateRemainingBalance = () => {
    const orderTotal =
      order.finalPrice || order.negotiatedPrice || order.totalOriginalPrice;
    const totalSubmitted = calculateTotalSubmitted();
    return Math.max(0, orderTotal - totalSubmitted);
  };

  const copyOrderId = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      Swal.fire({
        icon: "success",
        title: "Copied!",
        text: `Order ID ${id} copied to clipboard.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Validate file before setting
  const validateFile = useCallback((file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid File Type",
        text: "Please select an image (JPG, PNG, GIF, WebP) or PDF file.",
        confirmButtonColor: "#3085d6",
      });
      return false;
    }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: `File size is ${formatFileSize(
          file.size
        )}. Please select a file smaller than ${formatFileSize(maxSize)}.`,
        confirmButtonColor: "#3085d6",
      });
      return false;
    }
    if (file.size === 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "The selected file appears to be empty or corrupted.",
        confirmButtonColor: "#3085d6",
      });
      return false;
    }
    return true;
  }, []);

  // Handle file selection with comprehensive validation
  const handleFileSelect = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (!file) return;
      if (!validateFile(file)) {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target.result);
        };
        reader.onerror = () => {
          Swal.fire({
            icon: "error",
            title: "Preview Error",
            text: "Could not generate preview for this image.",
            confirmButtonColor: "#3085d6",
          });
          setPreviewUrl(null);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    },
    [validateFile]
  );

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (validateFile(file)) {
          setSelectedFile(file);
          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => setPreviewUrl(e.target.result);
            reader.readAsDataURL(file);
          } else {
            setPreviewUrl(null);
          }
        }
      }
    },
    [validateFile]
  );

  // Upload payment screenshot with progress tracking
  const handlePaymentUpload = async () => {
    if (!selectedFile) {
      Swal.fire({
        icon: "warning",
        title: "No File Selected",
        text: "Please select a payment screenshot to upload.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
    if (!validateFile(selectedFile)) {
      clearSelectedFile();
      return;
    }

    try {
      setUploadingPayment(true);
      setUploadProgress(0);
      const formData = new FormData();
      formData.append("paymentScreenshot", selectedFile);
      formData.append("orderId", order.id);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await uploadPaymentMutation.mutateAsync({
        orderId: order.id,
        paymentData: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      await Swal.fire({
        icon: "success",
        title: "Payment Uploaded Successfully!",
        text: "Your payment screenshot has been uploaded and is being reviewed.",
        timer: 2500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      clearSelectedFile();
    } catch (error) {
      console.error("Payment upload error:", error);
      let errorMessage =
        "Failed to upload payment screenshot. Please try again.";
      if (
        error.message?.includes("network") ||
        error.message?.includes("fetch")
      ) {
        errorMessage =
          "Network error. Please check your internet connection and try again.";
      } else if (error.message?.includes("size")) {
        errorMessage =
          "File size is too large. Please compress your image and try again.";
      } else if (error.message?.includes("type")) {
        errorMessage = "Invalid file type. Please upload an image or PDF file.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: errorMessage,
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setUploadingPayment(false);
      setUploadProgress(0);
    }
  };

  // Clear selected file
  const clearSelectedFile = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // View uploaded payment screenshot
  const viewPaymentScreenshot = () => {
    if (order.paymentScreenshot) {
      Swal.fire({
        title: "Payment Screenshot",
        imageUrl: order.paymentScreenshot,
        imageWidth: 400,
        imageHeight: 300,
        imageAlt: "Payment Screenshot",
        showCloseButton: true,
        showConfirmButton: false,
        width: 500,
      });
    }
  };

  // View payment details
  const viewPaymentDetails = (payment) => {
    setSelectedPayment(payment);
  };

  // Validate payment form
  const validatePaymentForm = () => {
    const newErrors = {};
    if (!paymentData.amount || Number.parseFloat(paymentData.amount) <= 0) {
      newErrors.amount = "Please enter a valid payment amount";
    }
    if (!paymentData.paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    }
    if (!paymentData.transactionRef?.trim()) {
      newErrors.transactionRef = "Please enter a transaction reference";
    }
    // Check if order has finalPrice set
    const orderFinalPrice =
      order.finalPrice || order.negotiatedPrice || order.totalOriginalPrice;
    if (!orderFinalPrice) {
      newErrors.general =
        "This order needs to have a final price set before payments can be added. Please contact support.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle payment form submission using React Query
  const handlePaymentSubmit = async () => {
    if (!validatePaymentForm()) {
      return;
    }

    const orderFinalPrice =
      order.finalPrice || order.negotiatedPrice || order.totalOriginalPrice;

    try {
      await addPaymentMutation.mutateAsync({
        orderId: order.id,
        paymentData: {
          amount: Number.parseFloat(paymentData.amount),
          paymentMethod: paymentData.paymentMethod,
          transactionRef: paymentData.transactionRef.trim(),
          orderFinalPrice: orderFinalPrice,
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Payment Submitted!",
        text: "Your payment has been submitted successfully and is being reviewed.",
        timer: 2500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      // Reset form
      setPaymentData({
        amount: "",
        paymentMethod: "",
        transactionRef: "",
      });
      setErrors({});
      setShowPaymentForm(false);
    } catch (error) {
      console.error("Payment submission error:", error);
      let errorMessage = "Failed to submit payment. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message?.includes("final price")) {
        errorMessage =
          "Order final price must be set before adding payments. Please contact support.";
      }

      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: errorMessage,
        confirmButtonColor: "#3085d6",
      });
    }
  };

  // Check if payment upload should be shown
  const showPaymentUpload = ["NEGOTIATING", "CONFIRMED"].includes(order.status);
  const hasPaymentScreenshot = order.paymentScreenshot || order.paymentReceipt;
  const totalSubmitted = calculateTotalSubmitted();
  const totalConfirmed = calculateTotalConfirmed();
  const pendingAmount = calculatePendingAmount();
  const remainingBalance = calculateRemainingBalance();
  const orderTotal =
    order.finalPrice || order.negotiatedPrice || order.totalOriginalPrice;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-0 hover:shadow-xl transition-shadow p-6">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3
                className="text-xl font-bold text-blue-600 cursor-pointer hover:underline"
                onClick={() => copyOrderId(order.id)}
                title="Click to copy full Order ID"
              >
                Order #{order.id.slice(0, 8)}...
              </h3>
              <p className="text-gray-600">
                {order.orderItems?.length || 0} item(s)
              </p>
            </div>
          </div>

          {/* Order Items */}
          {order.orderItems && order.orderItems.length > 0 && (
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    src={
                      item.car.mainImage ||
                      "/placeholder.svg?height=48&width=64" ||
                      "/placeholder.svg"
                    }
                    alt={item.car.title}
                    className="w-16 h-12 object-cover rounded-md"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=48&width=64";
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {item.car.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Year: {item.car.year}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatPrice(item.negotiatedPrice || item.originalPrice)}
                    </p>
                    {item.negotiatedPrice &&
                      item.negotiatedPrice !== item.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatPrice(item.originalPrice)}
                        </p>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Order Date:</span>
              <span className="font-semibold">
                {formatDate(order.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold text-green-600">
                {formatPrice(orderTotal)}
              </span>
            </div>
            {order.estimatedDelivery && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Est. Delivery:</span>
                <span className="font-semibold">
                  {formatDate(order.estimatedDelivery)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Payment Status:</span>
              <span
                className={`font-semibold ${
                  order.paymentStatus === "COMPLETED"
                    ? "text-green-600"
                    : order.paymentStatus === "PENDING"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {formatStatus(order.paymentStatus)}
              </span>
            </div>
          </div>

          {/* Enhanced Payment Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Order Total:</span>
                <p className="font-bold text-blue-900">
                  {formatPrice(orderTotal)}
                </p>
              </div>
              <div>
                <span className="text-purple-600">Total Submitted:</span>
                <p className="font-bold text-purple-700">
                  {formatPrice(totalSubmitted)}
                </p>
                <p className="text-xs text-purple-600">All payments</p>
              </div>
              <div>
                <span className="text-green-600">Confirmed:</span>
                <p className="font-bold text-green-700">
                  {formatPrice(totalConfirmed)}
                </p>
                <p className="text-xs text-green-600">Approved only</p>
              </div>
              <div>
                <span className="text-orange-600">Remaining:</span>
                <p className="font-bold text-orange-700">
                  {formatPrice(remainingBalance)}
                </p>
                <p className="text-xs text-orange-600">Still needed</p>
              </div>
            </div>

            {/* Status Messages */}
            {pendingAmount > 0 && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                ⏳ You have {formatPrice(pendingAmount)} in pending payments
                being reviewed.
              </div>
            )}

            {totalSubmitted >= orderTotal && totalConfirmed < orderTotal && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                🎉 You've submitted full payment! Waiting for admin approval.
              </div>
            )}

            {totalConfirmed >= orderTotal && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                ✅ Payment complete! Your order is fully paid.
              </div>
            )}

            {remainingBalance > 0 && (
              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                💡 You still need to submit {formatPrice(remainingBalance)} to
                complete this order.
              </div>
            )}
          </div>

          {/* Payment Transactions */}
          {order.paymentTransactions &&
            order.paymentTransactions.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-purple-800 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Transactions ({order.paymentTransactions.length})
                  </h4>
                  <button
                    onClick={() => setShowPaymentHistory(!showPaymentHistory)}
                    className="text-sm text-purple-600 hover:text-purple-800 underline"
                  >
                    {showPaymentHistory ? "Hide" : "View All"}
                  </button>
                </div>

                {showPaymentHistory ? (
                  <div className="space-y-3">
                    {order.paymentTransactions.map((payment) => (
                      <div
                        key={payment.id}
                        className="bg-white p-4 rounded-lg border border-purple-100 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-lg font-bold text-purple-900">
                                {formatPrice(payment.amount)}
                              </span>
                              <div
                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                                  payment.status
                                )}`}
                              >
                                {getPaymentStatusIcon(payment.status)}
                                {formatStatus(payment.status)}
                              </div>
                            </div>
                            <div className="text-xs text-purple-600 space-y-1">
                              <p>
                                <strong>Transaction ID:</strong> {payment.id}
                              </p>
                              <p>
                                <strong>Date:</strong>{" "}
                                {formatDate(payment.createdAt)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => viewPaymentDetails(payment)}
                            className="text-purple-600 hover:text-purple-800 p-1 hover:bg-purple-100 rounded transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>

                        {payment.status === "PENDING" && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                            ⏳ This payment is being reviewed by our team.
                            You'll be notified once it's processed.
                          </div>
                        )}

                        {payment.status === "COMPLETED" && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                            ✅ Payment confirmed and processed successfully.
                          </div>
                        )}

                        {payment.status === "FAILED" && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                            ❌ Payment failed. Please contact support or try
                            again.
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-purple-700">
                    <div className="flex items-center justify-between">
                      <span>
                        {order.paymentTransactions.length} payment(s) submitted
                      </span>
                      <span className="font-semibold">
                        Total:{" "}
                        {formatPrice(
                          order.paymentTransactions.reduce(
                            (sum, p) => sum + p.amount,
                            0
                          )
                        )}
                      </span>
                    </div>
                    <div className="mt-1 text-xs">
                      Completed:{" "}
                      {
                        order.paymentTransactions.filter(
                          (p) => p.status === "COMPLETED"
                        ).length
                      }{" "}
                      • Pending:{" "}
                      {
                        order.paymentTransactions.filter(
                          (p) => p.status === "PENDING"
                        ).length
                      }{" "}
                      • Failed:{" "}
                      {
                        order.paymentTransactions.filter(
                          (p) => p.status === "FAILED"
                        ).length
                      }
                    </div>
                  </div>
                )}
              </div>
            )}

          {order.trackingInfo && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-800">
                Tracking Information:
              </p>
              <p className="text-sm text-blue-700">{order.trackingInfo}</p>
            </div>
          )}

          {order.notes && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-semibold text-yellow-800">Notes:</p>
              <p className="text-sm text-yellow-700">{order.notes}</p>
            </div>
          )}

          {/* Payment Screenshot Status */}
          {hasPaymentScreenshot && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-semibold text-green-800">
                    Payment screenshot uploaded
                  </p>
                </div>
                {order.paymentScreenshot && (
                  <button
                    onClick={viewPaymentScreenshot}
                    className="flex items-center gap-1 text-sm text-green-600 hover:text-green-800 hover:underline transition"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-3 min-w-[250px]">
          <div
            className={`${getStatusColor(
              order.status
            )} border px-3 py-1 rounded-full text-sm font-medium`}
          >
            {formatStatus(order.status)}
          </div>
          <a
            href={`https://wa.me/8801711123456?text=${encodeURIComponent(
              `Hello, I have a question about Order ID: ${order.id}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-sm font-medium px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Chat on WhatsApp
          </a>

          {/* Payment Form Button */}
          {showPaymentUpload && (
            <button
              onClick={() => setShowPaymentForm(!showPaymentForm)}
              className="inline-flex items-center justify-center text-sm font-medium px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Payment
            </button>
          )}

          {/* Payment Form */}
          {showPaymentForm && (
            <div className="w-full p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="text-sm font-semibold text-purple-800 mb-3">
                Add Payment Details
              </h4>
              {errors.general && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                  {errors.general}
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-purple-700 mb-1">
                    Amount (USD) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2 h-4 w-4 text-purple-500" />
                    <input
                      type="number"
                      step="0.01"
                      value={paymentData.amount}
                      onChange={(e) => {
                        setPaymentData({
                          ...paymentData,
                          amount: e.target.value,
                        });
                        if (errors.amount) {
                          setErrors({ ...errors, amount: null });
                        }
                      }}
                      className={`w-full pl-8 pr-3 py-2 text-sm border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.amount ? "border-red-300" : "border-purple-300"
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-xs text-red-600 mt-1">{errors.amount}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-700 mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={paymentData.paymentMethod}
                    onChange={(e) => {
                      setPaymentData({
                        ...paymentData,
                        paymentMethod: e.target.value,
                      });
                      if (errors.paymentMethod) {
                        setErrors({ ...errors, paymentMethod: null });
                      }
                    }}
                    className={`w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.paymentMethod
                        ? "border-red-300"
                        : "border-purple-300"
                    }`}
                  >
                    <option value="">Select Method</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="cash">Cash</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.paymentMethod && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.paymentMethod}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-700 mb-1">
                    Transaction Reference *
                  </label>
                  <input
                    type="text"
                    value={paymentData.transactionRef}
                    onChange={(e) => {
                      setPaymentData({
                        ...paymentData,
                        transactionRef: e.target.value,
                      });
                      if (errors.transactionRef) {
                        setErrors({ ...errors, transactionRef: null });
                      }
                    }}
                    className={`w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.transactionRef
                        ? "border-red-300"
                        : "border-purple-300"
                    }`}
                    placeholder="Transaction ID/Reference"
                  />
                  {errors.transactionRef && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.transactionRef}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={addPaymentMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {addPaymentMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Submit</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowPaymentForm(false);
                      setErrors({});
                      setPaymentData({
                        amount: "",
                        paymentMethod: "",
                        transactionRef: "",
                      });
                    }}
                    disabled={addPaymentMutation.isPending}
                    className="px-3 py-2 border border-purple-300 text-purple-700 rounded text-sm font-medium hover:bg-purple-50 disabled:opacity-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Payment Screenshot Upload Section */}
          {showPaymentUpload && !hasPaymentScreenshot && (
            <div className="flex flex-col gap-2 w-full">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <p className="text-sm font-semibold text-amber-800">
                    Upload Payment Screenshot
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  id={`payment-upload-${order.id}`}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {!selectedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-amber-300 rounded-lg p-4 text-center hover:border-amber-400 hover:bg-amber-100 transition cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-sm text-amber-700 mb-1">
                      Click to select or drag & drop
                    </p>
                    <p className="text-xs text-amber-600">
                      Images (JPG, PNG, GIF, WebP) or PDF • Max 10MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* File Info */}
                    <div className="flex items-center justify-between p-3 bg-white border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-amber-700 truncate font-medium">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-amber-600">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={clearSelectedFile}
                        className="text-amber-600 hover:text-amber-800 p-1 hover:bg-amber-100 rounded transition"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Image Preview */}
                    {previewUrl && (
                      <div className="relative">
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Payment preview"
                          className="w-full h-40 object-contain bg-gray-50 rounded-lg border"
                        />
                      </div>
                    )}
                    {/* Upload Progress */}
                    {uploadingPayment && uploadProgress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-amber-700">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-amber-200 rounded-full h-2">
                          <div
                            className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={handlePaymentUpload}
                        disabled={uploadingPayment}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
                      >
                        {uploadingPayment ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Upload Payment</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPayment}
                        className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 disabled:opacity-50 transition text-sm font-medium"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}
                {/* Help Text */}
                <div className="mt-3 p-2 bg-amber-100 border border-amber-200 rounded text-xs text-amber-700">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Upload Tips:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>Ensure the payment details are clearly visible</li>
                        <li>Include transaction ID, amount, and date</li>
                        <li>Use good lighting for clear images</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Transaction Details
              </h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Transaction ID
                </label>
                <p className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded">
                  {selectedPayment.id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Amount
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {formatPrice(selectedPayment.amount)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
                    selectedPayment.status
                  )}`}
                >
                  {getPaymentStatusIcon(selectedPayment.status)}
                  {formatStatus(selectedPayment.status)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Date Created
                </label>
                <p className="text-gray-900">
                  {formatDate(selectedPayment.createdAt)}
                </p>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
