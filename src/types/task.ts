export interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

// 建立一個新的介面，它包含 Todo 的所有屬性，但移除了 'id'
export type NewTodo = Omit<Todo, 'id'>;