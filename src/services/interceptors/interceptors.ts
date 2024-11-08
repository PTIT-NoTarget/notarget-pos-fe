import { useToastStore } from '@/stores/toast'
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
});

api.interceptors.request.use(
  (config: any) => {
    const token: string = localStorage.getItem('access_token') || '';
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
    useToastStore().showError(error.response.data.result.message);
    return Promise.reject(error);
  }
);

export default api;
