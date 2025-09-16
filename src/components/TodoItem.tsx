import type { Todo } from '../types/Task';
import '../css/TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onToggleComplete, onDelete }: TodoItemProps) {
  return (
    <li
      key={todo.id}
      onClick={() => onToggleComplete(todo.id)}
      style={{ cursor: 'pointer' }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onClick={(e) => e.stopPropagation()}
        readOnly
      />
      
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.task}
      </span>
      <span> ({todo.completed ? '已完成' : '未完成'})</span>
      <button
        onClick={(e) => {
          e.stopPropagation(); // 阻止事件冒泡，避免觸發 li 的 onClick
          onDelete(todo.id);
        }}
        style={{ marginLeft: '10px' }}
      >
        刪除
      </button>
    </li>
  );
}