// AuthContext.js

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  forgotPassword as forgotPasswordAPI,
  login as loginAPI,
  refresh as refreshAPI,
  register as registerAPI,
  resendVerifyEmail as resendVerifyEmailAPI,
  resetPassword as resetPasswordAPI,
  verifyEmail as verifyEmailAPI,
} from "../services/AuthServices";

import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        setUser(jwtDecode(token));
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("accessToken");
      }
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    try {
      const res = await loginAPI(userData);
      localStorage.setItem("accessToken", res.data.accessToken);
      setUser(jwtDecode(res.data.accessToken));
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      await registerAPI(userData);
      return {
        success: true,
        message:
          "Registration successful. Please check your email to verify your account.",
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

const logout = async () => {
  try {
    // Call backend logout to clear cookies + invalidate refresh token
    await API.post("/auth/logout");

    // Clear frontend state
    localStorage.removeItem("accessToken");
    setUser(null);
    setIsAuthenticated(false);
  } catch (err) {
    console.error("Logout failed:", err);
    // Still clear local state to force logout
    localStorage.removeItem("accessToken");
    setUser(null);
    setIsAuthenticated(false);
  }
};


  const verifyEmail = async (userData) => {
    try {
      await verifyEmailAPI(userData);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Verification failed",
      };
    }
  };
  const resendVerifyEmail = async (userData) => {
    try{
      await resendVerifyEmailAPI(userData);
      return { success: true, message: "Verification email resent" };
    }catch(err){
      return{
        success: false,
        message: err.response?.data?.message || "Resend verification email failed",
      }
    }
  }
  const refresh = async () => {
    try {
      const res = await refreshAPI(); // no userData needed, backend uses cookies
      localStorage.setItem("accessToken", res.data.accessToken);
      setUser(jwtDecode(res.data.accessToken));
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Refresh failed",
      };
    }
  };
  const forgotPassword = async (userData) => {
    try {
      const res = await forgotPasswordAPI(userData);
      return {
        success: true,
        message: res.data.message || "Check your email for reset link",
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to send reset email",
      };
    }
  };
  const resetPassword = async (userData) => {
    try {
      const res = await resetPasswordAPI(userData);
      return {
        success: true,
        message: res.data.message || "Password reset successful",
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Password reset failed",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        verifyEmail,
        resendVerifyEmail,
        refresh,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
