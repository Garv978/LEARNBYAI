import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  withCredentials: true,
});

let csrfToken = null;

// ====================
// Get CSRF Token
// ====================

const getCsrfToken = async () => {
  if (csrfToken) {
    return csrfToken;
  }

  const response = await API.get("/csrf-token");

  csrfToken = response.data.csrfToken;

  return csrfToken;
};

// ====================
// Request Interceptor
// ====================

API.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const method = config.method?.toUpperCase();

    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      const token = await getCsrfToken();

      config.headers["X-CSRF-Token"] = token;
    }

    return config;
  },
  (error) => { throw error;}
);

// ====================
// Response Interceptor
// ====================

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;

      try {
        const res = await API.post("/auth/refresh");

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");

        window.location.href = "/login";

        return refreshError
      }
    }

    return error;
  }
);

export default API;