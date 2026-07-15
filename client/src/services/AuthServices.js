import API from "../api";

export const register = (userData) => {
  return API.post("/auth/register", userData);
};

export const login = (userData) => {
  return API.post("/auth/login", userData);
};

export const logout = () => {
  return API.delete("/auth/logout"); // backend clears cookies + invalidates refresh token
};

export const refresh = () => {
  return API.post("/auth/refresh"); // no body needed, cookie is sent automatically
};

export const verifyEmail = (userData) => {
  return API.post("/auth/verify-email", userData);
};

export const resendVerifyEmail = (userData) => {
  return API.post("/auth/resend-verify-email", userData);
}

export const forgotPassword = async (userData) => {
  const res = await API.post("/auth/forgot-password", userData);
  return res.data;
};

export const resetPassword = async (userData) => {
  const res = await API.post("/auth/reset-password", userData);
  return res.data;
};

