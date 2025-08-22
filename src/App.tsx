import { useState, useEffect } from 'react';
import axios from 'axios'; // 匯入 axios 函式庫
import type { Todo } from './types/task'; 
import './App.css'; 

function App() {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 請將這裡的網址替換成你的 Kotlin 後端 API 網址
    const backendUrl = 'http://localhost:8080/api/todos'; 

    const fetchTasks = async () => {
      try {
        // 使用 axios.get() 發送 GET 請求
        const response = await axios.get<Todo[]>(backendUrl);
        
        // Axios 自動將 JSON 資料放在 response.data 屬性中
        // TypeScript 也會根據泛型 <Task[]> 自動推斷型別
        setTasks(response.data);
      } catch (e) {
        // Axios 的錯誤處理也更方便
        setError((e as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []); // 空陣列表示這個 Effect 只會在元件第一次渲染時執行一次

  if (isLoading) {
    return <div>載入中...</div>;
  }

  if (error) {
    return <div>載入失敗: {error}</div>;
  }

  return (
    <div className="App">
      <h1>我的任務列表</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.task}
            </span>
            <span> ({task.completed ? '已完成' : '未完成'})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;