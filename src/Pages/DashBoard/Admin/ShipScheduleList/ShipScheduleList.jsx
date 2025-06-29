import React, { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save, Upload, Image as ImageIcon, Calendar, Ship, MapPin } from 'lucide-react';
import useShipSchedule from '../../../../hooks/useShipSchedule';

const ShipScheduleList = () => {
  const {
    schedules,
    isLoading,
    isError,
    createMutation,
    updateMutation,
    deleteMutation,
    activateMutation,
    deactivateMutation
  } = useShipSchedule();
console.log(schedules)
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
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setFormData({ title: '', image: '', description: '', isActive: true });
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let finalFormData = { ...formData };
    
    // If there's an image file, convert it to base64 or handle upload
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        finalFormData.image = reader.result;
        submitForm(finalFormData);
      };
      reader.readAsDataURL(imageFile);
    } else {
      submitForm(finalFormData);
    }
  };

  const submitForm = (data) => {
    if (editingSchedule) {
      updateMutation.mutate({ id: editingSchedule.id, data });
      setEditingSchedule(null);
    } else {
      createMutation.mutate(data);
    }
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      title: schedule.title,
      image: schedule.image,
      description: schedule.description,
      isActive: schedule.isActive
    });
    setImagePreview(schedule.image);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSchedule(null);
    resetForm();
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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

  const toggleStatus = (schedule) => {
    if (schedule.isActive) {
      deactivateMutation.mutate(schedule.id);
    } else {
      activateMutation.mutate(schedule.id);
    }
  };

  const handleDelete = (schedule) => {
    if (window.confirm(`Are you sure you want to delete "${schedule.title}"?`)) {
      deleteMutation.mutate(schedule.id);
    }
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
              <X className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Schedules</h3>
            <p className="text-red-600 mb-4">Unable to load ship schedules. Please try again.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                <p className="text-gray-600 mt-1">Manage your ship routes and schedules</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Add New Schedule
            </button>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter schedule title (e.g., Dhaka to Chittagong)"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Schedule Image
                  </label>
                  <div className="space-y-4">
                    {/* File Upload Area */}
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
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
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImagePreview('');
                              setImageFile(null);
                              setFormData({ ...formData, image: '' });
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

                    {/* Or URL Input */}
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
                        setImagePreview(e.target.value);
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Enter detailed schedule description, routes, timings, etc."
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Schedule is active and visible to users
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl flex items-center justify-center gap-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                  >
                    <Save size={18} />
                    {(createMutation.isLoading || updateMutation.isLoading) 
                      ? 'Saving...' 
                      : editingSchedule ? 'Update Schedule' : 'Create Schedule'
                    }
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Schedules Grid */}
        {Array.isArray(schedules?.data) && schedules.data.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="bg-blue-100 rounded-full p-6 mx-auto mb-6 w-24 h-24 flex items-center justify-center">
              <Ship className="text-blue-600" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Ship Schedules Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get started by creating your first ship schedule. Add routes, timings, and details to help passengers plan their journey.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl flex items-center gap-3 mx-auto transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={24} />
              Create Your First Schedule
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {schedules?.data?.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100">
                  {schedule.image ? (
                    <img
                      src={schedule.image}
                      alt={schedule.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="text-gray-400" size={64} />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg
                        ${schedule.isActive 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                        }`}
                    >
                      {schedule.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800 leading-tight">
                      {schedule.title}
                    </h3>
                    <div className="flex items-center gap-1 ml-2">
                      <MapPin className="text-blue-600" size={16} />
                    </div>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {schedule.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => toggleStatus(schedule)}
                      disabled={activateMutation.isLoading || deactivateMutation.isLoading}
                      className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium
                        ${schedule.isActive 
                          ? 'bg-red-50 hover:bg-red-100 text-red-700' 
                          : 'bg-green-50 hover:bg-green-100 text-green-700'
                        }`}
                    >
                      {schedule.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                      {schedule.isActive ? 'Hide' : 'Show'}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(schedule)}
                      disabled={deleteMutation.isLoading}
                      className="bg-red-50 hover:bg-red-100 text-red-700 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipScheduleList;