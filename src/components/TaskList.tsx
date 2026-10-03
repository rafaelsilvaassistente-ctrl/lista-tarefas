import { Search, Filter, Plus, Inbox, CheckCircle2 } from 'lucide-react';
import type { Category, Task, TaskFilter } from '../types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  totalTasksCount: number;
  filter: TaskFilter;
  setFilter: (f: TaskFilter) => void;
  selectedCategory: Category | 'TODAS';
  setSelectedCategory: (c: Category | 'TODAS') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onOpenNewTask: () => void;
}

export const TaskList = ({
  tasks,
  totalTasksCount,
  filter,
  setFilter,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onToggleComplete,
  onEdit,
  onDelete,
  onOpenNewTask,
}: TaskListProps) => {
  const categoriesList: (Category | 'TODAS')[] = [
    'TODAS',
    'TRABALHO',
    'PESSOAL',
    'ESTUDO',
    'OUTROS',
  ];

  return (
    <div className="space-y-6">
      {/* Barra de Filtros e Controles Superiores */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
        {/* Linha 1: Filtro de Estado ('Todas', 'Pendentes', 'Concluídas') e Barra de Busca */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Botões para filtrar por 'Todas', 'Pendentes' e 'Concluídas' */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/70">
            <button
              onClick={() => setFilter('TODAS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                filter === 'TODAS'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('PENDENTES')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                filter === 'PENDENTES'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setFilter('CONCLUIDAS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                filter === 'CONCLUIDAS'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Concluídas
            </button>
          </div>

          {/* Campo de Pesquisa Textual */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tarefas por título ou descrição..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Linha 2: Chips de Categorias para filtragem refinada */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 pl-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Categoria:</span>
          </span>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer capitalize whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Tarefas Renderizadas */}
      {tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        /* Estado Vazio Amigável (Empty State) */
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-4">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl mx-auto flex items-center justify-center text-indigo-600 shadow-xs">
            {totalTasksCount === 0 ? (
              <Inbox className="w-7 h-7" />
            ) : (
              <CheckCircle2 className="w-7 h-7" />
            )}
          </div>
          <div className="max-w-md mx-auto">
            <h4 className="text-lg font-bold text-slate-800">
              {totalTasksCount === 0
                ? 'Nenhuma tarefa cadastrada ainda'
                : 'Nenhuma tarefa encontrada neste filtro'}
            </h4>
            <p className="text-sm text-slate-500 mt-1">
              {totalTasksCount === 0
                ? 'Comece adicionando suas metas e tarefas do dia a dia.'
                : 'Tente alterar o status, a categoria ou os termos da sua busca.'}
            </p>
          </div>
          {totalTasksCount === 0 ? (
            <button
              onClick={onOpenNewTask}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Criar Primeira Tarefa</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setFilter('TODAS');
                setSelectedCategory('TODAS');
                setSearchQuery('');
              }}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              Redefinir filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
};
