import api from "./axios"; // assuming this is the file you shared above
// gallery.js API functions


// Get all gallery items
export const getAllGallery = async () => {
  const response = await api.get('/gallery');
  return response.data;
};

// Get single gallery item
export const getGallery = async (id) => {
  const response = await api.get(`/gallery/${id}`);
  return response.data;
};

// Create gallery item
export const createGalleryItem = async (data) => {
  const response = await api.post('/gallery', data);
  return response.data;
};

// Update gallery item
export const updateGalleryItem = async (id, data) => {
  const response = await api.patch(`/gallery/${id}`, data);
  return response.data;
};

// Delete gallery item (hard delete)
export const deleteGalleryItem = async (id) => {
  const response = await api.delete(`/gallery/${id}`);
  return response.data;
};

// Soft delete gallery item
export const softDeleteGalleryItem = async (id) => {
  const response = await api.patch(`/gallery/${id}/soft-delete`);
  return response.data;
};

// Bulk upload gallery items
export const bulkUploadGallery = async (formData) => {
  const response = await api.post('/gallery/bulk-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Bulk delete gallery items - FIX: Use POST with body instead of DELETE
export const bulkDeleteGalleryItems = async (data) => {
  // Option 1: Use POST for bulk delete (recommended)
  const response = await api.post('/gallery/bulk-delete', data);
  return response.data;
  
  // Option 2: If your API expects DELETE with body
  // const response = await api.delete('/gallery/bulk-delete', { data });
  // return response.data;
  
  // Option 3: If your API expects query parameters
  // const response = await api.delete('/gallery/bulk-delete', {
  //   params: { ids: data.ids.join(',') }
  // });
  // return response.data;
};

// Reorder gallery items
export const reorderGalleryItems = async (data) => {
  const response = await api.post('/gallery/reorder', data);
  return response.data;
};