import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Calendar, 
  Key, 
  Copy, 
  Check, 
  LogOut, 
  Save, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Loader2 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  stats: {
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
  };
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  stats,
}) => {
  const { user, profile, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.fullName) {
      setFullName(profile.fullName);
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setSaving(true);
    setFeedback(null);
    const res = await updateProfile(fullName);
    setSaving(false);

    if (res.success) {
      setFeedback('Perfil atualizado com sucesso!');
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback(res.error || 'Erro ao atualizar perfil.');
    }
  };

  const userInitials = (profile?.fullName || user?.email || 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const formattedDate = user?.created_at
    ? new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(user.created_at))
    : 'Recentemente';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        {/* Top Header com Gradiente */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5 text-white relative">
          <div className="flex items-center justify-between">
            <h2 id="profile-modal-title" className="text-lg font-bold">
              Perfil do Usuário
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Avatar e Identificação */}
          <div className="flex items-center gap-4 mt-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-indigo-700 font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-black/10 shrink-0">
              {userInitials}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-xl font-extrabold truncate">
                {profile?.fullName || 'Usuário'}
              </h3>
              <p className="text-xs text-indigo-100 truncate flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span className="truncate">{user?.email}</span>
              </p>
              <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/30 text-[11px] font-semibold text-indigo-100 border border-indigo-400/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                <span>Conta Autenticada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Feedback temporário */}
          {feedback && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-semibold text-indigo-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-indigo-600" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Métricas e Estatísticas Pessoais */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Minhas Métricas de Produtividade
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center">
                <span className="text-2xl font-black text-slate-900">{stats.total}</span>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Total</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 text-center">
                <span className="text-2xl font-black text-emerald-700">{stats.completed}</span>
                <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">Concluídas</p>
              </div>

              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-center">
                <span className="text-2xl font-black text-amber-700">{stats.pending}</span>
                <p className="text-[11px] font-semibold text-amber-700 mt-0.5">Pendentes</p>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="mt-3 bg-slate-100 p-3 rounded-2xl border border-slate-200/70">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Taxa de Conclusão</span>
                <span className="text-indigo-600">{stats.completionRate}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Edição do Nome */}
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-600" />
              Informações do Perfil
            </h4>

            <div className="space-y-1.5">
              <label htmlFor="profile-fullname" className="text-xs font-semibold text-slate-700">
                Nome de Exibição
              </label>
              <div className="flex gap-2">
                <input
                  id="profile-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome"
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                />
                <button
                  type="submit"
                  disabled={saving || fullName.trim() === profile?.fullName}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Salvar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Informações de Conta adicionais */}
            <div className="space-y-2 pt-2 text-xs text-slate-500">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Cadastrado em:</span>
                </div>
                <span className="font-semibold text-slate-700">{formattedDate}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-slate-400" />
                  <span>ID do Supabase:</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-600 hover:text-indigo-600 bg-white px-2 py-1 rounded-md border border-slate-200 transition-colors cursor-pointer"
                  title="Copiar ID do usuário"
                >
                  <span className="truncate max-w-[140px]">{user?.id}</span>
                  {copiedId ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Botão de Logout */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Sessão ativa</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Encerrar Sessão</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
