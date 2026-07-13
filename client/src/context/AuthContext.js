// AuthContext.js

import React, { createContext, useContext, useEffect, useState } from "react";
import { login as loginAPI, register as registerAPI } from "../services/auth";

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
      const res = await loginAPI(userData); // use your wrapper
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
      await registerAPI(userData); // use your wrapper
      return { success: true };
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

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
