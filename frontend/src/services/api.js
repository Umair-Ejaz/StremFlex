import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend returns a Zod validation error array
    if (error.response?.status === 400 && error.response.data?.errors) {
      const fieldErrors = {};
      error.response.data.errors.forEach((err) => {
        fieldErrors[err.field] = err.message;
      });
      error.fieldErrors = fieldErrors;
    }
    return Promise.reject(error);
  }
);

export default API;