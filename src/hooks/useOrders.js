

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addPaymentToOrder,
  createOrder,
  getAllOrdersAdmin,
  getMyOrders,
  getOrderById,
  getOrderStats,
  getPaymentDetails,
  getPaymentsForOrder,
  getPendingPayments,
  removeOrderItem,
  updateOrderStatus,
  uploadPaymentSlip,
  verifyPayment,
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



// Add a payment to an order
export const useAddPaymentToOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, paymentData }) =>
      addPaymentToOrder(orderId, paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
  });
};

// Get all payments for an order
export const useOrderPayments = (orderId) => {
  return useQuery({
    queryKey: ["order-payments", orderId],
    queryFn: () => getPaymentsForOrder(orderId),
    enabled: !!orderId,
  });
};

// Verify a payment (admin only)
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-payments"] });
    },
  });
};

// Get payment transaction details
export const usePaymentDetails = (paymentId) => {
  return useQuery({
    queryKey: ["payment-details", paymentId],
    queryFn: () => getPaymentDetails(paymentId),
    enabled: !!paymentId,
  });
};

// Get all pending payments (admin only)
export const usePendingPayments = () => {
  return useQuery({
    queryKey: ["pending-payments"],
    queryFn: getPendingPayments,
  });
};