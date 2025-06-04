import axios from "./axios";

// Create new order
export const createOrder = async (cartItems) => {
  const carIds = cartItems.map((item) => item.id);
  const response = await axios.post("/orders", { carIds });
  return response.data;
};

// Get order by ID
export const getOrderById = async (id) => {
  const response = await axios.get(`/orders/${id}`);
  return response.data;
};

// Get current user orders
export const getMyOrders = async () => {
  const response = await axios.get("/orders/my/orders");
  return response.data;
};

// Update order status (admin only)
export const updateOrderStatus = async (id, data) => {
  const response = await axios.patch(`/orders/${id}/status`, data);
  return response.data;
};

// Upload payment slip
export const uploadPaymentSlip = async (id, paymentData) => {
  const response = await axios.post(`/orders/${id}/upload-payment`, paymentData);
  return response.data;
};

// Remove item from order (admin only)
export const removeOrderItem = async (id, itemId) => {
  const response = await axios.delete(`/orders/${id}/items/${itemId}`);
  return response.data;
};

// Get all orders (admin only)
export const getAllOrdersAdmin = async () => {
  const response = await axios.get("/orders/admin/all");
  return response.data;
};

// Get order statistics (admin only)
export const getOrderStats = async () => {
  const response = await axios.get("/orders/admin/stats");
  return response.data;
};
