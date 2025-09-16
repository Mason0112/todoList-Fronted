import { TodoItem } from './TodoItem'; // 引入新的 TodoItem 元件
import type { Todo } from '../types/Task';
import '../css/TodoList.css';

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TodoList({ todos, onToggleComplete, onDelete }: TodoListProps) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem 
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}