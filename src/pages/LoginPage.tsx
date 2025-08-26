// src/pages/LoginPage.tsx
import { LoginForm } from "../components/LoginForm"; // 從 components 資料夾匯入 LoginForm

// 使用具名匯出 (named export)
export function LoginPage() {
  return (
    <div className="login-page-container">
      {/* 可以在這裡添加一些頁面特有的內容，例如標題或 Logo */}
      <h1 className="page-title">歡迎登入我們的服務</h1>

      {/* 嵌入 LoginForm 元件 */}
      <LoginForm />
    </div>
  );
}
