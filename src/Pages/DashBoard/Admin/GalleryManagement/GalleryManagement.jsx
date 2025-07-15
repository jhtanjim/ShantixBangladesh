import {
  AlertCircle,
  Camera,
  Edit,
  Eye,
  EyeOff,
  Grid,
  List,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { useGallery } from "../../../../hooks/useGallery";

const GalleryManagement = () => {
  const {
    useGetAllGallery,
    useCreateGalleryItem,
    useUpdateGalleryItem,
    useDeleteGalleryItem,
    useSoftDeleteGalleryItem,
    useBulkUploadGallery,
  } = useGallery();

  const { data: galleryItems = [], isLoading, error } = useGetAllGallery();
  const createMutation = useCreateGalleryItem();
  const updateMutation = useUpdateGalleryItem();
  const deleteMutation = useDeleteGalleryItem();
  const softDeleteMutation = useSoftDeleteGalleryItem();
  const bulkUploadMutation = useBulkUploadGallery();

  // State management
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("order");
  const [formData, setFormData] = useState({
    image: "",
    description: "",
    order: "",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);

  // Enhanced image compression function with better quality control
  const compressImage = async (
    file,
    maxWidth = 1200,
    maxHeight = 1200,
    initialQuality = 0.8,
    maxFileSize = 2 * 1024 * 1024 // 2MB target
  ) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = async () => {
        try {
          // Calculate new dimensions while maintaining aspect ratio
          let { width, height } = img;
          const scale = Math.min(maxWidth / width, maxHeight / height, 1);

          width = Math.floor(width * scale);
          height = Math.floor(height * scale);

          canvas.width = width;
          canvas.height = height;

          // Use better image rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // Progressive compression - reduce quality until file size is acceptable
          let quality = initialQuality;
          let compressedBlob;
          let attempts = 0;
          const maxAttempts = 10;

          do {
            compressedBlob = await new Promise((resolve) => {
              canvas.toBlob(resolve, "image/jpeg", quality);
            });

            console.log(
              `Compression attempt ${attempts + 1}: ${quality.toFixed(
                2
              )} quality, ${(compressedBlob.size / 1024 / 1024).toFixed(2)}MB`
            );

            // If file size is acceptable or we've tried enough times, stop
            if (compressedBlob.size <= maxFileSize || attempts >= maxAttempts) {
              break;
            }

            // Reduce quality for next attempt
            quality -= 0.1;
            attempts++;
          } while (quality > 0.1);

          // If still too large, try reducing dimensions
          if (compressedBlob.size > maxFileSize && quality <= 0.1) {
            console.log("File still too large, reducing dimensions...");

            // Reduce dimensions by 80%
            const newWidth = Math.floor(width * 0.8);
            const newHeight = Math.floor(height * 0.8);

            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            compressedBlob = await new Promise((resolve) => {
              canvas.toBlob(resolve, "image/jpeg", 0.7);
            });
          }

          if (compressedBlob) {
            resolve(compressedBlob);
          } else {
            reject(new Error("Failed to compress image"));
          }
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Handle file selection and compression for both add and edit
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        title: "Invalid File!",
        text: "Please select a valid image file.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    // Validate file size (50MB limit for initial upload)
    if (file.size > 50 * 1024 * 1024) {
      Swal.fire({
        title: "File Too Large!",
        text: "Please select an image smaller than 50MB.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    setIsCompressing(true);

    try {
      // Show compression progress
      const originalSize = (file.size / 1024 / 1024).toFixed(2);

      // Compress the image
      const compressedFile = await compressImage(file, 1200, 1200, 0.85);

      // Show compression results
      const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);

      console.log(
        `Image compressed from ${originalSize}MB to ${compressedSize}MB`
      );

      // Create preview
      const previewUrl = URL.createObjectURL(compressedFile);
      setImagePreview(previewUrl);
      setImageFile(compressedFile);

      // Convert to base64 for form data
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, image: event.target.result });
      };
      reader.readAsDataURL(compressedFile);

      // Show success message with compression info
      Swal.fire({
        title: "Image Compressed Successfully!",
        text: `Size reduced from ${originalSize}MB to ${compressedSize}MB`,
        icon: "success",
        confirmButtonColor: "#3b82f6",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Compression error:", error);
      Swal.fire({
        title: "Compression Failed!",
        text: "Failed to process the image. Please try again with a different image.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsCompressing(false);
    }
  };

  // Handle bulk upload with compression
  // Handle bulk upload with compression - FIXED VERSION
  // Handle bulk upload with compression and SweetAlert - FIXED VERSION
  const handleBulkUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Validate files and show individual error messages
    const validFiles = [];
    const invalidFiles = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        invalidFiles.push({ file, reason: "Not an image file" });
        continue;
      }
      if (file.size > 50 * 1024 * 1024) {
        // 50MB limit before compression
        invalidFiles.push({ file, reason: "File too large (>50MB)" });
        continue;
      }
      validFiles.push(file);
    }

    // Show validation results
    if (invalidFiles.length > 0) {
      const invalidList = invalidFiles
        .map(({ file, reason }) => `• ${file.name}: ${reason}`)
        .join("\n");

      await Swal.fire({
        title: "Some Files Skipped",
        text: `${invalidFiles.length} file(s) were skipped:\n\n${invalidList}`,
        icon: "warning",
        confirmButtonColor: "#f59e0b",
      });
    }

    if (validFiles.length === 0) {
      Swal.fire({
        title: "No Valid Images!",
        text: "Please select valid image files.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      // Show compression progress
      Swal.fire({
        title: "Processing Images...",
        text: `Compressing and uploading ${validFiles.length} image(s)`,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Compress all images
      const compressedFiles = await Promise.all(
        validFiles.map(async (file, index) => {
          try {
            // Update progress text
            Swal.update({
              text: `Compressing image ${index + 1} of ${validFiles.length}...`,
            });

            const compressedFile = await compressImage(file, 1200, 1200, 0.85);

            // Create a new File object with the original name
            return new File([compressedFile], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
          } catch (error) {
            console.error(`Failed to compress ${file.name}:`, error);
            return null; // Skip failed files
          }
        })
      );

      // Filter out failed compressions
      const successfulFiles = compressedFiles.filter((file) => file !== null);

      if (successfulFiles.length === 0) {
        throw new Error("All images failed to compress");
      }

      // Update progress for upload
      Swal.update({
        text: `Uploading ${successfulFiles.length} compressed images...`,
      });

      // Create FormData with compressed files
      const formData = new FormData();
      successfulFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Upload using the existing mutation
      await bulkUploadMutation.mutateAsync(formData);

      // Show success message
      Swal.fire({
        title: "Upload Successful!",
        text: `${successfulFiles.length} images uploaded successfully!`,
        icon: "success",
        confirmButtonColor: "#3b82f6",
        timer: 3000,
        timerProgressBar: true,
      });

      // Show compression summary if there were compressions
      const originalSize = validFiles.reduce((sum, file) => sum + file.size, 0);
      const compressedSize = successfulFiles.reduce(
        (sum, file) => sum + file.size,
        0
      );
      const compressionRatio = (
        ((originalSize - compressedSize) / originalSize) *
        100
      ).toFixed(1);

      if (compressionRatio > 0) {
        setTimeout(() => {}, 3500);
      }
    } catch (error) {
      console.error("Bulk upload error:", error);
      Swal.fire({
        title: "Upload Failed!",
        text: error.message || "Failed to upload images. Please try again.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };
  // Clear image selection
  const clearImageSelection = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData({ ...formData, image: "" });

    // Clean up object URL to prevent memory leaks
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.image) {
        Swal.fire({
          title: "Missing Image!",
          text: "Please select an image for the gallery item.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
        return;
      }

      if (!formData.description.trim()) {
        Swal.fire({
          title: "Missing Description!",
          text: "Please provide a description for the gallery item.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
        return;
      }

      if (!formData.order || formData.order < 0) {
        Swal.fire({
          title: "Invalid Order!",
          text: "Please provide a valid display order.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
        return;
      }

      if (editingItem) {
        await updateMutation.mutateAsync({
          id: editingItem.id,
          data: {
            ...formData,
            order: parseInt(formData.order),
          },
        });

        Swal.fire({
          title: "Success!",
          text: "Gallery item updated successfully",
          icon: "success",
          confirmButtonColor: "#3b82f6",
        });
      } else {
        await createMutation.mutateAsync({
          ...formData,
          order: parseInt(formData.order),
        });

        Swal.fire({
          title: "Success!",
          text: "Gallery item created successfully",
          icon: "success",
          confirmButtonColor: "#3b82f6",
        });
      }

      handleCloseModal();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // Handle delete
  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteMutation.mutateAsync(item.id);
        Swal.fire({
          title: "Deleted!",
          text: "Gallery item has been deleted.",
          icon: "success",
          confirmButtonColor: "#3b82f6",
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to delete item",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  // Handle soft delete (toggle active status)
  const handleToggleActive = async (item) => {
    try {
      await updateMutation.mutateAsync({
        id: item.id,
        data: {
          isActive: !item.isActive, // Toggle the current state
        },
      });

      Swal.fire({
        title: "Success!",
        text: `Gallery item ${
          item.isActive ? "deactivated" : "activated"
        } successfully`,
        icon: "success",
        confirmButtonColor: "#3b82f6",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to update status",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // Modal handlers
  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        image: item.image || "",
        description: item.description || "",
        order: item.order || "",
        isActive: item.isActive,
      });
      setImagePreview(item.image || "");
    } else {
      setEditingItem(null);
      setFormData({
        image: "",
        description: "",
        order: "",
        isActive: true,
      });
      setImagePreview("");
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      image: "",
      description: "",
      order: "",
      isActive: true,
    });
    setImageFile(null);

    // Clean up object URL
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview("");
    setIsCompressing(false);
  };

  // Filter and sort items
  const filteredItems = galleryItems
    .filter((item) => {
      const matchesSearch =
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.image?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterActive === "all" ||
        (filterActive === "active" && item.isActive) ||
        (filterActive === "inactive" && !item.isActive);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "order") return (a.order || 0) - (b.order || 0);
      if (sortBy === "description")
        return (a.description || "").localeCompare(b.description || "");
      if (sortBy === "status") return b.isActive - a.isActive;
      return 0;
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error loading gallery: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gallery Management
        </h1>
        <p className="text-gray-600">
          Manage your gallery images and organize your content
        </p>
      </div>
      {/* Gallery Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Gallery Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {galleryItems.length}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Camera className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Gallery Items</p>
              <p className="text-2xl font-bold text-green-600">
                {galleryItems.filter((item) => item.isActive).length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive Gallery Items</p>
              <p className="text-2xl font-bold text-red-600">
                {galleryItems.filter((item) => !item.isActive).length}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <EyeOff className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search gallery..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Items</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="order">Sort by Order</option>
              <option value="description">Sort by Description</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>

          <div className="flex gap-2">
            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Bulk Upload */}
            <label className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-colors">
              <Upload className="w-4 h-4" />
              Bulk Upload
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleBulkUpload}
                className="hidden"
              />
            </label>

            {/* Add New */}
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">
              No gallery items found
            </div>
            <p className="text-gray-500">
              Start by adding your first gallery item
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-sm border border-gray-200"
              >
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.description}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">
                      Order: {item.order}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {item.description || "No description"}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Edit className="w-3 h-3 inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        item.isActive
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      {item.isActive ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.description}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-gray-400 text-xs">No Image</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {item.description || "No description"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(item)}
                          className={`${
                            item.isActive
                              ? "text-yellow-600 hover:text-yellow-900"
                              : "text-green-600 hover:text-green-900"
                          }`}
                        >
                          {item.isActive ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingItem ? "Edit Gallery Item" : "Add New Gallery Item"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gallery Image *
                  </label>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-4 relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={clearImageSelection}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="flex gap-3">
                    <label className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-colors">
                      <Camera className="w-4 h-4" />
                      {isCompressing ? "Compressing..." : "Choose Image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isCompressing}
                      />
                    </label>

                    {imagePreview && (
                      <button
                        type="button"
                        onClick={clearImageSelection}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Upload Info */}
                  <div className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      Images will be automatically compressed to optimize file
                      size. Max upload: 50MB
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter a detailed description of the image..."
                    required
                  />
                  <div className="mt-1 text-sm text-gray-500">
                    {formData.description.length}/500 characters
                  </div>
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order *
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter display order (e.g., 1, 2, 3...)"
                    min="0"
                    required
                  />
                  <div className="mt-1 text-sm text-gray-500">
                    Lower numbers appear first in the gallery
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isActive"
                        checked={formData.isActive === true}
                        onChange={() =>
                          setFormData({ ...formData, isActive: true })
                        }
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                        <Eye className="w-4 h-4 text-green-500" />
                        Active (Visible)
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isActive"
                        checked={formData.isActive === false}
                        onChange={() =>
                          setFormData({ ...formData, isActive: false })
                        }
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                        <EyeOff className="w-4 h-4 text-red-500" />
                        Inactive (Hidden)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                      createMutation.isPending ||
                      updateMutation.isPending ||
                      isCompressing ||
                      !formData.image
                    }
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createMutation.isPending || updateMutation.isPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </div>
                    ) : editingItem ? (
                      "Update Gallery Item"
                    ) : (
                      "Add to Gallery"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;
