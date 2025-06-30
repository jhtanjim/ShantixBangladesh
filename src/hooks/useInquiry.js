import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInquiry,
  deleteInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
} from "../api/inquiry";

// Create new inquiry (public)
export const useCreateInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
};

// Get all inquiries (admin)
export const useAllInquiries = (filters = {}) => {
  return useQuery({
    queryKey: ["inquiries", filters],
    queryFn: () => getAllInquiries(filters),
  });
};

// Get single inquiry by ID (admin)
export const useInquiry = (inquiryId) => {
  return useQuery({
    queryKey: ["inquiry", inquiryId],
    queryFn: () => getInquiryById(inquiryId),
    enabled: !!inquiryId,
  });
};

// Update inquiry status/response (admin)
export const useUpdateInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ inquiryId, updateData }) =>
      updateInquiry(inquiryId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["inquiry"] });
    },
  });
};

// Delete inquiry (admin)
export const useDeleteInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inquiryId) => deleteInquiry(inquiryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
};
