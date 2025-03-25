import axios from "axios";
import Cookies from "js-cookie";


export const BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "https://paycollection.onrender.com/api/v1";

    // import.meta.env.VITE_API_BASE_URL || "https://api.neo2.tecnavis.com/api/v1";
    // import.meta.env.VITE_API_BASE_URL || " http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const handleLogout = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  window.location.href = "/login2";
};

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = Cookies.get("refresh_token");
      if (!refreshToken) {
        console.log("No refresh token found, logging out...");
        handleLogout();
        return Promise.reject(error);
      }
      try {
        const refreshResponse = await axios.post(`${BASE_URL}/token/users/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = refreshResponse.data.access;
        Cookies.set("access_token", newAccessToken, {
          expires: 1,
          secure: window.location.protocol === "https:", // Use secure cookies only in HTTPS
          sameSite: "Strict",
        });

        const originalRequest = { ...error.config };
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.log("Token refresh failed, logging out...");
        handleLogout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
