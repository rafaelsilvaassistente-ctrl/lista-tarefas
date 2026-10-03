import type { Task, TaskFormData } from '../types/task';
import type { TaskRepository } from './taskRepository';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { taskStorageService } from './localStorageService';

interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  category: Task['category'];
  priority: Task['priority'];
  due_date: string;
  created_at: string;
}

function mapRowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    completed: row.completed,
    category: row.category,
    priority: row.priority,
    dueDate: row.due_date,
    createdAt: row.created_at,
  };
}

export class SupabaseTaskService implements TaskRepository {
  isConfigured(): boolean {
    return isSupabaseConfigured() && supabase !== null;
  }

  async getTasks(): Promise<Task[]> {
    if (!this.isConfigured() || !supabase) {
      console.warn('Supabase não configurado. Utilizando fallback LocalStorage.');
      return taskStorageService.getTasks();
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar tarefas no Supabase:', error.message);
      // Fallback para manter o app funcionando mesmo em caso de erro temporário
      return taskStorageService.getTasks();
    }

    return (data as TaskRow[]).map(mapRowToTask);
  }

  async createTask(data: TaskFormData): Promise<Task> {
    if (!this.isConfigured() || !supabase) {
      return taskStorageService.createTask(data);
    }

    const insertPayload = {
      title: data.title.trim(),
      description: data.description?.trim() || '',
      completed: false,
      category: data.category,
      priority: data.priority,
      due_date: data.dueDate,
    };

    const { data: createdRow, error } = await supabase
      .from('tasks')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar tarefa no Supabase:', error.message);
      throw new Error(`Erro ao salvar no Supabase: ${error.message}`);
    }

    const newTask = mapRowToTask(createdRow as TaskRow);

    // Mantém cópia local sincronizada para redundância
    try {
      const localTasks = await taskStorageService.getTasks();
      localStorage.setItem('taskflow_tasks_v1', JSON.stringify([newTask, ...localTasks]));
    } catch {
      // Ignora falhas secundárias de cache local
    }

    return newTask;
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    if (!this.isConfigured() || !supabase) {
      return taskStorageService.updateTask(id, data);
    }

    const updatePayload: Record<string, unknown> = {};
    if (data.title !== undefined) updatePayload.title = data.title.trim();
    if (data.description !== undefined) updatePayload.description = data.description.trim();
    if (data.completed !== undefined) updatePayload.completed = data.completed;
    if (data.category !== undefined) updatePayload.category = data.category;
    if (data.priority !== undefined) updatePayload.priority = data.priority;
    if (data.dueDate !== undefined) updatePayload.due_date = data.dueDate;

    const { data: updatedRow, error } = await supabase
      .from('tasks')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar tarefa no Supabase:', error.message);
      throw new Error(`Erro ao atualizar no Supabase: ${error.message}`);
    }

    return mapRowToTask(updatedRow as TaskRow);
  }

  async deleteTask(id: string): Promise<void> {
    if (!this.isConfigured() || !supabase) {
      return taskStorageService.deleteTask(id);
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir tarefa no Supabase:', error.message);
      throw new Error(`Erro ao excluir no Supabase: ${error.message}`);
    }
  }

  async toggleComplete(id: string): Promise<Task> {
    if (!this.isConfigured() || !supabase) {
      return taskStorageService.toggleComplete(id);
    }

    // Busca o estado atual para inverter
    const { data: current, error: fetchError } = await supabase
      .from('tasks')
      .select('completed')
      .eq('id', id)
      .single();

    if (fetchError || !current) {
      console.error('Erro ao buscar status da tarefa:', fetchError?.message);
      throw new Error('Tarefa não encontrada para alteração de status.');
    }

    const nextCompleted = !current.completed;

    const { data: updatedRow, error: updateError } = await supabase
      .from('tasks')
      .update({ completed: nextCompleted })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Erro ao alternar status no Supabase:', updateError.message);
      throw new Error(`Erro ao alternar status no Supabase: ${updateError.message}`);
    }

    return mapRowToTask(updatedRow as TaskRow);
  }
}

export const supabaseTaskService = new SupabaseTaskService();
