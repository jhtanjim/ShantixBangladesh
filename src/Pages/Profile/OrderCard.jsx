import {
  AlertCircle,
  Calendar,
  CheckCircle,
  CreditCard,
  Eye,
  FileText,
  MapPin,
  Package,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import Swal from "sweetalert2";

const OrderCard = ({ order, handleFileUpload, uploadPaymentMutation }) => {
  const [uploadingPayment, setUploadingPayment] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-300";
      case "CONFIRMED":
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "NEGOTIATING":
      case "PENDING_PAYMENT":
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
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
    // Check file type
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

    // Check file size (max 10MB)
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

    // Check if file is corrupted (basic check)
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
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);

    // Create preview for images
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

        // Create preview for images
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

    // Double-check file validity before upload
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

      // Simulate progress for better UX
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

      // Try different upload methods
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

      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Show success message
      await Swal.fire({
        icon: "success",
        title: "Payment Uploaded Successfully!",
        text: "Your payment screenshot has been uploaded and is being reviewed.",
        timer: 2500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      // Reset state
      clearSelectedFile();
    } catch (error) {
      console.error("Payment upload error:", error);

      let errorMessage =
        "Failed to upload payment screenshot. Please try again.";

      // Handle specific error types
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

  // Check if payment upload should be shown
  const showPaymentUpload = ["PENDING_PAYMENT", "NEGOTIATING"].includes(
    order.status
  );
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
                    src={item.car.mainImage}
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
                          src={previewUrl}
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
