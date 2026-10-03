export type Priority = 'ALTA' | 'MÉDIA' | 'BAIXA';

export type Category = 'TRABALHO' | 'PESSOAL' | 'ESTUDO' | 'OUTROS';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: Category;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  createdAt: string; // ISO date
}

export type TaskFilter = 'TODAS' | 'PENDENTES' | 'CONCLUIDAS';

export type ActiveTab = 'tarefas' | 'analises' | 'calendario';

export interface TaskFormData {
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  dueDate: string;
}

export interface CategoryConfig {
  label: string;
  bgLight: string;
  textDark: string;
  border: string;
  dotColor: string;
}

export interface PriorityConfig {
  label: string;
  bgLight: string;
  textDark: string;
  border: string;
  badgeColor: string;
}
