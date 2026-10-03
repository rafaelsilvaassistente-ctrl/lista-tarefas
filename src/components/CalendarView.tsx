import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  CheckCircle2, 
  Clock,
  Edit3,
  Trash2
} from 'lucide-react';
import type { Task } from '../types/task';
import { CATEGORIES, PRIORITIES } from '../utils/constants';

interface CalendarViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onOpenNewTask: () => void;
}

export const CalendarView = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onOpenNewTask,
}: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayStr, setSelectedDayStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Primeiro dia do mês e total de dias
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Tarefas do dia selecionado
  const selectedDayTasks = tasks.filter((t) => t.dueDate === selectedDayStr);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna 1 & 2: Grade Mensal do Calendário */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
        {/* Cabeçalho do Calendário */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              {monthNames[month]} <span className="text-slate-500 font-normal">{year}</span>
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors cursor-pointer"
              title="Mês anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const now = new Date();
                setCurrentDate(now);
                setSelectedDayStr(now.toISOString().split('T')[0]);
              }}
              className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            >
              Hoje
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors cursor-pointer"
              title="Próximo mês"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dias da Semana */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Células dos Dias */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Espaços vazios do início do mês */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-16 sm:h-20 bg-slate-50/50 rounded-xl" />
          ))}

          {/* Dias do mês corrente */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDayStr;

            const dayTasks = tasks.filter((t) => t.dueDate === dateStr);

            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => setSelectedDayStr(dateStr)}
                className={`h-16 sm:h-20 p-1.5 sm:p-2 rounded-xl text-left flex flex-col justify-between transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-xs'
                    : isToday
                    ? 'border-indigo-300 bg-indigo-50/20'
                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                      isToday
                        ? 'bg-indigo-600 text-white'
                        : isSelected
                        ? 'text-indigo-700'
                        : 'text-slate-700'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Marcadores de tarefas */}
                <div className="flex items-center gap-1 overflow-hidden mt-1">
                  {dayTasks.slice(0, 3).map((t) => {
                    const cat = CATEGORIES[t.category] || CATEGORIES.OUTROS;
                    return (
                      <span
                        key={t.id}
                        title={t.title}
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          t.completed ? 'bg-slate-300' : cat.dotColor
                        }`}
                      />
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <span className="text-[9px] text-slate-400 font-semibold">
                      +{dayTasks.length - 3}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Coluna 3: Painel Lateral com Tarefas do Dia Selecionado */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4 flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Tarefas do Dia</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedDayStr.split('-').reverse().join('/')}
            </p>
          </div>
          <button
            onClick={onOpenNewTask}
            className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar</span>
          </button>
        </div>

        {/* Lista de tarefas do dia */}
        <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[460px] pr-1">
          {selectedDayTasks.length > 0 ? (
            selectedDayTasks.map((task) => {
              const catConfig = CATEGORIES[task.category] || CATEGORIES.OUTROS;
              const priConfig = PRIORITIES[task.priority] || PRIORITIES.BAIXA;

              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border transition-all ${
                    task.completed
                      ? 'bg-slate-50/60 border-slate-200 opacity-70'
                      : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={() => onToggleComplete(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-indigo-500'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-semibold leading-snug ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${catConfig.bgLight} ${catConfig.textDark} ${catConfig.border}`}
                        >
                          {catConfig.label}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${priConfig.bgLight} ${priConfig.textDark} ${priConfig.border}`}
                        >
                          {priConfig.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(task)}
                        title="Editar"
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(task.id)}
                        title="Excluir"
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-slate-300 stroke-[1.5]" />
              <p className="text-xs font-medium">Nenhuma tarefa marcada para esta data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
