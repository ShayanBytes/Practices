
// hooks/useTodos.ts

import useSWR from 'swr';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../lib/db';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export const useTodos = () => {
  const { data: todos, error, mutate } = useSWR<Todo[]>('todos', getTodos);

  const add = async (text: string) => {
    const newTodo = { id: String(Date.now()), text, completed: false };
    await mutate(addTodo(text), { optimisticData: [...(todos || []), newTodo], rollbackOnError: true });
  };

  const update = async (id: string, updates: Partial<Todo>) => {
    const updatedTodo = todos?.find(todo => todo.id === id);
    if (!updatedTodo) return;

    const newTodos = todos?.map(todo =>
      todo.id === id ? { ...todo, ...updates } : todo
    );

    await mutate(updateTodo(id, updates), { optimisticData: newTodos, rollbackOnError: true });
  };

  const remove = async (id: string) => {
    const newTodos = todos?.filter(todo => todo.id !== id);
    await mutate(deleteTodo(id), { optimisticData: newTodos, rollbackOnError: true });
  };

  return {
    todos,
    error,
    add,
    update,
    remove,
    isLoading: !todos && !error,
  };
};
