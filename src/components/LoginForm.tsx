// src/components/LoginForm.tsx

import React, { useState, type FormEvent } from "react";
import apiClient from "../apiClient"; // 假設路徑是這個
import axios from "axios";
import type { LoginRequest } from "../types/user"; // 假設你的型別檔路徑是這個

export function LoginForm() {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError(null);
    setSuccess(null);
    setLoading(true);
    console.log(userName, password);

    try {
      // 1. 創建一個符合 LoginRequest 型別的物件
      const loginRequestData: LoginRequest = {
        userName: userName,
        password: password,
      };

      // 2. 將這個物件傳入 apiClient.post 的第二個參數
      const response = await apiClient.post("/auth/login", loginRequestData);

      const token = response.data.token;
      if (token) {
        localStorage.setItem("authToken", token);
        setSuccess("登入成功！正在重新導向...");
        console.log("Token 已儲存:", token);
      } else {
        setError("登入失敗：未取得 token。");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || err.message || "發生未知錯誤";
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
    <div className="login-container">
      <h2 className="login-title">使用者登入</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            使用者名稱：
          </label>
          <input
            type="text"
            id="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            密碼：
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "登入中..." : "登入"}
        </button>
      </form>

      {error && <p className="message-error">{error}</p>}
      {success && <p className="message-success">{success}</p>}
    </div>
  );
}