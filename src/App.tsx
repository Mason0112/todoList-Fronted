import { Routes, Route, Link } from 'react-router-dom'; // 匯入路由元件
import { TodoListPage } from './pages/TodoListPage';
import { AddTodoPage } from './pages/AddTodoPage';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* 導航列 */}
      <nav>
        <Link to="/">任務列表</Link> | <Link to="/add">新增任務</Link>
      </nav>

      {/* 定義路由規則 */}
      <Routes>
        {/* 當 URL 為 "/" 時，渲染 TodoListPage */}
        <Route path="/" element={<TodoListPage />} />
        
        {/* 當 URL 為 "/add" 時，渲染 AddTodoPage */}
        <Route path="/add" element={<AddTodoPage />} />
      </Routes>
    </div>
  );
}

export default App;