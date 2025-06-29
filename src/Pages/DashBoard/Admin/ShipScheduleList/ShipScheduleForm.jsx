// components/ShipSchedule/ShipScheduleForm.jsx
import React, { useState, useRef, useCallback } from 'react';
import { X, Save, Upload, ImageIcon, Loader, AlertCircle, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';

const ShipScheduleForm = ({ 
  title, 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  submitText = "Save"
}) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    image: initialData.image || '',
    description: initialData.description || '',
    isActive: initialData.isActive !== undefined ? initialData.isActive : true
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData.image || '');
  const [dragOver, setDragOver] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const fileInputRef = useRef(null);

  // Image compression function
  const compressImage = useCallback((file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Upload image to API
  const uploadImageToAPI = async (file) => {
    try {
      setImageUploading(true);
      
      const compressedFile = await compressImage(file);
      
      const formDataUpload = new FormData();
      formDataUpload.append('image', compressedFile, 'schedule-image.jpg');

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const data = await response.json();
      return data.imageUrl || data.url;
      
    } catch (error) {
      console.error('Image upload error:', error);
      
      // Fallback to base64 if API upload fails
      const compressedFile = await compressImage(file);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(compressedFile);
      });
    } finally {
      setImageUploading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters long';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fix the form errors before submitting.',
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    try {
      let finalFormData = { ...formData };
      
      if (imageFile) {
        const imageUrl = await uploadImageToAPI(imageFile);
        finalFormData.image = imageUrl;
      }

      await onSubmit(finalFormData);
      
    } catch (error) {
      console.error('Form submission error:', error);
      // Error handling is done in parent components
    }
  };

  const handleCancel = () => {
    const hasChanges = 
      formData.title !== (initialData.title || '') ||
      formData.description !== (initialData.description || '') ||
      formData.image !== (initialData.image || '') ||
      formData.isActive !== (initialData.isActive !== undefined ? initialData.isActive : true) ||
      imageFile !== null;

    if (hasChanges) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Any unsaved changes will be lost.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, cancel',
        cancelButtonText: 'Continue editing'
      }).then((result) => {
        if (result.isConfirmed) {
          onCancel?.();
        }
      });
    } else {
      onCancel?.();
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Invalid File',
        text: 'Please select a valid image file (PNG, JPG, GIF).',
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        title: 'File Too Large',
        text: 'Please select an image smaller than 10MB.',
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
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

  const removeImage = () => {
    setImagePreview('');
    setImageFile(null);
    setFormData({ ...formData, image: '' });
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
              <h2 className="text-2xl font-semibold text-gray-800">
                {title}
              </h2>
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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                formErrors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter schedule title (e.g., Dhaka to Chittagong)"
            />
            {formErrors.title && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {formErrors.title}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Schedule Image
            </label>
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer relative
                  ${dragOver 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
                
                {imageUploading && (
                  <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl">
                    <div className="text-center">
                      <Loader className="animate-spin text-blue-600 mx-auto mb-2" size={32} />
                      <p className="text-blue-600 font-medium">Compressing image...</p>
                    </div>
                  </div>
                )}
                
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'block';
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
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="py-4">
                    <Upload className="mx-auto text-gray-400 mb-2" size={48} />
                    <p className="text-gray-600 font-medium">Drop image here or click to upload</p>
                    <p className="text-gray-400 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or enter image URL</span>
                </div>
              </div>

              <input
                type="url"
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  if (e.target.value) {
                    setImagePreview(e.target.value);
                    setImageFile(null);
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
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                formErrors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter detailed description of the schedule including departure times, routes, and important information..."
            />
            {formErrors.description && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {formErrors.description}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center gap-3">
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
              {(isSubmitting || imageUploading) ? (
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