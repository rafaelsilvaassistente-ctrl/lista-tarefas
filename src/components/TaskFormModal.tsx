import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';
import type { Category, Priority, Task, TaskFormData } from '../types/task';
import { CATEGORIES, PRIORITIES } from '../utils/constants';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  taskToEdit?: Task | null;
}

export const TaskFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  taskToEdit,
}: TaskFormModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('TRABALHO');
  const [priority, setPriority] = useState<Priority>('MÉDIA');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Preenche dados ao editar ou reseta ao abrir
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setCategory(taskToEdit.category);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('TRABALHO');
      setPriority('MÉDIA');
      // Define a data padrão como a data de hoje
      const todayStr = new Date().toISOString().split('T')[0];
      setDueDate(todayStr);
    }
    setError('');
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor, informe o título da tarefa.');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
      });
      onClose();
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao salvar a tarefa. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const setDateShortcut = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setDueDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            {taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Título da Tarefa <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ex: Entregar relatório de métricas..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Descrição (Opcional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione detalhes, links ou observações úteis..."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Categoria
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(CATEGORIES) as Category[]).map((catKey) => {
                const conf = CATEGORIES[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    type="button"
                    key={catKey}
                    onClick={() => setCategory(catKey)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? `${conf.bgLight} ${conf.textDark} border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs`
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${conf.dotColor}`} />
                    <span>{conf.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prioridade */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Prioridade
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(PRIORITIES) as Priority[]).map((priKey) => {
                const conf = PRIORITIES[priKey];
                const isSelected = priority === priKey;
                return (
                  <button
                    type="button"
                    key={priKey}
                    onClick={() => setPriority(priKey)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                      isSelected
                        ? `${conf.bgLight} ${conf.textDark} border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs`
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {conf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data de Vencimento */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Data para Conclusão
              </label>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span>Atalhos:</span>
                <button
                  type="button"
                  onClick={() => setDateShortcut(0)}
                  className="hover:text-indigo-600 font-medium underline px-1 cursor-pointer"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={() => setDateShortcut(1)}
                  className="hover:text-indigo-600 font-medium underline px-1 cursor-pointer"
                >
                  Amanhã
                </button>
                <button
                  type="button"
                  onClick={() => setDateShortcut(7)}
                  className="hover:text-indigo-600 font-medium underline px-1 cursor-pointer"
                >
                  7 dias
                </button>
              </div>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Rodapé com Ações */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting
                ? 'Salvando...'
                : taskToEdit
                ? 'Atualizar Tarefa'
                : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
