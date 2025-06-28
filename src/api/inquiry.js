import axios from "./axios";

// Submit a new inquiry (public)
export const createInquiry = async (data) => {
  const response = await axios.post("/inquiries", data);
  return response.data;
};

// Get all inquiries (admin only, with optional filters)
export const getAllInquiries = async (filters = {}) => {
  const response = await axios.get("/inquiries", { params: filters });
  return response.data;
};

// Get inquiry by ID (admin only)
export const getInquiryById = async (id) => {
  const response = await axios.get(`/inquiries/${id}`);
  return response.data;
};

// Update inquiry (status/response) (admin only)
export const updateInquiry = async (id, updateData) => {
  const response = await axios.patch(`/inquiries/${id}`, updateData);
  return response.data;
};

// Delete inquiry (admin only)
export const deleteInquiry = async (id) => {
  const response = await axios.delete(`/inquiries/${id}`);
  return response.data;
};
