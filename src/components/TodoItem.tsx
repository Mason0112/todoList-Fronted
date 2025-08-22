import type { Todo } from '../types/task';
import '../css/TodoItem.css'; // 新增 TodoItem 的專屬樣式

// 定義 TodoItem 元件的 props 型別
interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number) => void;
}

export function TodoItem({ todo, onToggleComplete }: TodoItemProps) {
  return (
    <li
      key={todo.id}
      onClick={() => onToggleComplete(todo.id)}
      style={{ cursor: 'pointer' }}
    >
      {/* 判斷是否完成，決定是否顯示打勾的框框 */}
      <input
        type="checkbox"
        checked={todo.completed}
        // 阻止點擊 checkbox 時觸發 li 的 onClick 事件
        onClick={(e) => e.stopPropagation()}
        readOnly // 設定 readOnly 避免 React 報錯
      />
      
      {/* 根據 completed 狀態改變文字樣式 */}
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.task}
      </span>
      <span> ({todo.completed ? '已完成' : '未完成'})</span>
    </li>
  );
}