import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  KeyRound, 
  AlertCircle, 
  Sparkles, 
  Check, 
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { AuthMode } from '../types/auth';

interface AuthScreenProps {
  onSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const { 
    signIn, 
    signUp, 
    resetPassword, 
    updatePassword, 
    isPasswordRecovery, 
    setIsPasswordRecovery 
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>(isPasswordRecovery ? 'update-password' : 'login');
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Credenciais padrão solicitadas pelo usuário
  const DEMO_EMAIL = 'rafaelsilvaassistente@gmail.com';
  const DEMO_PASS = 'Noah0409';

  const handleFillDemoCredentials = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASS);
    setErrorMessage(null);
  };

  const handleQuickLoginAsRafael = async () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASS);
    setErrorMessage(null);
    setLoading(true);

    const result = await signIn(DEMO_EMAIL, DEMO_PASS);
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Falha ao autenticar usuário cadastrado.');
    } else {
      if (onSuccess) onSuccess();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validações locais
    if (mode === 'login') {
      if (!email.trim() || !password) {
        setErrorMessage('Por favor, preencha todos os campos.');
        return;
      }

      setLoading(true);
      const res = await signIn(email, password);
      setLoading(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Falha ao fazer login.');
      } else {
        if (onSuccess) onSuccess();
      }
    } else if (mode === 'register') {
      if (!fullName.trim() || !email.trim() || !password) {
        setErrorMessage('Por favor, preencha todos os campos do cadastro.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('A senha precisa ter no mínimo 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('As senhas não coincidem. Digite novamente.');
        return;
      }

      setLoading(true);
      const res = await signUp(email, password, fullName);
      setLoading(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Falha ao cadastrar conta.');
      } else {
        if (res.requiresEmailConfirmation) {
          setSuccessMessage(
            'Conta criada com sucesso! Por favor, verifique a caixa de entrada do seu e-mail para confirmar a ativação.'
          );
        } else {
          setSuccessMessage('Conta cadastrada com sucesso! Você já está conectado.');
          setTimeout(() => {
            if (onSuccess) onSuccess();
          }, 1200);
        }
      }
    } else if (mode === 'forgot-password') {
      if (!email.trim()) {
        setErrorMessage('Informe o e-mail cadastrado para enviarmos as instruções.');
        return;
      }

      setLoading(true);
      const res = await resetPassword(email);
      setLoading(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Não foi possível enviar o e-mail de recuperação.');
      } else {
        setSuccessMessage(
          'E-mail de recuperação enviado! Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.'
        );
      }
    } else if (mode === 'update-password') {
      if (!password) {
        setErrorMessage('Informe a nova senha.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('A nova senha deve ter pelo menos 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('As senhas não conferem.');
        return;
      }

      setLoading(true);
      const res = await updatePassword(password);
      setLoading(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Falha ao atualizar senha.');
      } else {
        setSuccessMessage('Senha atualizada com sucesso! Redirecionando...');
        setIsPasswordRecovery(false);
        setTimeout(() => {
          setMode('login');
          if (onSuccess) onSuccess();
        }, 1500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Decorativo com Iluminação e Geometria Suave */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Conteúdo Central */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Cabeçalho do App / Marca */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-xl shadow-indigo-500/25 ring-4 ring-indigo-500/10 mb-2">
            <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5">
            Task<span className="text-indigo-400">Flow</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Gerenciador de Tarefas e Produtividade com Autenticação Supabase
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40">
          {/* Navegação entre Abas (Entrar / Criar Conta) se não estiver em modo de recuperação direta */}
          {mode !== 'update-password' && (
            <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'login' || mode === 'forgot-password'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Criar Conta
              </button>
            </div>
          )}

          {/* Cabeçalho do Modo Específico */}
          <div className="mb-6">
            {mode === 'login' && (
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Bem-vindo de volta!</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Acesse sua conta para visualizar e sincronizar suas tarefas pessoais.
                </p>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Criar uma nova conta</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Cada usuário possui seu próprio perfil e conjunto isolado de tarefas.
                </p>
              </div>
            )}

            {mode === 'forgot-password' && (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold mb-2 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Voltar para login
                </button>
                <h2 className="text-xl font-bold text-white tracking-tight">Recuperar Senha</h2>
                <p className="text-xs text-slate-400">
                  Insira o e-mail cadastrado para receber o link de redefinição de acesso.
                </p>
              </div>
            )}

            {mode === 'update-password' && (
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Redefinir Senha</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Digite sua nova senha para atualizar as credenciais da sua conta.
                </p>
              </div>
            )}
          </div>

          {/* Alertas de Erro ou Sucesso */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-2.5 text-emerald-300 text-xs">
              <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <div className="flex-1 font-medium leading-relaxed">{successMessage}</div>
            </div>
          )}

          {/* Formulário Principal */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Nome (Apenas em Criar Conta) */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300" htmlFor="auth-fullname">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="auth-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Rafael Silva"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Campo E-mail (Em Login, Register e Forgot Password) */}
            {mode !== 'update-password' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300" htmlFor="auth-email">
                  Endereço de E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="auth-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Campo Senha (Em Login, Register e Update Password) */}
            {mode !== 'forgot-password' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300" htmlFor="auth-password">
                    {mode === 'update-password' ? 'Nova Senha' : 'Senha'}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot-password');
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirmação de Senha (Em Register e Update Password) */}
            {(mode === 'register' || mode === 'update-password') && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300" htmlFor="auth-confirm-password">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="auth-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha digitada"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Botão de Submissão com Feedback de Carregamento */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-98 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Acessar Conta'}
                    {mode === 'register' && 'Cadastrar e Começar'}
                    {mode === 'forgot-password' && 'Enviar Instruções'}
                    {mode === 'update-password' && 'Salvar Nova Senha'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Box de Acesso Rápido com o Usuário Cadastrado Solicitado */}
          {mode === 'login' && (
            <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Usuário de Teste Pré-cadastrado:
                </span>
                <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded-full text-indigo-300 border border-slate-700 font-mono">
                  Supabase Auth
                </span>
              </div>

              <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex flex-col text-xs font-mono text-slate-300 space-y-0.5">
                  <span className="text-[11px] text-slate-400 font-sans">E-mail:</span>
                  <span className="text-white truncate font-semibold">{DEMO_EMAIL}</span>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 font-sans">Senha:</span>
                    <span className="text-slate-400 font-semibold">{DEMO_PASS}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleFillDemoCredentials}
                    className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700/80 transition-colors cursor-pointer text-center"
                  >
                    Preencher dados
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickLoginAsRafael}
                    disabled={loading}
                    className="py-1.5 px-2 bg-indigo-900/60 hover:bg-indigo-900 text-indigo-200 text-xs font-semibold rounded-lg border border-indigo-700/60 transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Entrar Direto
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé Seguro */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Sessão protegida por criptografia e RLS do Supabase</span>
        </div>
      </div>
    </div>
  );
};
