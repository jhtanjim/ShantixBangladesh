"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../api/users";
import { useAuth } from "../Context/AuthContext";

export const useCurrentUser = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
  });
};

export const useUser = (id) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id && !!token,
  });
};

export const useAllUsers = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
    enabled: !!token,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateUserById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteUserById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });
};
