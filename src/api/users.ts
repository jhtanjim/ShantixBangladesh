import axios from "./axios";

export const getCurrentUser = async () => {
  const response = await axios.get("/users/profile");
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await axios.get(`/users/${id}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get("/users");
  return response.data;
};

export const updateUserById = async (id: string, data: any) => {
  const response = await axios.patch(`/users/${id}`, data);
  return response.data;
};

export const deleteUserById = async (id: string) => {
  const response = await axios.delete(`/users/${id}`);
  return response.data;
};
