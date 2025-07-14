import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bulkDeleteGalleryItems,
  bulkUploadGallery,
  createGalleryItem,
  deleteGalleryItem,
  getAllGallery,
  getGallery,
  reorderGalleryItems,
  softDeleteGalleryItem,
  updateGalleryItem,
} from "../api/gallery";

export const useGallery = () => {
  const queryClient = useQueryClient();

  const useGetGallery = () =>
    useQuery({
      queryKey: ["gallery"],
      queryFn: getGallery,
    });

  const useGetAllGallery = () =>
    useQuery({
      queryKey: ["gallery"],
      queryFn: getAllGallery,
    });

  const useCreateGalleryItem = () =>
    useMutation({
      mutationFn: createGalleryItem,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gallery"] }),
    });

  const useBulkUploadGallery = () =>
    useMutation({
      mutationFn: bulkUploadGallery,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gallery"] }),
    });

  const useDeleteGalleryItem = () =>
    useMutation({
      mutationFn: deleteGalleryItem,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gallery"] }),
    });

  const useSoftDeleteGalleryItem = () =>
    useMutation({
      mutationFn: softDeleteGalleryItem,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gallery"] }),
    });

  const useUpdateGalleryItem = () =>
    useMutation({
      mutationFn: ({ id, data }) => updateGalleryItem(id, data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gallery"] }),
    });

  const useReorderGalleryItems = () =>
    useMutation({
      mutationFn: reorderGalleryItems,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gallery"] }),
    });

  const useBulkDeleteGalleryItems = () =>
    useMutation({
      mutationFn: (data) => {
        // Add validation to ensure data is in correct format
        if (!data || !data.ids || !Array.isArray(data.ids)) {
          throw new Error('Invalid data format for bulk delete. Expected { ids: [...] }');
        }
        return bulkDeleteGalleryItems(data);
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gallery"] }),
      onError: (error) => {
        console.error('Bulk delete error:', error);
        // You can add additional error handling here
      },
    });

  return {
    useGetGallery,
    useGetAllGallery,
    useCreateGalleryItem,
    useBulkUploadGallery,
    useDeleteGalleryItem,
    useSoftDeleteGalleryItem,
    useUpdateGalleryItem,
    useReorderGalleryItems,
    useBulkDeleteGalleryItems,
  };
};