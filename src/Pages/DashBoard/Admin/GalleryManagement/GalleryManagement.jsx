import {
  AlertCircle,
  Check,
  Edit,
  Eye,
  EyeOff,
  GripVertical,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGallery } from "../../../../hooks/useGallery";

// Mock SweetAlert2 for demo - replace with actual import
const Swal = {
  fire: (options) => {
    if (options.title === "Are you sure?") {
      return Promise.resolve({ isConfirmed: window.confirm(options.text) });
    }
    if (options.icon === "success") {
      alert(options.title);
      return Promise.resolve();
    }
    if (options.icon === "error") {
      alert(`Error: ${options.title}`);
      return Promise.resolve();
    }
    return Promise.resolve({ isConfirmed: true });
  },
  mixin: () => ({
    fire: (options) => {
      const toastDiv = document.createElement("div");
      toastDiv.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white shadow-lg transition-all duration-300 ${
        options.icon === "success" ? "bg-green-500" : "bg-red-500"
      }`;
      toastDiv.textContent = options.title;
      document.body.appendChild(toastDiv);
      setTimeout(() => {
        toastDiv.remove();
      }, 3000);
    },
  }),
};

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
});

// Loading Component
const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`animate-spin ${sizeClasses[size]} text-blue-600`} />
    </div>
  );
};

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
        <span className="text-red-800">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Retry
        </button>
      )}
    </div>
  </div>
);

// Success Message Component
const SuccessMessage = ({ message, onClose }) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Check className="h-5 w-5 text-green-600 mr-2" />
        <span className="text-green-800">{message}</span>
      </div>
      <button onClick={onClose} className="text-green-600 hover:text-green-800">
        <X className="h-4 w-4" />
      </button>
    </div>
  </div>
);

// Image Preview Component
const ImagePreview = ({ src, alt, className = "" }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <LoadingSpinner size="sm" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover rounded transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <div className="text-center text-gray-500">
            <ImageIcon className="h-8 w-8 mx-auto mb-2" />
            <p className="text-xs">Image not found</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Edit Form Component
const EditForm = ({ item, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    image: item.image || "",
    description: item.description || "",
    order: item.order || 0,
    isActive: item.isActive ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      Toast.fire({
        icon: "error",
        title: "Description is required",
      });
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL
        </label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, image: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter description..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                order: parseInt(e.target.value) || 0,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.isActive.toString()}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isActive: e.target.value === "true",
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// Add Item Form Component
const AddItemForm = ({ onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    image: "",
    description: "",
    order: 0,
    isActive: true,
  });
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      Toast.fire({
        icon: "error",
        title: "Description is required",
      });
      return;
    }
    onSubmit(formData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      Toast.fire({
        icon: "error",
        title: "Please select a valid image file",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      Toast.fire({
        icon: "error",
        title: "File size should be less than 5MB",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({ ...prev, image: e.target.result }));
    };
    reader.onerror = () => {
      Toast.fire({
        icon: "error",
        title: "Error reading file",
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Item</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </button>
                  <span className="text-sm text-gray-500">or</span>
                </div>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, image: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter image URL"
                />
                {formData.image && (
                  <div className="mt-3">
                    <ImagePreview
                      src={formData.image}
                      alt="Preview"
                      className="h-32 w-32 rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter description..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      order: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.isActive.toString()}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.value === "true",
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Item
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

// Gallery Item Component
const GalleryItem = ({
  item,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onSave,
  onCancelEdit,
  onDelete,
  onToggleStatus,
  onDragStart,
  onDragOver,
  onDrop,
  isLoading,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, item)}
      className={`bg-white border-2 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-move ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-200"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="relative">
        <ImagePreview
          src={item.image}
          alt={item.description}
          className="h-48 w-full"
        />

        <div className="absolute top-2 left-2 flex space-x-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(item.id)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <button className="text-white hover:text-gray-200 bg-black bg-opacity-50 rounded p-1">
            <GripVertical className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              item.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {item.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="absolute bottom-2 right-2">
          <span className="px-2 py-1 text-xs bg-black bg-opacity-50 text-white rounded">
            #{item.order}
          </span>
        </div>
      </div>

      <div className="p-4">
        {isEditing ? (
          <EditForm
            item={item}
            onSave={onSave}
            onCancel={onCancelEdit}
            isLoading={isLoading}
          />
        ) : (
          <>
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
              {item.description}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>ID: {item.id}</span>
              <span>Order: {item.order}</span>
            </div>
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => onEdit(item.id)}
                className="flex items-center px-3 py-1 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                title="Edit item"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => onToggleStatus(item.id)}
                className={`flex items-center px-3 py-1 rounded transition-colors ${
                  item.isActive
                    ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                    : "text-green-600 bg-green-50 hover:bg-green-100"
                }`}
                title={item.isActive ? "Deactivate" : "Activate"}
              >
                {item.isActive ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Show
                  </>
                )}
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="flex items-center px-3 py-1 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                title="Delete permanently"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Main Gallery Management Component
const GalleryManagement = () => {
  const {
    useGetAllGallery,
    useCreateGalleryItem,
    useBulkUploadGallery,
    useDeleteGalleryItem,
    useSoftDeleteGalleryItem,
    useUpdateGalleryItem,
    useReorderGalleryItems,
    useBulkDeleteGalleryItems,
  } = useGallery();

  const { data: galleryData, isLoading, error, refetch } = useGetAllGallery();
  const galleryItems = Array.isArray(galleryData?.data) ? galleryData.data : [];

  const createMutation = useCreateGalleryItem();
  const bulkUploadMutation = useBulkUploadGallery();
  const deleteMutation = useDeleteGalleryItem();
  const softDeleteMutation = useSoftDeleteGalleryItem();
  const updateMutation = useUpdateGalleryItem();
  const reorderMutation = useReorderGalleryItems();
  const bulkDeleteMutation = useBulkDeleteGalleryItems();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const bulkFileInputRef = useRef(null);

  // Load data on component mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleCreateItem = async (formData) => {
    try {
      await createMutation.mutateAsync(formData);
      setShowAddForm(false);
      setSuccessMessage("Gallery item created successfully!");
      Toast.fire({
        icon: "success",
        title: "Item created successfully!",
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.message || "Failed to create item",
      });
    }
  };

  const handleUpdateItem = async (id, data) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      setEditingItem(null);
      setSuccessMessage("Gallery item updated successfully!");
      Toast.fire({
        icon: "success",
        title: "Item updated successfully!",
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.message || "Failed to update item",
      });
    }
  };

  const handleDeleteItem = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteMutation.mutateAsync(id);
        setSuccessMessage("Gallery item deleted successfully!");
        Toast.fire({
          icon: "success",
          title: "Item deleted successfully!",
        });
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: error.message || "Failed to delete item",
        });
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const item = galleryItems.find((item) => item.id === id);
      const updatedData = { ...item, isActive: !item.isActive };

      await updateMutation.mutateAsync({ id, data: updatedData });
      setSuccessMessage("Item status updated successfully!");
      Toast.fire({
        icon: "success",
        title: "Status updated successfully!",
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.message || "Failed to update status",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete ${selectedItems.length} selected items? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete them!",
    });

    if (result.isConfirmed) {
      try {
        await bulkDeleteMutation.mutateAsync({ ids: selectedItems }); // Pass { ids: [...] }
        setSelectedItems([]);
        setSuccessMessage(
          `${selectedItems.length} items deleted successfully!`
        );
        Toast.fire({
          icon: "success",
          title: "Items deleted successfully!",
        });
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: error.message || "Failed to delete items",
        });
      }
    }
  };

  const handleBulkUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        Toast.fire({
          icon: "error",
          title: `Skipping non-image file: ${file.name}`,
        });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        Toast.fire({
          icon: "error",
          title: `File too large: ${file.name}`,
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      Toast.fire({
        icon: "error",
        title: "No valid image files selected",
      });
      return;
    }

    try {
      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append("images", file);
      });
      await bulkUploadMutation.mutateAsync(formData);
      setSuccessMessage(`${validFiles.length} images uploaded successfully!`);
      Toast.fire({
        icon: "success",
        title: "Images uploaded successfully!",
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.message || "Failed to upload images",
      });
    }
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, targetItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const reorderedItems = [...galleryItems];
    const draggedIndex = reorderedItems.findIndex(
      (item) => item.id === draggedItem.id
    );
    const targetIndex = reorderedItems.findIndex(
      (item) => item.id === targetItem.id
    );

    reorderedItems.splice(draggedIndex, 1);
    reorderedItems.splice(targetIndex, 0, draggedItem);

    const reorderData = reorderedItems.map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));

    try {
      await reorderMutation.mutateAsync(reorderData);
      Toast.fire({
        icon: "success",
        title: "Items reordered successfully!",
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.message || "Failed to reorder items",
      });
    }

    setDraggedItem(null);
  };

  const toggleItemSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const selectAllItems = () => {
    setSelectedItems(galleryItems.map((item) => item.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <ErrorMessage
          message={`Error loading gallery: ${error.message}`}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gallery Management
          </h1>
          <p className="text-gray-600">
            Manage your gallery items with drag-and-drop reordering
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => bulkFileInputRef.current?.click()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border">
          <div className="text-2xl font-bold text-blue-600">
            {galleryItems.length}
          </div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="text-2xl font-bold text-green-600">
            {galleryItems.filter((item) => item.isActive).length}
          </div>
          <div className="text-sm text-gray-600">Active Items</div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="text-2xl font-bold text-red-600">
            {galleryItems.filter((item) => !item.isActive).length}
          </div>
          <div className="text-sm text-gray-600">Inactive Items</div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="text-2xl font-bold text-purple-600">
            {selectedItems.length}
          </div>
          <div className="text-sm text-gray-600">Selected Items</div>
        </div>
      </div>

      {/* Bulk Actions */}
      {galleryItems.length > 0 && (
        <div className="bg-white rounded-lg p-4 border mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={selectAllItems}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Clear Selection
              </button>
              <span className="text-sm text-gray-600">
                {selectedItems.length} of {galleryItems.length} selected
              </span>
            </div>
            {selectedItems.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedItems.length})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {galleryItems.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No gallery items yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start by adding your first gallery item
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <GalleryItem
              key={item.id}
              item={item}
              isSelected={selectedItems.includes(item.id)}
              isEditing={editingItem === item.id}
              onSelect={toggleItemSelection}
              onEdit={setEditingItem}
              onSave={(data) => handleUpdateItem(item.id, data)}
              onCancelEdit={() => setEditingItem(null)}
              onDelete={handleDeleteItem}
              onToggleStatus={handleToggleStatus}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isLoading={updateMutation.isLoading}
            />
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {showAddForm && (
        <AddItemForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleCreateItem}
          isLoading={createMutation.isLoading}
        />
      )}

      {/* Hidden Bulk Upload Input */}
      <input
        ref={bulkFileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleBulkUpload}
        className="hidden"
      />

      {/* Loading Overlay */}
      {(createMutation.isLoading ||
        updateMutation.isLoading ||
        deleteMutation.isLoading ||
        bulkDeleteMutation.isLoading ||
        bulkUploadMutation.isLoading ||
        reorderMutation.isLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <LoadingSpinner size="sm" />
            <span className="text-gray-700">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;
