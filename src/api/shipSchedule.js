import axios from "./axios";

// Get all schedules
export const getSchedules = async () => {
  const response = await axios.get('/ship-schedule');
  return response.data;
};

// Get schedule by ID
export const getSchedule = async (id) => {
  const response = await axios.get(`/ship-schedule/${id}`);
  return response.data;
};

// Create a new schedule
export const createSchedule = async (data) => {
  const response = await axios.post('/ship-schedule', data);
  return response.data;
};

// Update a schedule
export const updateSchedule = async (id, data) => {
  const response = await axios.patch(`/ship-schedule/${id}`, data);
  return response.data;
};

// Delete a schedule
export const deleteSchedule = async (id) => {
  const response = await axios.delete(`/ship-schedule/${id}`);
  return response.data;
};

// Activate a schedule
export const activateSchedule = async (id) => {
  const response = await axios.patch(`/ship-schedule/${id}/activate`);
  return response.data;
};

// Deactivate a schedule
export const deactivateSchedule = async (id) => {
  const response = await axios.patch(`/ship-schedule/${id}/deactivate`);
  return response.data;
};

// Get admin schedules
export const getAdminSchedules = async () => {
  const response = await axios.get('/ship-schedule/admin');
  return response.data;
};
