// components/ShipSchedule/ShipScheduleForm.jsx
import {
  AlertCircle,
  Calendar,
  ImageIcon,
  Info,
  Loader,
  Save,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

const ShipScheduleForm = ({
  title,
  initialData = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitText = "Save",
}) => {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    image: initialData.image || "",
    pdf: initialData.pdf || "",
    description: initialData.description || "",
    isActive: initialData.isActive !== undefined ? initialData.isActive : true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [dragOver, setDragOver] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [compressionInfo, setCompressionInfo] = useState(null);
  const [fileType, setFileType] = useState(null);

  const fileInputRef = useRef(null);

  // Initialize preview and file type based on initial data
  useEffect(() => {
    if (initialData.pdf) {
      setImagePreview(initialData.pdf);
      setFileType("application/pdf");
    } else if (initialData.image) {
      setImagePreview(initialData.image);
      setFileType("image");
    }
  }, [initialData.pdf, initialData.image]);

  // Optimized image compression with progressive quality and size limits
  const compressImage = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const originalSize = file.size;

      // Skip compression for small files (< 500KB)
      if (originalSize < 500 * 1024) {
        setCompressionInfo({
          originalSize: (originalSize / 1024 / 1024).toFixed(2),
          compressedSize: (originalSize / 1024 / 1024).toFixed(2),
          compressionRatio: "0",
        });
        resolve(file);
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Progressive sizing based on file size
        let maxWidth, maxHeight, quality;

        if (originalSize > 5 * 1024 * 1024) {
          // > 5MB
          maxWidth = 800;
          maxHeight = 600;
          quality = 0.7;
        } else if (originalSize > 2 * 1024 * 1024) {
          // > 2MB
          maxWidth = 1000;
          maxHeight = 750;
          quality = 0.75;
        } else {
          maxWidth = 1200;
          maxHeight = 800;
          quality = 0.8;
        }

        // Calculate new dimensions maintaining aspect ratio
        const aspectRatio = width / height;

        if (width > maxWidth || height > maxHeight) {
          if (aspectRatio > 1) {
            width = Math.min(width, maxWidth);
            height = width / aspectRatio;
          } else {
            height = Math.min(height, maxHeight);
            width = height * aspectRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Optimize canvas rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Use requestAnimationFrame for smooth processing
        requestAnimationFrame(() => {
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressionRatio = (
                  ((originalSize - blob.size) / originalSize) *
                  100
                ).toFixed(1);

                setCompressionInfo({
                  originalSize: (originalSize / 1024 / 1024).toFixed(2),
                  compressedSize: (blob.size / 1024 / 1024).toFixed(2),
                  compressionRatio,
                });
                resolve(blob);
              } else {
                reject(new Error("Image compression failed"));
              }
            },
            "image/jpeg",
            quality
          );
        });
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Optimized file handling with immediate preview
  const handleFileSelect = useCallback(
    async (file) => {
      if (!file) return;

      const maxSize = 15 * 1024 * 1024; // 15MB
      if (file.size > maxSize) {
        Swal.fire({
          title: "File Too Large",
          text: "Please select a file smaller than 15MB.",
          icon: "error",
          confirmButtonColor: "#3b82f6",
        });
        return;
      }

      setImageUploading(true);
      setUploadProgress(10);

      try {
        const fileType = file.type;
        setFileType(fileType);

        if (fileType === "application/pdf") {
          // Handle PDF files
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl);
          setImageFile(file);
          setUploadProgress(100);
          setFormData((prev) => ({ ...prev, image: "", pdf: "" }));
        } else {
          // Handle image files with immediate preview
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl);
          setUploadProgress(50);

          // Compress in background (non-blocking)
          setTimeout(async () => {
            try {
              const compressedFile = await compressImage(file);
              setImageFile(compressedFile);
              setUploadProgress(100);
              setFormData((prev) => ({ ...prev, image: "", pdf: "" }));
            } catch (error) {
              console.error("Compression failed:", error);
              // Fallback to original file
              setImageFile(file);
              setUploadProgress(100);
            }
          }, 100);
        }
      } catch (error) {
        console.error("File processing error:", error);
        Swal.fire({
          title: "Upload Error",
          text: "Failed to process the selected file. Please try again.",
          icon: "error",
          confirmButtonColor: "#3b82f6",
        });
      } finally {
        setTimeout(() => {
          setImageUploading(false);
          setUploadProgress(0);
        }, 500);
      }
    },
    [compressImage]
  );

  // Form validation with enhanced checks
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters long";
    } else if (formData.title.trim().length > 100) {
      errors.title = "Title must be less than 100 characters";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters long";
    } else if (formData.description.trim().length > 1000) {
      errors.description = "Description must be less than 1000 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please fix the form errors before submitting.",
        icon: "error",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    try {
      // Create FormData object to send both text data and file
      const submitFormData = new FormData();

      // Add text fields
      submitFormData.append("title", formData.title.trim());
      submitFormData.append("description", formData.description.trim());
      submitFormData.append("isActive", formData.isActive);

      // Handle file upload based on type
      if (imageFile) {
        if (fileType === "application/pdf") {
          submitFormData.append("pdf", imageFile);
        } else {
          // Image file is already processed/compressed
          submitFormData.append("image", imageFile, "schedule-image.jpg");
        }
      } else if (formData.image && formData.image !== initialData.image) {
        // If it's a new image URL, send it as text to image field
        submitFormData.append("imageUrl", formData.image);
      }

      // Pass FormData to parent component
      await onSubmit(submitFormData);
    } catch (error) {
      console.error("Form submission error:", error);
      // Error handling is done in parent components
    }
  };

  const handleCancel = () => {
    const hasChanges =
      formData.title !== (initialData.title || "") ||
      formData.description !== (initialData.description || "") ||
      formData.image !== (initialData.image || "") ||
      formData.isActive !==
        (initialData.isActive !== undefined ? initialData.isActive : true) ||
      imageFile !== null;

    if (hasChanges) {
      Swal.fire({
        title: "Are you sure?",
        text: "Any unsaved changes will be lost.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, cancel",
        cancelButtonText: "Continue editing",
      }).then((result) => {
        if (result.isConfirmed) {
          onCancel?.();
        }
      });
    } else {
      onCancel?.();
    }
  };

  const removeImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview("");
    setImageFile(null);
    setFileType(null);
    setCompressionInfo(null);
    setFormData({ ...formData, image: "", pdf: "" });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
            </div>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Schedule Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                formErrors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter schedule title (e.g., Dhaka to Chittagong)"
              maxLength={100}
            />
            {formErrors.title && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {formErrors.title}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* File Upload (Image or PDF) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Schedule Image / PDF
            </label>
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer relative
        ${
          dragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                />

                {/* Upload Progress */}
                {imageUploading && (
                  <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded-xl z-10">
                    <div className="text-center w-full px-8">
                      <Loader
                        className="animate-spin text-blue-600 mx-auto mb-3"
                        size={32}
                      />
                      <p className="text-blue-600 font-medium mb-2">
                        Processing file...
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {uploadProgress}%
                      </p>
                    </div>
                  </div>
                )}

                {/* PDF Preview */}
                {imagePreview && fileType === "application/pdf" ? (
                  <div className="relative">
                    <embed
                      src={imagePreview}
                      type="application/pdf"
                      className="w-full h-64 mx-auto rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : imagePreview ? (
                  // Image Preview
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg shadow-md"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling.style.display =
                          "block";
                      }}
                    />
                    <div className="hidden text-gray-400">
                      <ImageIcon size={48} className="mx-auto mb-2" />
                      <p>Image failed to load</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  // Placeholder
                  <div className="py-4">
                    <Upload className="mx-auto text-gray-400 mb-2" size={48} />
                    <p className="text-gray-600 font-medium">
                      Drop image or PDF here or click to upload
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      JPEG, PNG, GIF, WebP, or PDF up to 15MB
                    </p>
                  </div>
                )}
              </div>

              {/* Compression Info */}
              {compressionInfo && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-800">
                    <Info size={16} />
                    <span className="font-medium">
                      {compressionInfo.compressionRatio === "0"
                        ? "File Ready"
                        : "Image Optimized"}
                    </span>
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    {compressionInfo.compressionRatio === "0"
                      ? `Size: ${compressionInfo.originalSize}MB (No compression needed)`
                      : `Original: ${compressionInfo.originalSize}MB → Compressed: ${compressionInfo.compressedSize}MB (${compressionInfo.compressionRatio}% reduction)`}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    or enter image URL
                  </span>
                </div>
              </div>

              {/* URL Input */}
              <input
                type="url"
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  if (e.target.value) {
                    setImagePreview(e.target.value);
                    setImageFile(null);
                    setFileType("image");
                    setCompressionInfo(null);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                formErrors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter detailed description of the schedule including departure times, routes, and important information..."
              maxLength={1000}
            />
            {formErrors.description && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {formErrors.description}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {formData.description.length}/1000 characters
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={formData.isActive}
                  onChange={() => setFormData({ ...formData, isActive: true })}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-green-600 font-medium">Active</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={!formData.isActive}
                  onChange={() => setFormData({ ...formData, isActive: false })}
                  className="text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-red-600 font-medium">Inactive</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || imageUploading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShipScheduleForm;
