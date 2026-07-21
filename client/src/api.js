import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  withCredentials: true, // Sends refresh token cookie automatically
});

// ====================
// Request Interceptor
// ====================
API.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ====================
// Response Interceptor
// ====================
API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Don't refresh twice
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;

      try {
        // Refresh access token
        const res = await API.post("/auth/refresh");

        const newAccessToken = res.data.accessToken;

        // Save new access token
        localStorage.setItem("accessToken", newAccessToken);

        // Update header for the failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry original request
        return API(originalRequest);
      } catch (refreshError) {
        // Refresh token is also invalid
        localStorage.removeItem("accessToken");

        // Redirect to login
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;