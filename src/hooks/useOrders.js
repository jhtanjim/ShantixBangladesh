

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrder,
  getAllOrdersAdmin,
  getMyOrders,
  getOrderById,
  getOrderStats,
  removeOrderItem,
  updateOrderStatus,
  uploadPaymentSlip,
} from "../api/order";

// Create new order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
  });
};

// Get order by ID
export const useOrder = (orderId) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });
};

// Get current user orders
export const useMyOrders = () => {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
  });
};

// Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, statusData }) =>
      updateOrderStatus(orderId, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders-admin"] });
    },
  });
};

// Upload payment
export const useUploadPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, paymentData }) =>
      uploadPaymentSlip(orderId, paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
  });
};

// Remove item from order
export const useRemoveOrderItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, itemId }) =>
      removeOrderItem(orderId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["orders-admin"] });
    },
  });
};

// Get all orders (Admin)
export const useAllOrders = () => {
  return useQuery({
    queryKey: ["orders-admin"],
    queryFn: getAllOrdersAdmin,
  });
};

// Get order statistics (Admin)
export const useOrderStats = () => {
  return useQuery({
    queryKey: ["order-stats"],
    queryFn: getOrderStats,
  });
};
