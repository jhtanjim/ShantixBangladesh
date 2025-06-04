import axios from "./axios";

// Helper to build query params safely
const buildParams = (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !(key === "sortBy" && value === "default") // Don't send sortBy=default
    ) {
      params.append(key, value.toString());
    }
  });

  return params.toString();
};

// Get all active cars (Public)
export const getAllCars = async (filters = {}) => {
  const query = buildParams(filters);
  const response = await axios.get(`/cars?${query}`);
  return response.data.data;
};

// Get all cars including inactive (Admin only)
export const getAllCarsAdmin = async (filters = {}) => {
  const query = buildParams(filters);
  const response = await axios.get(`/cars/admin?${query}`);
  return response.data;
};

// Get car by ID (Public)
export const getCarById = async (id) => {
  const response = await axios.get(`/cars/${id}`);
  return response.data;
};

// Create new car (Admin only)
export const createCar = async (carData) => {
  const response = await axios.post("/cars", carData);
  return response.data;
};

// Update car (Admin only)
export const updateCarById = async (id, data) => {
  const response = await axios.put(`/cars/${id}`, data);
  return response.data;
};

// Delete car (Admin only)
export const deleteCarById = async (id) => {
  const response = await axios.delete(`/cars/${id}`);
  return response.data;
};

// Activate car (Admin only)
export const activateCarById = async (id) => {
  const response = await axios.patch(`/cars/${id}/activate`);
  return response.data;
};

// Deactivate car (Admin only)
export const deactivateCarById = async (id) => {
  const response = await axios.patch(`/cars/${id}/deactivate`);
  return response.data;
};

// Import cars (Admin only)
export const importCars = async (carsData) => {
  const response = await axios.post("/cars/import", carsData);
  return response.data;
};
