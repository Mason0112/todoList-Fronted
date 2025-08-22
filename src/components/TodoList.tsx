import { TodoItem } from './TodoItem'; // 引入新的 TodoItem 元件
import type { Todo } from '../types/task';
import '../css/TodoList.css';

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: number) => void;
}

export function TodoList({ todos, onToggleComplete }: TodoListProps) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem 
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </ul>
  );
}