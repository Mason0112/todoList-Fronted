// src/components/RegisterForm.tsx

import React, { useState } from 'react';
import type { CreateUser } from '../types/user'; // 假設你的 types.ts 檔案在這裡
import '../css/RegisterForm.css';



// 定義 props 的類型
interface RegisterFormProps {
  onRegister: (formData: CreateUser) => void;
}

export function RegisterForm({ onRegister }: RegisterFormProps) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('密碼和確認密碼不相符！');
      return;
    }

    if (!userName || !password) {
      setError('帳號和密碼不能為空！');
      return;
    }

    setError(''); // 清除錯誤訊息

    // 這裡我們直接將 userName 和 password 組合成一個符合 CreateUsers 類型的物件
    const formData: CreateUser = { userName, password };

    onRegister(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {error && <p className="error-message">{error}</p>}
      <div className="input-group">
        <label htmlFor="userName" className="input-label">帳號：</label>
        <input
          type="text"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="input-field"
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="password" className="input-label">密碼：</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="confirmPassword" className="input-label">確認密碼：</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input-field"
          required
        />
      </div>
      <button type="submit" className="submit-button">註冊</button>
    </form>
  );
};

