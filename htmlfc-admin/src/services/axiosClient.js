import axios from "axios";
import { refreshToken } from "./api";

const axiosClient = axios.create({
    baseURL: "http://35.247.156.29:8080/api/v1",
    headers: {
        Accept: "application/json",
    },
});

// Tự động thêm token vào mỗi request nếu có
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Làm mới token nếu gặp lỗi 401
axiosClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // ✅ KHÔNG tự động refresh nếu chính request đó là /refresh-token
    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const { accessToken } = await refreshToken();

        if (localStorage.getItem("accessToken")) {
          localStorage.setItem("accessToken", accessToken);
        } else {
          sessionStorage.setItem("accessToken", accessToken);
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");

        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default axiosClient;
