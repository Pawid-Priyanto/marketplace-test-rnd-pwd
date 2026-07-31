import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const safeBaseURL = (apiUrl === 'undefined' || !apiUrl) ? '' : apiUrl;

export const apiClient = axios.create({
  baseURL: safeBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});