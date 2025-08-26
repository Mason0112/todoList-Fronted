// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import apiClient from '../apiClient'; // The parent now imports and uses apiClient
import axios from 'axios';
import { type LoginRequest, type LoginResponse } from '../types/user';

export function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // This function will be passed to the child component
  const handleLogin = async (formData: LoginRequest) => {
    setError(null);
    setLoading(true);

    try {
      // Perform the API call in the parent component
      const response = await apiClient.post<LoginResponse>("/auth/login", formData);
      
      const token = response.data.token;
      if (token) {
        localStorage.setItem("authToken", token);
        // Handle redirect logic here
        console.log("登入成功！Token 已儲存:", token);
        // window.location.href = "/dashboard"; // Example redirect
      } else {
        setError("登入失敗：未取得 token。");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || err.message || "發生未知錯誤";
        setError(`登入失敗：${errorMessage}`);
        console.error("登入錯誤:", err);
      } else {
        setError("發生未知錯誤，可能為網路問題");
        console.error("非 Axios 錯誤:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <h1 className="page-title">使用者登入</h1>
      {/* Pass the handler function and state to the child as props */}
      <LoginForm onLogin={handleLogin} loading={loading} error={error} />
    </div>
  );
}