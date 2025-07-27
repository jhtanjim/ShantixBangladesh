"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle,
  CreditCard,
  DollarSign,
  Eye,
  FileText,
  MapPin,
  Package,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { useAddPaymentToOrder } from "../../hooks/useOrders";

const OrderCard = ({ order, handleFileUpload, uploadPaymentMutation }) => {
  const [uploadingPayment, setUploadingPayment] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentMethod: "",
    transactionRef: "",
  });
  const fileInputRef = useRef(null);

  // Use the existing React Query hook
  const addPaymentMutation = useAddPaymentToOrder();

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

  const copyOrderId = (id) => {
    navigator.clipboard.writeText(id);
    Swal.fire({
      icon: "success",
      title: "Copied!",
      text: `Order ID ${id} copied to clipboard.`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Validate file before setting
  const validateFile = (file) => {
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
  };

  // Handle file selection with comprehensive validation
  const handleFileSelect = (event) => {
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
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
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
  };

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

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      let uploadResult;
      if (handleFileUpload) {
        uploadResult = await handleFileUpload(order.id, selectedFile);
      } else if (uploadPaymentMutation) {
        uploadResult = await uploadPaymentMutation.mutateAsync({
          id: order.id,
          paymentData: formData,
        });
      } else {
        throw new Error("No upload method provided. Please contact support.");
      }

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
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        errorMessage =
          "Network error. Please check your internet connection and try again.";
      } else if (error.message.includes("size")) {
        errorMessage =
          "File size is too large. Please compress your image and try again.";
      } else if (error.message.includes("type")) {
        errorMessage = "Invalid file type. Please upload an image or PDF file.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: errorMessage,
        confirmButtonColor: "#3085d6",
        footer: error.message.includes("No upload method")
          ? '<a href="mailto:support@example.com">Contact Support</a>'
          : null,
      });
    } finally {
      setUploadingPayment(false);
      setUploadProgress(0);
    }
  };

  // Clear selected file
  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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

  // Handle payment form submission using React Query
  const handlePaymentSubmit = async () => {
    if (
      !paymentData.amount ||
      !paymentData.paymentMethod ||
      !paymentData.transactionRef
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all payment details.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (Number.parseFloat(paymentData.amount) <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Amount",
        text: "Please enter a valid payment amount.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // Check if order has finalPrice set
    const orderFinalPrice =
      order.finalPrice || order.negotiatedPrice || order.totalOriginalPrice;
    if (!orderFinalPrice) {
      Swal.fire({
        icon: "error",
        title: "Order Not Ready",
        text: "This order needs to have a final price set before payments can be added. Please contact support.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      // Use the React Query mutation with proper payload structure
      await addPaymentMutation.mutateAsync({
        orderId: order.id,
        paymentData: {
          amount: Number.parseFloat(paymentData.amount),
          paymentMethod: paymentData.paymentMethod,
          transactionRef: paymentData.transactionRef,
          orderFinalPrice: orderFinalPrice, // Include the final price in the payload
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

  // Check if payment upload should be shown - use NEGOTIATING and CONFIRMED instead
  const showPaymentUpload = ["NEGOTIATING", "CONFIRMED"].includes(order.status);
  const hasPaymentScreenshot = order.paymentScreenshot || order.paymentReceipt;

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

          {order.user && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-800">
                Customer Information:
              </p>
              <p className="text-sm text-blue-700">
                {order.user.firstName} {order.user.lastName} ({order.user.email}
                )
              </p>
              {order.user.phone && (
                <p className="text-sm text-blue-700">
                  Phone: {order.user.phone}
                </p>
              )}
            </div>
          )}

          {order.orderItems && order.orderItems.length > 0 && (
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.car.mainImage || "/placeholder.svg"}
                    alt={item.car.title}
                    className="w-16 h-12 object-cover rounded-md"
                    onError={(e) => {
                      e.target.style.display = "none";
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm pt-2">
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
                {formatPrice(
                  order.finalPrice ||
                    order.negotiatedPrice ||
                    order.totalOriginalPrice
                )}
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
          </div>

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

          {order.whatsappMessageSent && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-800">
                WhatsApp message sent to customer
              </p>
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

          {/* Display Payments */}
          {order.payments && order.payments.length > 0 && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm font-semibold text-purple-800 mb-2">
                Payment History:
              </p>
              {order.payments.map((payment) => (
                <div key={payment.id} className="text-sm text-purple-700 mb-1">
                  <div className="flex justify-between items-center">
                    <span>
                      {formatPrice(payment.amount)} via {payment.paymentMethod}
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
                  </div>
                  <div className="text-xs text-purple-600">
                    Ref: {payment.transactionRef} |{" "}
                    {formatDate(payment.createdAt)}
                  </div>
                  {payment.rejectionReason && (
                    <div className="text-xs text-red-600 mt-1">
                      Reason: {payment.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
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
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          amount: e.target.value,
                        })
                      }
                      className="w-full pl-8 pr-3 py-2 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-700 mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={paymentData.paymentMethod}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Method</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="cash">Cash</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-700 mb-1">
                    Transaction Reference *
                  </label>
                  <input
                    type="text"
                    value={paymentData.transactionRef}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        transactionRef: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Transaction ID/Reference"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={addPaymentMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {addPaymentMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                    onClick={() => setShowPaymentForm(false)}
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
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
    </div>
  );
};

export default OrderCard;
