// src/services/testimonialService.js
import axios from "./axios"; // your axios instance

export const createTestimonial = async (formData) => {
  const response = await axios.post("/testimonials", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllTestimonials = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await axios.get(`/testimonials?${params}`);
  return response.data;
};

export const getTestimonialById = async (id) => {
  const response = await axios.get(`/testimonials/${id}`);
  return response.data;
};

export const updateTestimonial = async ({ id, formData }) => {
  const response = await axios.put(`/testimonials/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteTestimonial = async (id) => {
  const response = await axios.delete(`/testimonials/${id}`);
  return response.data;
};

export const deleteTestimonialAvatar = async (id) => {
  const response = await axios.delete(`/testimonials/${id}/avatar`);
  return response.data;
};

export const getAverageRating = async () => {
  const response = await axios.get(`/testimonials/stats/average-rating`);
  return response.data;
};
