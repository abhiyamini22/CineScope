import axios, { AxiosHeaders } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('cinescope-user-id');

  if (userId) {
    const headers = config.headers ?? new AxiosHeaders();
    headers.set('x-user-id', userId);
    config.headers = headers;
  }

  return config;
});

export default api;
