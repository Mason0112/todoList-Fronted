import { useState, useEffect } from "react";
import type { Todo } from "../types/Task";
import { TodoList } from "../components/TodoList";
import apiClient from '../apiClient';

export function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 請將這裡的網址替換成你的 Kotlin 後端 API 網址
    const backendUrl = "/todos";

    const fetchTasks = async () => {
      try {
        // 使用 axios.get() 發送 GET 請求
        const response = await apiClient.get(backendUrl);

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
    const todoToUpdate = todos.find((todo) => todo.id === id);
    if (!todoToUpdate) return;

    // 建立一個新物件，包含更新後的 completed 狀態
    const updatedTodo = {
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    };

    try {
      // 1. 發送 PUT 請求到後端，更新任務
      // 請將這裡的網址替換成你的後端 PUT/PATCH API 端點
      await apiClient.put(`/todos/${id}`, updatedTodo);

      // 2. 如果請求成功，才更新前端狀態
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (e) {
      // 3. 如果請求失敗，顯示錯誤訊息
      setError((e as Error).message);
      // 或者：回退前端狀態，讓使用者知道更新失敗
      // setTodos(todos);
    }
  };
  const handelDelete = async (id: number) => {
    try {
       
        await apiClient.delete(`/todos/${id}`);
        setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
         setError((error as Error).message);
    }
  };
  if (isLoading) {
    return <div>載入中...</div>;
  }
  if (error) {
    return <div>載入失敗: {error}</div>;
  }

  return (
    <div>
      <h1>我的任務列表</h1>
      <TodoList
        todos={todos}
        onToggleComplete={handleToggleComplete}
        onDelete={handelDelete}
      />
    </div>
  );
}
