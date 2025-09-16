// src/api/apiClient.ts

import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

// 接下來的程式碼保持不變
const apiClient: AxiosInstance = axios.create({
  // baseURL: '/api',
  baseURL: 'http://localhost:8080/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');

    // **Solution:** Check if headers exist before trying to modify them
    if (token && config.headers) {
      // Add the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('發送請求：', config.url);
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('接收到回應：', response.status);
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default apiClient;