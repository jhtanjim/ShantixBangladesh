import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { AuthPayload, LoginPayload } from "../types/auth";


export const useRegister = () =>
  useMutation({
    mutationFn: (data: AuthPayload) =>
      axiosInstance.post("/auth/register", data),
  });

export const useAdminRegister = () =>
  useMutation({
    mutationFn: (data: AuthPayload) =>
      axiosInstance.post("/auth/register/admin", data),
  });

export const useLogin = () =>
  useMutation({
    mutationFn: async (data: LoginPayload) => {
      const response = await axiosInstance.post("/auth/login", data);
      localStorage.setItem("token", response.data.token);
      return response.data;
    },
  });
