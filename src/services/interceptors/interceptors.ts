import { useToastStore } from "@/stores/toast";
import axios from "axios";
import router from "@/router";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
});

api.interceptors.request.use(
  (config: any) => {
    const token: string = localStorage.getItem("access_token") || "";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response.status === 401) {
      useToastStore().showError("Vui lòng đăng nhập");
      localStorage.removeItem("access_token");
      router.push("/sign-in");
    } else {
      useToastStore().showError(error.response.data.result.message);
    }
    return Promise.reject(error);
  }
);

export default api;
