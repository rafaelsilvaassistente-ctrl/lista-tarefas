import { useState } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  CheckCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import type { ActiveTab, Task, TaskFormData } from './types/task';
import { Navbar } from './components/Navbar';
import { TaskList } from './components/TaskList';
import { TaskFormModal } from './components/TaskFormModal';
import { AnalyticsView } from './components/AnalyticsView';
import { CalendarView } from './components/CalendarView';
import { ConfirmModal } from './components/ConfirmModal';
import { AuthScreen } from './components/AuthScreen';
import { ProfileModal } from './components/ProfileModal';

export function App() {
  const { user, profile, loading: authLoading, signOut, isPasswordRecovery } = useAuth();
  
  const {
    tasks,
    loading: tasksLoading,
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
  } = useTasks();

  const [activeTab, setActiveTab] = useState<ActiveTab>('tarefas');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleOpenNewTask = () => {
    setTaskToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsFormModalOpen(true);
  };

  const handleSaveTask = async (data: TaskFormData) => {
    if (taskToEdit) {
      await editTask(taskToEdit.id, data);
      showToast('Tarefa atualizada com sucesso!');
    } else {
      await addTask(data);
      showToast('Nova tarefa criada com sucesso!');
    }
  };

  const handleConfirmDelete = async () => {
    if (taskToDeleteId) {
      await removeTask(taskToDeleteId);
      setTaskToDeleteId(null);
      showToast('Tarefa excluída com sucesso!');
    }
  };

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await signOut();
    showToast('Sessão encerrada com sucesso!');
  };

  // Se a autenticação estiver carregando a sessão inicial
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-300">Carregando autenticação segura...</p>
      </div>
    );
  }

  // Se o usuário não estiver autenticado ou estiver no fluxo de redefinição de senha
  if (!user || isPasswordRecovery) {
    return (
      <AuthScreen
        onSuccess={() => {
          showToast('Bem-vindo ao TaskFlow!');
        }}
      />
    );
  }

  // Data atual formatada em português
  const currentDateFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const displayName = profile?.fullName || user.email?.split('@')[0] || 'Usuário';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-sm font-semibold">
            <CheckCheck className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Navbar Superior com Informações do Usuário */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={stats.pending}
        onOpenNewTask={handleOpenNewTask}
        onLogout={() => setIsLogoutModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        userName={displayName}
        userEmail={user.email}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner de Boas-Vindas e Data com Identificação do Perfil */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 tracking-wider uppercase">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span className="capitalize">{currentDateFormatted}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Olá, {displayName}! Organize seu dia
            </h1>
            <p className="text-sm text-slate-500">
              {stats.pending > 0
                ? `Você tem ${stats.pending} ${stats.pending === 1 ? 'tarefa pendente' : 'tarefas pendentes'} na sua lista.`
                : 'Tudo pronto! Nenhuma tarefa pendente no momento.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>Meu Perfil</span>
            </button>
            <button
              onClick={handleOpenNewTask}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Nova Tarefa</span>
            </button>
          </div>
        </section>

        {/* Alternância de Abas: Tarefas, Análises ou Calendário */}
        {tasksLoading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold">Carregando suas tarefas...</p>
          </div>
        ) : (
          <>
            {activeTab === 'tarefas' && (
              <TaskList
                tasks={filteredTasks}
                totalTasksCount={tasks.length}
                filter={filter}
                setFilter={setFilter}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onToggleComplete={toggleTaskComplete}
                onEdit={handleOpenEditTask}
                onDelete={(id) => setTaskToDeleteId(id)}
                onOpenNewTask={handleOpenNewTask}
              />
            )}

            {activeTab === 'analises' && <AnalyticsView stats={stats} />}

            {activeTab === 'calendario' && (
              <CalendarView
                tasks={tasks}
                onToggleComplete={toggleTaskComplete}
                onEdit={handleOpenEditTask}
                onDelete={(id) => setTaskToDeleteId(id)}
                onOpenNewTask={handleOpenNewTask}
              />
            )}
          </>
        )}
      </main>

      {/* Rodapé Moderno */}
      <footer className="border-t border-slate-200/80 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} TaskFlow • Sistema de Lista de Tarefas Multi-Usuário.</p>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full font-medium shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Supabase Auth</span>
            <span className="text-emerald-400">•</span>
            <span className="font-semibold text-emerald-900 truncate max-w-[200px]">{user.email}</span>
          </div>
        </div>
      </footer>

      {/* Modal de Criação / Edição de Tarefas */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      {/* Modal de Perfil do Usuário */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={() => {
          setIsProfileModalOpen(false);
          setIsLogoutModalOpen(true);
        }}
        stats={stats}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={taskToDeleteId !== null}
        onClose={() => setTaskToDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Tarefa"
        message="Tem certeza de que deseja excluir permanentemente esta tarefa? Esta ação não pode ser desfeita."
        confirmLabel="Sim, excluir"
        confirmVariant="danger"
      />

      {/* Modal de Confirmação de Logout */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Encerrar Sessão"
        message="Deseja realmente sair da aplicação? Para acessar suas tarefas novamente, faça login com seu e-mail e senha."
        confirmLabel="Sim, sair"
        confirmVariant="primary"
      />
    </div>
  );
}

export default App;
