import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save, Upload, Image as ImageIcon, Calendar, Ship, MapPin, Loader, CheckCircle, AlertCircle, Search, Filter, SortAsc, SortDesc, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';
import useShipSchedule from '../../../../hooks/useShipSchedule';

const ShipScheduleList = () => {
  const {
    adminSchedules,
    isLoading,
    isError,
    createMutation,
    updateMutation,
    deleteMutation,
    activateMutation,
    deactivateMutation,
    refetch
  } = useShipSchedule();

  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    description: '',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [sortBy, setSortBy] = useState('title'); // 'title', 'created', 'status'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  const [showFilters, setShowFilters] = useState(false);

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
      
      const formData = new FormData();
      formData.append('image', compressedFile, 'schedule-image.jpg');

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
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

  const resetForm = () => {
    setFormData({ title: '', image: '', description: '', isActive: true });
    setImageFile(null);
    setImagePreview('');
    setFormErrors({});
  };

  // Filter and sort schedules
  const filteredAndSortedSchedules = useMemo(() => {
    const schedules = adminSchedules?.data || [];
    
    // Filter by search term
    let filtered = schedules.filter(schedule => {
      const matchesSearch = searchTerm === '' || 
        schedule.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && schedule.isActive) ||
        (statusFilter === 'inactive' && !schedule.isActive);
      
      return matchesSearch && matchesStatus;
    });

    // Sort schedules
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        case 'status':
          aValue = a.isActive ? 1 : 0;
          bValue = b.isActive ? 1 : 0;
          break;
        case 'created':
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [adminSchedules?.data, searchTerm, statusFilter, sortBy, sortOrder]);

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

      await submitForm(finalFormData);
      
    } catch (error) {
      console.error('Form submission error:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to save schedule. Please try again.',
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  const submitForm = async (data) => {
    try {
      if (editingSchedule) {
        const result = await updateMutation.mutateAsync({ 
          id: editingSchedule.id, 
          data: data 
        });
        
        // Check if the mutation was successful
        if (result && (result.success !== false)) {
          Swal.fire({
            title: 'Updated!',
            text: 'Schedule has been updated successfully.',
            icon: 'success',
            confirmButtonColor: '#3b82f6',
            timer: 2000,
            showConfirmButton: false
          });
          setEditingSchedule(null);
          resetForm();
          setShowForm(false);
        } else {
          throw new Error(result?.message || 'Update failed');
        }
      } else {
        const result = await createMutation.mutateAsync(data);
        
        // Check if the mutation was successful
        if (result && (result.success !== false)) {
          Swal.fire({
            title: 'Created!',
            text: 'New schedule has been created successfully.',
            icon: 'success',
            confirmButtonColor: '#3b82f6',
            timer: 2000,
            showConfirmButton: false
          });
          resetForm();
          setShowForm(false);
        } else {
          throw new Error(result?.message || 'Creation failed');
        }
      }
      
      // Force refetch to ensure UI is updated
      setTimeout(() => {
        refetch();
      }, 100);
      
    } catch (error) {
      console.error('Submit form error:', error);
      throw new Error(error.message || 'Operation failed');
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      title: schedule.title || '',
      image: schedule.image || '',
      description: schedule.description || '',
      isActive: schedule.isActive !== undefined ? schedule.isActive : true
    });
    setImagePreview(schedule.image || '');
    setFormErrors({});
    setShowForm(true);
  };

  const handleCancel = () => {
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
        setShowForm(false);
        setEditingSchedule(null);
        resetForm();
      }
    });
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

  const toggleStatus = async (schedule) => {
    const action = schedule.isActive ? 'deactivate' : 'activate';
    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Schedule`,
      text: `Are you sure you want to ${action} "${schedule.title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: schedule.isActive ? '#ef4444' : '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        let mutationResult;
        
        if (schedule.isActive) {
          mutationResult = await deactivateMutation.mutateAsync(schedule.id);
        } else {
          mutationResult = await activateMutation.mutateAsync(schedule.id);
        }
        
        // Check if the mutation was successful
        if (mutationResult && (mutationResult.success !== false)) {
          Swal.fire({
            title: `${action.charAt(0).toUpperCase() + action.slice(1)}d!`,
            text: `Schedule has been ${action}d successfully.`,
            icon: 'success',
            confirmButtonColor: '#3b82f6',
            timer: 2000,
            showConfirmButton: false
          });
          
          // Force refetch to update UI immediately
          setTimeout(() => {
            refetch();
          }, 100);
          
        } else {
          throw new Error(mutationResult?.message || `Failed to ${action} schedule`);
        }
        
      } catch (error) {
        console.error(`Toggle status error:`, error);
        Swal.fire({
          title: 'Error',
          text: error.message || `Failed to ${action} schedule. Please try again.`,
          icon: 'error',
          confirmButtonColor: '#3b82f6'
        });
      }
    }
  };

  const handleDelete = async (schedule) => {
    const result = await Swal.fire({
      title: 'Delete Schedule',
      text: `Are you sure you want to delete "${schedule.title}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await deleteMutation.mutateAsync(schedule.id);
        
        // Check if the mutation was successful
        if (deleteResult && (deleteResult.success !== false)) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Schedule has been deleted successfully.',
            icon: 'success',
            confirmButtonColor: '#3b82f6',
            timer: 2000,
            showConfirmButton: false
          });
          
          // Force refetch to update UI immediately
          setTimeout(() => {
            refetch();
          }, 100);
          
        } else {
          throw new Error(deleteResult?.message || 'Failed to delete schedule');
        }
        
      } catch (error) {
        console.error('Delete error:', error);
        Swal.fire({
          title: 'Error',
          text: error.message || 'Failed to delete schedule. Please try again.',
          icon: 'error',
          confirmButtonColor: '#3b82f6'
        });
      }
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setImageFile(null);
    setFormData({ ...formData, image: '' });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('title');
    setSortOrder('asc');
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading ship schedules...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <AlertCircle className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Schedules</h3>
            <p className="text-red-600 mb-4">Unable to load ship schedules. Please try again.</p>
            <button 
              onClick={handleRefresh}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const schedules = adminSchedules?.data || [];
  const totalSchedules = schedules.length;
  const activeSchedules = schedules.filter(s => s.isActive).length;
  const inactiveSchedules = totalSchedules - activeSchedules;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-3">
                <Ship className="text-blue-600" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Ship Schedule Management</h1>
                <p className="text-gray-600 mt-1">
                  Manage your ship routes and schedules
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-green-600 font-medium">
                    {activeSchedules} Active
                  </span>
                  <span className="text-red-600 font-medium">
                    {inactiveSchedules} Inactive
                  </span>
                  <span className="text-gray-600">
                    {totalSchedules} Total
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                title="Refresh Data"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus size={20} />
                Add New Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search schedules by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl flex items-center gap-2 transition-colors"
            >
              <Filter size={18} />
              Filters
              {(statusFilter !== 'all' || sortBy !== 'title' || sortOrder !== 'asc') && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                  Active
                </span>
              )}
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Schedules</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="title">Title</option>
                    <option value="status">Status</option>
                    <option value="created">Date Created</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                  >
                    {sortOrder === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
                    {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                  </button>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearAllFilters}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAndSortedSchedules.length} of {totalSchedules} schedules
            {searchTerm && (
              <span className="ml-2">
                matching "{searchTerm}"
              </span>
            )}
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Calendar className="text-blue-600" size={24} />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
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
                    disabled={createMutation.isPending || updateMutation.isPending || imageUploading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {(createMutation.isPending || updateMutation.isPending || imageUploading) ? (
                      <Loader className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                    {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Schedules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedSchedules.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <div className="bg-gray-100 rounded-full p-4 mx-auto mb-4 w-20 h-20 flex items-center justify-center">
                  <Ship className="text-gray-400" size={40} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'No matching schedules found' : 'No schedules yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search criteria or filters.'
                    : 'Create your first ship schedule to get started.'
                  }
                </p>
                {(searchTerm || statusFilter !== 'all') ? (
                  <button
                    onClick={clearAllFilters}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition-all"
                  >
                    <Plus size={20} />
                    Add First Schedule
                  </button>
                )}
              </div>
            </div>
          ) : (
            filteredAndSortedSchedules.map((schedule) => (
              <div key={schedule.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden group">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden">
                  {schedule.image ? (
                    <img
                      src={schedule.image}
                      alt={schedule.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`${schedule.image ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-white`}
                    style={{ display: schedule.image ? 'none' : 'flex' }}
                  >
                    <Ship size={48} />
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      schedule.isActive 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {schedule.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-2 flex-1">
                      {schedule.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {schedule.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    {schedule.createdAt && (
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(schedule.createdAt).toLocaleDateString()}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      Schedule
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Schedule"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => toggleStatus(schedule)}
                        className={`p-2 rounded-lg transition-colors ${
                          schedule.isActive 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={schedule.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {schedule.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => handleDelete(schedule)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Schedule"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-400">
                      ID: {schedule.id}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipScheduleList;