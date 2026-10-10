import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Category, Task, TaskFilter, TaskFormData } from '../types/task';
import { supabaseTaskService } from '../services/supabaseService';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './useAuth';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'TODAS'>('TODAS');

  const isSupabase = supabaseTaskService.isConfigured();

  const loadTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await supabaseTaskService.getTasks(user.id);
      setTasks(data);
    } catch (err) {
      console.error('Falha ao carregar tarefas do usuário:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Inscrição em tempo real no Supabase Realtime para as tarefas do usuário autenticado
  useEffect(() => {
    const client = supabase;
    if (!isSupabase || !client || !user) return;

    const channel = client
      .channel(`tasks-realtime-${user.id}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          try {
            const freshData = await supabaseTaskService.getTasks(user.id);
            setTasks(freshData);
          } catch (error) {
            console.error('Erro na atualização em tempo real:', error);
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [isSupabase, user]);

  const addTask = async (data: TaskFormData) => {
    if (!user) throw new Error('Usuário não autenticado.');
    const created = await supabaseTaskService.createTask(data, user.id);
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === created.id);
      if (exists) return prev;
      return [created, ...prev];
    });
    return created;
  };

  const editTask = async (id: string, data: Partial<Task>) => {
    const updated = await supabaseTaskService.updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const removeTask = async (id: string) => {
    await supabaseTaskService.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTaskComplete = async (id: string) => {
    const updated = await supabaseTaskService.toggleComplete(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  // Filtragem combinada (Estado, Categoria e Busca textual)
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filtro de status
      if (filter === 'PENDENTES' && task.completed) return false;
      if (filter === 'CONCLUIDAS' && !task.completed) return false;

      // Filtro de categoria
      if (selectedCategory !== 'TODAS' && task.category !== selectedCategory) {
        return false;
      }

      // Filtro de busca textual
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchDesc = task.description?.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc) return false;
      }

      return true;
    });
  }, [tasks, filter, selectedCategory, searchQuery]);

  // Estatísticas e Métricas para Análises e Header
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const todayStr = new Date().toISOString().split('T')[0];
    const overdue = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < todayStr).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const byCategory: Record<Category, number> = {
      TRABALHO: 0,
      PESSOAL: 0,
      ESTUDO: 0,
      OUTROS: 0,
    };

    const byPriority: Record<'ALTA' | 'MÉDIA' | 'BAIXA', number> = {
      ALTA: 0,
      MÉDIA: 0,
      BAIXA: 0,
    };

    tasks.forEach((t) => {
      if (byCategory[t.category] !== undefined) {
        byCategory[t.category]++;
      }
      if (byPriority[t.priority] !== undefined) {
        byPriority[t.priority]++;
      }
    });

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate,
      byCategory,
      byPriority,
    };
  }, [tasks]);

  return {
    tasks,
    loading,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredTasks,
    addTask,
    editTask,
    removeTask,
    toggleTaskComplete,
    stats,
    isSupabase,
    refreshTasks: loadTasks,
  };
}
