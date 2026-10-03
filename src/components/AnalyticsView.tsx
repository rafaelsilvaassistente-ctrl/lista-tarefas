import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListTodo, 
  TrendingUp, 
  PieChart, 
  Target 
} from 'lucide-react';
import type { Category } from '../types/task';
import { CATEGORIES, PRIORITIES } from '../utils/constants';

interface AnalyticsViewProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    completionRate: number;
    byCategory: Record<Category, number>;
    byPriority: Record<'ALTA' | 'MÉDIA' | 'BAIXA', number>;
  };
}

export const AnalyticsView = ({ stats }: AnalyticsViewProps) => {
  const getMotivationalMessage = (rate: number) => {
    if (rate === 100 && stats.total > 0) return 'Parabéns! Todas as tarefas foram concluídas! 🎉';
    if (rate >= 75) return 'Excelente ritmo! Você está na reta final para concluir tudo!';
    if (rate >= 50) return 'Mais da metade já foi entregue! Mantenha o foco.';
    if (rate >= 25) return 'Bom começo! Continue avançando nas tarefas prioritárias.';
    return 'Hora de organizar as prioridades e dar o primeiro passo!';
  };

  return (
    <div className="space-y-6">
      {/* Banner de Produtividade */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-md shadow-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase text-indigo-100">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Métricas de Desempenho</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {stats.completionRate}% Concluído
          </h2>
          <p className="text-indigo-100 text-sm max-w-md">
            {getMotivationalMessage(stats.completionRate)}
          </p>
        </div>

        {/* Círculo / Barra de progresso visual */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="text-center">
            <span className="block text-2xl font-black">{stats.completed}</span>
            <span className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Feitas</span>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center">
            <span className="block text-2xl font-black">{stats.pending}</span>
            <span className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Restam</span>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center">
            <span className="block text-2xl font-black">{stats.total}</span>
            <span className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Total</span>
          </div>
        </div>
      </div>

      {/* Grid de 4 Cards KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <ListTodo className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.total}</p>
          </div>
        </div>

        {/* Concluídas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Concluídas</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">{stats.completed}</p>
          </div>
        </div>

        {/* Pendentes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pendentes</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-0.5">{stats.pending}</p>
          </div>
        </div>

        {/* Atrasadas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Atrasadas</p>
            <p className="text-2xl font-extrabold text-rose-600 mt-0.5">{stats.overdue}</p>
          </div>
        </div>
      </div>

      {/* Seção Gráfica: Distribuição por Categoria e Prioridade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribuição por Categoria */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800">Tarefas por Categoria</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Distribuição</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {(Object.keys(CATEGORIES) as Category[]).map((catKey) => {
              const count = stats.byCategory[catKey] || 0;
              const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              const conf = CATEGORIES[catKey];

              return (
                <div key={catKey} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <span className={`w-2 h-2 rounded-full ${conf.dotColor}`} />
                      {conf.label}
                    </span>
                    <span className="text-slate-500">
                      {count} {count === 1 ? 'tarefa' : 'tarefas'} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${conf.dotColor}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribuição por Prioridade */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800">Tarefas por Prioridade</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Urgência</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {(['ALTA', 'MÉDIA', 'BAIXA'] as const).map((priKey) => {
              const count = stats.byPriority[priKey] || 0;
              const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              const conf = PRIORITIES[priKey];

              return (
                <div key={priKey} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <span className={`w-2 h-2 rounded-full ${conf.badgeColor}`} />
                      {conf.label}
                    </span>
                    <span className="text-slate-500">
                      {count} {count === 1 ? 'tarefa' : 'tarefas'} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${conf.badgeColor}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
