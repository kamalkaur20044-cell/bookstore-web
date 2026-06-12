import api from "./api";

export const placeOrder = async (data) => {
  const res = await api.post("/orders", data);
  return res.data;
};

export const getOrders = async (userId) => {
  const res = await api.get(`/orders/user/${userId}`);
  return res.data;
};

// Get all orders (Admin only) — JWT sent automatically via interceptor
export const getAllOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};
