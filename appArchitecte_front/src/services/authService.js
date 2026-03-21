// src/services/authServices.js
import api from "./api";

export const registerUser = (userData) => {
  return api.post("/api/auth/register", userData);
};

export const loginUser = (credentials) => {
  return api.post("/api/auth/login", credentials);
};

export const forgotPassword = (data) => {
  return api.post("/api/auth/forgot-password", data);
};

export const resetPassword = (data) => {
  return api.post("/api/auth/reset-password", data);
};