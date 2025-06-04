"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllCars,
  getAllCarsAdmin,
  getCarById,
  createCar,
  updateCarById,
  deleteCarById,
  activateCarById,
  deactivateCarById,
  importCars,
} from "../api/carService";

// Get all active cars (Public)
export const useAllCars = (filters = {}) => {
  return useQuery({
    queryKey: ["cars", filters],
    queryFn: () => getAllCars(filters),
  });
};

// Get all cars including inactive (Admin)
export const useAllCarsAdmin = (filters = {}) => {
  return useQuery({
    queryKey: ["cars-admin", filters],
    queryFn: () => getAllCarsAdmin(filters),
  });
};

// Get single car
export const useCar = (id) => {
  return useQuery({
    queryKey: ["car", id],
    queryFn: () => getCarById(id),
    enabled: !!id,
  });
};

// Create car mutation
export const useCreateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["cars-admin"] });
    },
  });
};

// Update car mutation
export const useUpdateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateCarById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["cars-admin"] });
      queryClient.invalidateQueries({ queryKey: ["car"] });
    },
  });
};

// Delete car mutation
export const useDeleteCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCarById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["cars-admin"] });
    },
  });
};

// Activate car mutation
export const useActivateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateCarById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["cars-admin"] });
      queryClient.invalidateQueries({ queryKey: ["car"] });
    },
  });
};

// Deactivate car mutation
export const useDeactivateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateCarById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["cars-admin"] });
      queryClient.invalidateQueries({ queryKey: ["car"] });
    },
  });
};

// Import cars mutation
export const useImportCars = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importCars,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["cars-admin"] });
    },
  });
};
