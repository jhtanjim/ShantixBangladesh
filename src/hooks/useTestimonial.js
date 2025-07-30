// src/hooks/useTestimonial.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createTestimonial,
    deleteTestimonial,
    deleteTestimonialAvatar,
    getAllTestimonials,
    getAverageRating,
    getTestimonialById,
    updateTestimonial,
} from "../api/testimonial";

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries(["testimonials"]);
    },
  });
};

export const useTestimonials = (filters) => {
  return useQuery({
    queryKey: ["testimonials", filters],
    queryFn: () => getAllTestimonials(filters),
  });
};

export const useTestimonial = (id) => {
  return useQuery({
    queryKey: ["testimonial", id],
    queryFn: () => getTestimonialById(id),
    enabled: !!id,
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries(["testimonials"]);
    },
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries(["testimonials"]);
    },
  });
};

export const useDeleteTestimonialAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTestimonialAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries(["testimonials"]);
    },
  });
};

export const useAverageRating = () => {
  return useQuery({
    queryKey: ["averageRating"],
    queryFn: getAverageRating,
  });
};
