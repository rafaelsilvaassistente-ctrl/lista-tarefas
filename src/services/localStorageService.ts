import type { Task, TaskFormData } from '../types/task';
import type { TaskRepository } from './taskRepository';
import { INITIAL_TASKS } from '../utils/constants';

export class LocalStorageTaskService implements TaskRepository {
  private getStorageKey(userId?: string): string {
    return `taskflow_tasks_${userId || 'default'}`;
  }

  async getTasks(userId?: string): Promise<Task[]> {
    try {
      const key = this.getStorageKey(userId);
      const data = localStorage.getItem(key);
      if (!data) {
        // Inicializa com dados de demonstração apenas para o usuário padrão
        if (!userId || userId === 'default') {
          localStorage.setItem(key, JSON.stringify(INITIAL_TASKS));
          return [...INITIAL_TASKS];
        }
        return [];
      }
      return JSON.parse(data) as Task[];
    } catch (error) {
      console.error('Erro ao recuperar tarefas do LocalStorage:', error);
      return [];
    }
  }

  async createTask(data: TaskFormData, userId?: string): Promise<Task> {
    const tasks = await this.getTasks(userId);
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
    this.save(updatedTasks, userId);
    return newTask;
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    // Procura em todas as chaves se necessário
    const key = Object.keys(localStorage).find(k => k.startsWith('taskflow_tasks_')) || this.getStorageKey();
    const dataStr = localStorage.getItem(key);
    const tasks: Task[] = dataStr ? JSON.parse(dataStr) : [];
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Tarefa com id "${id}" não encontrada.`);
    }

    const updatedTask = { ...tasks[index], ...data };
    tasks[index] = updatedTask;
    localStorage.setItem(key, JSON.stringify(tasks));
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const key = Object.keys(localStorage).find(k => k.startsWith('taskflow_tasks_')) || this.getStorageKey();
    const dataStr = localStorage.getItem(key);
    const tasks: Task[] = dataStr ? JSON.parse(dataStr) : [];
    const filtered = tasks.filter((t) => t.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
  }

  async toggleComplete(id: string): Promise<Task> {
    const key = Object.keys(localStorage).find(k => k.startsWith('taskflow_tasks_')) || this.getStorageKey();
    const dataStr = localStorage.getItem(key);
    const tasks: Task[] = dataStr ? JSON.parse(dataStr) : [];
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Tarefa com id "${id}" não encontrada.`);
    }

    const updatedTask = {
      ...tasks[index],
      completed: !tasks[index].completed,
    };
    tasks[index] = updatedTask;
    localStorage.setItem(key, JSON.stringify(tasks));
    return updatedTask;
  }

  private save(tasks: Task[], userId?: string): void {
    try {
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(tasks));
    } catch (error) {
      console.error('Erro ao salvar tarefas no LocalStorage:', error);
    }
  }
}

export const taskStorageService = new LocalStorageTaskService();
