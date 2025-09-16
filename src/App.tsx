import { Routes, Route, Link } from "react-router-dom"; // 匯入路由元件
import { TodoListPage } from "./pages/TodoListPage";
import { AddTodoPage } from "./pages/AddTodoPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { ChatRoomPage } from "./pages/ChatRoomPage";
import "./App.css";

function App() {
  return (
    <div className="App">
      {/* 導航列 */}
      <nav>
        <Link to="/todoListPage">任務列表</Link> |{" "}
        <Link to="/add">新增任務</Link> | <Link to="/register">註冊</Link>|
        <Link to="/">登入</Link> | <Link to="/chat">聊天室</Link>
      </nav>

      {/* 定義路由規則 */}
      <Routes>
        {/* 當 URL 為 "/" 時，渲染 TodoListPage */}
        <Route path="/todoListPage" element={<TodoListPage />} />
        {/* 當 URL 為 "/chat" 時，渲染 ChatRoomPage */}
        <Route path="/chat" element={<ChatRoomPage />} />

        {/* 當 URL 為 "/add" 時，渲染 AddTodoPage */}
        <Route path="/add" element={<AddTodoPage />} />
        {/* 當 URL 為 "/register" 時，渲染 RegisterPage */}
        <Route path="/register" element={<RegisterPage />} />
        {/* 當 URL 為 "/login" 時，渲染 loginPage */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
