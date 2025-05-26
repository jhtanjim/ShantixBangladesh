import { AuthResponse, LoginType } from "../context/AuthContext";
import axios from "./axios";

export const registerUser = async (data: any) => {
  const response = await axios.post("/auth/register", data);
  return response.data;
};

export const registerAdmin = async (data: any) => {
  const response = await axios.post("/auth/register/admin", data);
  return response.data;
};

export const loginUser = async (data: LoginType): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>("/auth/login", data);
  return response.data;
};
