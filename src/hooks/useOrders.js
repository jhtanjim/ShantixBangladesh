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
    onError: (error) => {
      console.error("Create order error:", error);
    },
  });
};

// Get order by ID
export const useOrder = (orderId) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get current user orders
export const useMyOrders = () => {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
    retry: 3,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, statusData }) =>
      updateOrderStatus(orderId, statusData),
    onSuccess: (data, variables) => {
      // Invalidate multiple related queries
      queryClient.invalidateQueries({ queryKey: ["orders-admin"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-stats"] });
    },
    onError: (error) => {
      console.error("Update order status error:", error);
    },
  });
};

// Upload payment screenshot
export const useUploadPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, paymentData }) =>
      uploadPaymentSlip(orderId, paymentData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ["order-payments", variables.orderId] });
    },
    onError: (error) => {
      console.error("Upload payment error:", error);
    },
  });
};

// Remove item from order
export const useRemoveOrderItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, itemId }) =>
      removeOrderItem(orderId, itemId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders-admin"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
    onError: (error) => {
      console.error("Remove order item error:", error);
    },
  });
};

// Get all orders (Admin)
export const useAllOrders = () => {
  return useQuery({
    queryKey: ["orders-admin"],
    queryFn: getAllOrdersAdmin,
    retry: 3,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get order statistics (Admin)
export const useOrderStats = () => {
  return useQuery({
    queryKey: ["order-stats"],
    queryFn: getOrderStats,
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Add a payment to an order
export const useAddPaymentToOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, paymentData }) =>
      addPaymentToOrder(orderId, paymentData),
    onSuccess: (data, variables) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-payments", variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders-admin"] });
      queryClient.invalidateQueries({ queryKey: ["pending-payments"] });
    },
    onError: (error) => {
      console.error("Add payment error:", error);
    },
  });
};

// Get all payments for an order
export const useOrderPayments = (orderId) => {
  return useQuery({
    queryKey: ["order-payments", orderId],
    queryFn: () => getPaymentsForOrder(orderId),
    enabled: !!orderId,
    retry: 3,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Verify a payment (admin only)
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, verificationData }) =>
      verifyPayment(paymentId, verificationData),
    onSuccess: (data, variables) => {
      // Invalidate all payment-related queries
      queryClient.invalidateQueries({ queryKey: ["pending-payments"] });
      queryClient.invalidateQueries({ queryKey: ["orders-admin"] });
      queryClient.invalidateQueries({ queryKey: ["payment-details", variables.paymentId] });
      
      // Also invalidate order queries that might contain this payment
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
    onError: (error) => {
      console.error("Verify payment error:", error);
    },
  });
};

// Get payment transaction details
export const usePaymentDetails = (paymentId) => {
  return useQuery({
    queryKey: ["payment-details", paymentId],
    queryFn: () => getPaymentDetails(paymentId),
    enabled: !!paymentId,
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get all pending payments (admin only)
export const usePendingPayments = () => {
  return useQuery({
    queryKey: ["pending-payments"],
    queryFn: getPendingPayments,
    retry: 3,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
