// src/components/LoginForm.tsx

import React, { useState, type FormEvent } from "react";
// Remove axios and apiClient imports
import type { LoginRequest } from "../types/user"; 

// Define the props this component expects
interface LoginFormProps {
  onLogin: (formData: LoginRequest) => void;
  // We can add props for loading and error states as well,
  // since the parent will now manage them.
  loading: boolean;
  error: string | null;
}

export function LoginForm({ onLogin, loading, error }: LoginFormProps) {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // Remove loading and error states from this component
  // We'll receive them from the parent as props

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    // Create the data object
    const loginRequestData: LoginRequest = {
      userName,
      password,
    };

    // Call the onLogin callback with the form data
    onLogin(loginRequestData);
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
          {/* Use the loading prop from the parent */}
          {loading ? "登入中..." : "登入"}
        </button>
      </form>

      {/* Use the error prop from the parent */}
      {error && <p className="message-error">{error}</p>}
      {/* Remove the success state since the parent will handle the redirect */}
    </div>
  );
}