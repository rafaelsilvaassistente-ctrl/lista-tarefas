import { 
  Check, 
  Calendar, 
  Trash2, 
  Edit3, 
  AlertCircle 
} from 'lucide-react';
import type { Task } from '../types/task';
import { CATEGORIES, PRIORITIES } from '../utils/constants';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

interface DueDateInfo {
  formatted: string;
  isToday: boolean;
  isOverdue: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const categoryConfig = CATEGORIES[task.category] || CATEGORIES.OUTROS;
  const priorityConfig = PRIORITIES[task.priority] || PRIORITIES.BAIXA;

  // Formatação de data amigável
  const formatDueDate = (dateStr: string): DueDateInfo | null => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return null;

    const todayStr = new Date().toISOString().split('T')[0];
    const isToday = dateStr === todayStr;

    // Checar se está atrasada
    const isOverdue = !task.completed && dateStr < todayStr;

    return {
      formatted: `${day}/${month}/${year}`,
      isToday,
      isOverdue,
    };
  };

  const dueInfo = formatDueDate(task.dueDate);

  return (
    <div
      className={`group relative bg-white rounded-xl border transition-all duration-200 p-4 sm:p-5 flex items-start gap-3 sm:gap-4 ${
        task.completed
          ? 'bg-slate-50/70 border-slate-200/80 opacity-75'
          : 'border-slate-200 hover:border-indigo-200 hover:shadow-md shadow-xs'
      }`}
    >
      {/* 1. Checkbox customizado no lado esquerdo */}
      <button
        type="button"
        onClick={() => onToggleComplete(task.id)}
        aria-label={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
        className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
          task.completed
            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
            : 'border-slate-300 hover:border-indigo-600 hover:bg-indigo-50/50 bg-white'
        }`}
      >
        {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
      </button>

      {/* Conteúdo central da tarefa */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          {/* Tag de Categoria com cor distinta */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase border ${categoryConfig.bgLight} ${categoryConfig.textDark} ${categoryConfig.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${categoryConfig.dotColor}`} />
            {categoryConfig.label}
          </span>

          {/* Tag de Prioridade */}
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase border ${priorityConfig.bgLight} ${priorityConfig.textDark} ${priorityConfig.border}`}
          >
            {priorityConfig.label}
          </span>

          {/* Data de Vencimento com ícone de calendário */}
          {dueInfo && (
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${
                dueInfo.isOverdue
                  ? 'bg-rose-50 text-rose-700 font-semibold'
                  : dueInfo.isToday
                  ? 'bg-amber-50 text-amber-800 font-semibold'
                  : 'text-slate-500 bg-slate-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {dueInfo.isToday ? 'Hoje' : dueInfo.formatted}
              </span>
              {dueInfo.isOverdue && (
                <AlertCircle className="w-3 h-3 text-rose-600 ml-0.5" />
              )}
            </span>
          )}
        </div>

        {/* Título da tarefa em destaque */}
        <h3
          onClick={() => onToggleComplete(task.id)}
          className={`text-base font-semibold transition-all cursor-pointer select-none ${
            task.completed
              ? 'line-through text-slate-400'
              : 'text-slate-900 group-hover:text-indigo-900'
          }`}
        >
          {task.title}
        </h3>

        {/* Descrição opcional */}
        {task.description && (
          <p
            className={`text-sm mt-1 leading-relaxed ${
              task.completed ? 'text-slate-400 line-through' : 'text-slate-600'
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      {/* Ações no canto direito: Editar e Lixeira (trash) para exclusão */}
      <div className="flex items-center gap-1 opacity-90 sm:opacity-60 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onEdit(task)}
          title="Editar tarefa"
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          title="Excluir tarefa"
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
