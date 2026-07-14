// AuthContext.js

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginAPI,
  refresh as refreshAPI,
  register as registerAPI,
  verifyEmail as verifyEmailAPI,
} from "../services/AuthServices";

import {jwtDecode} from "jwt-decode";

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
        message: "Registration successful. Please check your email to verify your account.",
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setIsAuthenticated(false);
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
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
