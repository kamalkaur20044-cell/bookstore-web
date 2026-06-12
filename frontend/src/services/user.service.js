import api from "./api";

// Get all users (Admin only) — JWT sent automatically via interceptor
export const getAllUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};
