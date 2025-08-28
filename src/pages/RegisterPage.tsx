import React, { useState } from 'react';
import { RegisterForm } from '../components/RegisterForm'; // 匯入 RegisterForm
import apiClient from '../apiClient'; // 匯入 Axios 實例
import axios from 'axios';
import { type CreateUser } from '../types/user'; // 匯入型別
import { useNavigate } from "react-router-dom"; // 匯入 useNavigate


export function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // 取得 navigate 函式

  // 處理來自 RegisterForm 的註冊邏輯
  const handleRegister = async (formData: CreateUser) => {
    // 重置狀態
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      // 使用 apiClient 發送 POST 請求
      const response = await apiClient.post('/auth/register', formData);
      setSuccess('註冊成功！您現在可以登入了。');
      console.log('註冊成功:', response.data);

      navigate("/");

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // 從後端回傳的錯誤中取得訊息
        const errorMessage = err.response?.data?.message || err.message || '發生未知錯誤';
        setError(`註冊失敗：${errorMessage}`);
        console.error('註冊錯誤:', err);
      } else {
        // 處理非 Axios 的錯誤
        setError('發生未知錯誤，可能為網路問題');
        console.error('非 Axios 錯誤:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-container">
      <h1 className="page-title">加入我們</h1>
      <p className="loading-message">{loading ? '註冊中...' : ''}</p>
      
      {/* 傳遞 onRegister 處理函式給子元件 */}
      <RegisterForm onRegister={handleRegister} />

      {/* 根據狀態顯示訊息 */}
      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message-page">{error}</p>}
    </div>
  );
}