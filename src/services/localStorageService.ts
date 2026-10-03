import type { Task, TaskFormData } from '../types/task';
import type { TaskRepository } from './taskRepository';
import { INITIAL_TASKS } from '../utils/constants';

const STORAGE_KEY = 'taskflow_tasks_v1';

export class LocalStorageTaskService implements TaskRepository {
  async getTasks(): Promise<Task[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Inicializa com dados de demonstração amigáveis
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
        return [...INITIAL_TASKS];
      }
      return JSON.parse(data) as Task[];
    } catch (error) {
      console.error('Erro ao recuperar tarefas do LocalStorage:', error);
      return [];
    }
  }

  async createTask(data: TaskFormData): Promise<Task> {
    const tasks = await this.getTasks();
    const newTask: Task = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      title: data.title.trim(),
      description: data.description?.trim() || '',
      completed: false,
      category: data.category,
      priority: data.priority,
      dueDate: data.dueDate,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [newTask, ...tasks];
    this.save(updatedTasks);
    return newTask;
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Tarefa com id "${id}" não encontrada.`);
    }

    const updatedTask = { ...tasks[index], ...data };
    tasks[index] = updatedTask;
    this.save(tasks);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const tasks = await this.getTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    this.save(filtered);
  }

  async toggleComplete(id: string): Promise<Task> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Tarefa com id "${id}" não encontrada.`);
    }

    const updatedTask = {
      ...tasks[index],
      completed: !tasks[index].completed,
    };
    tasks[index] = updatedTask;
    this.save(tasks);
    return updatedTask;
  }

  private save(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Erro ao salvar tarefas no LocalStorage:', error);
    }
  }
}

export const taskStorageService = new LocalStorageTaskService();
