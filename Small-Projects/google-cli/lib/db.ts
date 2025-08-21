
// lib/db.ts (Mock JSON Database)

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

let todos: Todo[] = [
  { id: "1", text: "Learn Next.js", completed: false },
  { id: "2", text: "Build a Todo App", completed: false },
];

export const getTodos = async (): Promise<Todo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(todos), 200);
  });
};

export const addTodo = async (text: string): Promise<Todo> => {
  return new Promise((resolve) => {
    const newTodo: Todo = { id: String(todos.length + 1), text, completed: false };
    todos.push(newTodo);
    setTimeout(() => resolve(newTodo), 200);
  });
};

export const updateTodo = async (id: string, updates: Partial<Todo>): Promise<Todo | null> => {
  return new Promise((resolve) => {
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex > -1) {
      todos[todoIndex] = { ...todos[todoIndex], ...updates };
      setTimeout(() => resolve(todos[todoIndex]), 200);
    } else {
      setTimeout(() => resolve(null), 200);
    }
  });
};

export const deleteTodo = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const initialLength = todos.length;
    todos = todos.filter((todo) => todo.id !== id);
    setTimeout(() => resolve(todos.length < initialLength), 200);
  });
};
