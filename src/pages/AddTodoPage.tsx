import { useState } from "react";
import type { NewTodo } from "../types/task";
import { useNavigate } from "react-router-dom"; // 匯入 useNavigate
import apiClient from '../apiClient';

export function AddTodoPage() {
  const [newTask, setNewTask] = useState("");
  const navigate = useNavigate(); // 取得 navigate 函式

  const handleAdd = async () => {
    // 檢查輸入框是否為空字串或只有空白
    if (newTask.trim() === "") {
      console.log("請輸入任務內容");
      return; // 如果為空，則終止函式
    }

    // 建立一個符合 NewTodo 型別的物件
    const newTodo: NewTodo = {
      task: newTask,
      completed: false,
    };

    try {
      // 1. 將 newTodo 物件作為第二個參數傳送給 axios.post
      await apiClient.post("/todos", newTodo);

      // 2. 如果請求成功，清空輸入框
      setNewTask("");
      // 使用 navigate 函式跳轉到主頁
      navigate("/");

      // 3. 在這裡，你可以導航回主頁或顯示成功訊息
      console.log("任務新增成功！");
    } catch (error) {
      // 如果請求失敗，印出錯誤訊息
      console.error("任務新增失敗：", error);
      // 未來你可以在這裡用 useState 顯示錯誤訊息給使用者
    }
  };

  return (
    <div>
      <h1>新增任務</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={handleAdd}>新增</button>
    </div>
  );
}
