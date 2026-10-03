import type { Task, TaskFormData } from '../types/task';

export interface TaskRepository {
  getTasks(): Promise<Task[]>;
  createTask(data: TaskFormData): Promise<Task>;
  updateTask(id: string, data: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  toggleComplete(id: string): Promise<Task>;
}
