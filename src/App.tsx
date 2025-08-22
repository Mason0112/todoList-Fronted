import { useState, useEffect } from "react";
import axios from "axios"; // 匯入 axios 函式庫
import type { Todo } from "./types/task";
import "./App.css";
import { TodoList } from "./components/TodoList";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 請將這裡的網址替換成你的 Kotlin 後端 API 網址
    const backendUrl = "http://localhost:8080/api/todos";

    const fetchTasks = async () => {
      try {
        // 使用 axios.get() 發送 GET 請求
        const response = await axios.get<Todo[]>(backendUrl);

        // Axios 自動將 JSON 資料放在 response.data 屬性中
        // TypeScript 也會根據泛型 <Task[]> 自動推斷型別
        setTodos(response.data);
      } catch (e) {
        // Axios 的錯誤處理也更方便
        setError((e as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []); // 空陣列表示這個 Effect 只會在元件第一次渲染時執行一次


    // 修改 handleToggleComplete 函式，使其成為非同步
  const handleToggleComplete = async (id: number) => {
    // 找出要更新的任務
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate) return;

    // 建立一個新物件，包含更新後的 completed 狀態
    const updatedTodo = {
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    };

    try {
      // 1. 發送 PUT 請求到後端，更新任務
      // 請將這裡的網址替換成你的後端 PUT/PATCH API 端點
      await axios.put(`http://localhost:8080/api/todos/${id}`, updatedTodo);
      
      // 2. 如果請求成功，才更新前端狀態
      setTodos(
        todos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        )
      );
    } catch (e) {
      // 3. 如果請求失敗，顯示錯誤訊息
      setError((e as Error).message);
      // 或者：回退前端狀態，讓使用者知道更新失敗
      // setTodos(todos);
    }
  };

  if (isLoading) {
    return <div>載入中...</div>;
  }

  if (error) {
    return <div>載入失敗: {error}</div>;
  }

  return (
    <div className="App">
      <h1>我的任務列表</h1>
      <TodoList todos={todos} onToggleComplete={handleToggleComplete} />
    </div>
  );
}

export default App;
