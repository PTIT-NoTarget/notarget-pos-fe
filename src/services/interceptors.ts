import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
});

api.interceptors.request.use(
  (config: any) => {
    const token : string = localStorage.getItem('token') || '';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error : any) => Promise.reject(error)
);

api.interceptors.response.use(
  (response : any) => response,
  (error : any) => {
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          console.error('Unauthorized! Redirecting to login...');
          break;
        case 500:
          console.error('Server error, please try again later.');
          break;
        default:
          console.error('An error occurred:', error.message);
      }
    } else {
      console.error('Network error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
