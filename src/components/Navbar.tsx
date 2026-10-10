import { 
  CheckSquare, 
  BarChart3, 
  Calendar as CalendarIcon, 
  LogOut, 
  Plus, 
  CheckCircle2 
} from 'lucide-react';
import type { ActiveTab } from '../types/task';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingCount: number;
  onOpenNewTask: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  userName?: string;
  userEmail?: string;
}

export const Navbar = ({
  activeTab,
  setActiveTab,
  pendingCount,
  onOpenNewTask,
  onLogout,
  onOpenProfile,
  userName,
  userEmail,
}: NavbarProps) => {
  const initials = (userName || userEmail || 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                Task<span className="text-indigo-600">Flow</span>
              </span>
              <span className="hidden sm:block text-[11px] font-medium text-slate-500 tracking-wide uppercase">
                Produtividade Diária
              </span>
            </div>
          </div>

          {/* Navigation Menu Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('tarefas')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'tarefas'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Tarefas</span>
              {pendingCount > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                    activeTab === 'tarefas'
                      ? 'bg-indigo-200 text-indigo-900'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('analises')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'analises'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Análises</span>
            </button>

            <button
              onClick={() => setActiveTab('calendario')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'calendario'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Calendário</span>
            </button>
          </nav>

          {/* Right Action buttons: Profile, New Task & Logout */}
          <div className="flex items-center gap-2">
            {/* Botão de Perfil */}
            <button
              type="button"
              onClick={onOpenProfile}
              title="Visualizar e editar seu perfil"
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {initials}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                  {userName || 'Meu Perfil'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium leading-none">
                  Ver Perfil
                </span>
              </div>
            </button>

            {/* Nova Tarefa */}
            <button
              onClick={onOpenNewTask}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Nova Tarefa</span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-0.5 hidden sm:block" />

            {/* Logout */}
            <button
              onClick={onLogout}
              title="Sair da aplicação"
              className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden xl:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
