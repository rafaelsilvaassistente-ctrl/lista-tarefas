import type { Category, CategoryConfig, Priority, PriorityConfig, Task } from '../types/task';

export const CATEGORIES: Record<Category, CategoryConfig> = {
  TRABALHO: {
    label: 'TRABALHO',
    bgLight: 'bg-blue-50',
    textDark: 'text-blue-700',
    border: 'border-blue-200',
    dotColor: 'bg-blue-500',
  },
  PESSOAL: {
    label: 'PESSOAL',
    bgLight: 'bg-emerald-50',
    textDark: 'text-emerald-700',
    border: 'border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
  ESTUDO: {
    label: 'ESTUDO',
    bgLight: 'bg-amber-50',
    textDark: 'text-amber-800',
    border: 'border-amber-200',
    dotColor: 'bg-amber-500',
  },
  OUTROS: {
    label: 'OUTROS',
    bgLight: 'bg-purple-50',
    textDark: 'text-purple-700',
    border: 'border-purple-200',
    dotColor: 'bg-purple-500',
  },
};

export const PRIORITIES: Record<Priority, PriorityConfig> = {
  ALTA: {
    label: 'ALTA',
    bgLight: 'bg-rose-50',
    textDark: 'text-rose-700',
    border: 'border-rose-200',
    badgeColor: 'bg-rose-500',
  },
  MÉDIA: {
    label: 'MÉDIA',
    bgLight: 'bg-amber-50',
    textDark: 'text-amber-700',
    border: 'border-amber-200',
    badgeColor: 'bg-amber-500',
  },
  BAIXA: {
    label: 'BAIXA',
    bgLight: 'bg-slate-100',
    textDark: 'text-slate-600',
    border: 'border-slate-200',
    badgeColor: 'bg-slate-400',
  },
};

// Formato de data YYYY-MM-DD para hoje e dias futuros
const today = new Date();
const formatDate = (offsetDays: number = 0): string => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Apresentar proposta de arquitetura para a equipe',
    description: 'Revisar os diagramas e os requisitos técnicos do sistema de tarefas.',
    completed: false,
    category: 'TRABALHO',
    priority: 'ALTA',
    dueDate: formatDate(0),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Estudar módulo avançado de React Hooks e Performance',
    description: 'Praticar useCallback, useMemo e estratégias de virtualização de listas.',
    completed: false,
    category: 'ESTUDO',
    priority: 'MÉDIA',
    dueDate: formatDate(2),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Comprar suprimentos e mantimentos do mês',
    description: 'Itens da despensa e produtos de limpeza para casa.',
    completed: true,
    category: 'PESSOAL',
    priority: 'BAIXA',
    dueDate: formatDate(-1),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Revisão dos endpoints da API no Supabase',
    description: 'Planejar tabelas, triggers e políticas de segurança RLS para a fase 2.',
    completed: false,
    category: 'TRABALHO',
    priority: 'ALTA',
    dueDate: formatDate(3),
    createdAt: new Date().toISOString(),
  },
];
