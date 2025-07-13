import api from "./axios"; // assuming this is the file you shared above

// Create new gallery item with image
export const createGalleryItem = (data) => api.post("/gallery", data);

// Bulk upload gallery items
export const bulkUploadGallery = (data) => api.post("/gallery/bulk-upload", data);

// Get all active gallery items
export const getGallery = () => api.get("/gallery");

// Get all gallery items (including inactive)
export const getAllGallery = () => api.get("/gallery/all");

// Get a single gallery item by ID
export const getGalleryById = (id) => api.get(`/gallery/${id}`);

// Update a gallery item
export const updateGalleryItem = (id, data) => api.patch(`/gallery/${id}`, data);

// Permanently delete a gallery item
export const deleteGalleryItem = (id) => api.delete(`/gallery/${id}`);

// Soft delete a gallery item
export const softDeleteGalleryItem = (id) => api.patch(`/gallery/${id}/soft-delete`);

// Upload or replace image for a gallery item
export const uploadGalleryImage = (id, data) => api.post(`/gallery/${id}/upload-image`, data);

// Delete image from gallery item
export const deleteGalleryImage = (id) => api.delete(`/gallery/${id}/image`);

// Reorder gallery items
export const reorderGalleryItems = (data) => api.put("/gallery/reorder", data);

// Bulk delete gallery items
export const bulkDeleteGalleryItems = async ({ ids }) => {
  const response = await api.delete('/gallery/bulk ', { data: { ids } });
  return response.data;
};