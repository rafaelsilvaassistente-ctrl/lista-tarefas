import React, { createContext, useEffect, useState, useTransition } from 'react';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import type { AuthContextType, UserProfile } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function translateAuthError(message: string): string {
  const msgLower = message.toLowerCase();
  if (msgLower.includes('invalid login credentials') || msgLower.includes('invalid credentials')) {
    return 'E-mail ou senha inválidos. Verifique os dados digitados.';
  }
  if (msgLower.includes('user already registered') || msgLower.includes('email already in use')) {
    return 'Este endereço de e-mail já está cadastrado. Tente fazer login ou recuperar sua senha.';
  }
  if (msgLower.includes('password should be at least')) {
    return 'A senha deve conter pelo menos 6 caracteres.';
  }
  if (msgLower.includes('rate limit') || msgLower.includes('too many requests')) {
    return 'Muitas tentativas em pouco tempo. Aguarde alguns instantes e tente novamente.';
  }
  if (msgLower.includes('user not found')) {
    return 'Nenhum usuário encontrado com este e-mail.';
  }
  if (msgLower.includes('email not confirmed')) {
    return 'Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.';
  }
  return message;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [, startTransition] = useTransition();

  const fetchUserProfile = async (currentUser: User) => {
    if (!supabase) {
      setProfile({
        id: currentUser.id,
        email: currentUser.email || '',
        fullName: (currentUser.user_metadata?.full_name as string) || currentUser.email?.split('@')[0] || 'Usuário',
        avatarUrl: currentUser.user_metadata?.avatar_url as string || '',
        createdAt: currentUser.created_at,
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (error) {
        console.warn('Aviso ao consultar perfil no Supabase:', error.message);
      }

      if (data) {
        setProfile({
          id: data.id,
          email: data.email || currentUser.email || '',
          fullName: data.full_name || (currentUser.user_metadata?.full_name as string) || currentUser.email?.split('@')[0] || 'Usuário',
          avatarUrl: data.avatar_url || (currentUser.user_metadata?.avatar_url as string) || '',
          createdAt: data.created_at || currentUser.created_at,
          updatedAt: data.updated_at,
        });
      } else {
        // Cria perfil inicial se não existir
        const fallbackName = (currentUser.user_metadata?.full_name as string) || currentUser.email?.split('@')[0] || 'Usuário';
        const fallbackProfile: UserProfile = {
          id: currentUser.id,
          email: currentUser.email || '',
          fullName: fallbackName,
          avatarUrl: currentUser.user_metadata?.avatar_url as string || '',
          createdAt: currentUser.created_at,
        };

        await supabase.from('profiles').upsert({
          id: currentUser.id,
          email: currentUser.email,
          full_name: fallbackName,
        });

        setProfile(fallbackProfile);
      }
    } catch (err) {
      console.error('Erro ao sincronizar perfil:', err);
    }
  };

  useEffect(() => {
    // Detecta se a URL contém tokens de recuperação de senha (#access_token=...&type=recovery)
    const hash = window.location.hash;
    if (hash && (hash.includes('type=recovery') || hash.includes('access_token'))) {
      setIsPasswordRecovery(true);
    }

    if (!supabase) {
      setLoading(false);
      return;
    }

    // Inicializa a sessão ativa
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      startTransition(() => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          fetchUserProfile(currentSession.user);
        }
        setLoading(false);
      });
    });

    // Inscrição nas mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === 'PASSWORD_RECOVERY') {
          setIsPasswordRecovery(true);
        }

        if (newSession?.user) {
          await fetchUserProfile(newSession.user);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { success: false, error: 'Supabase não está configurado no ambiente.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { success: false, error: translateAuthError(error.message) };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        await fetchUserProfile(data.user);
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha inesperada ao tentar autenticar.';
      return { success: false, error: translateAuthError(message) };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabase) {
      return { success: false, error: 'Supabase não está configurado no ambiente.' };
    }

    try {
      const trimmedEmail = email.trim();
      const trimmedName = fullName.trim();

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
          },
        },
      });

      if (error) {
        return { success: false, error: translateAuthError(error.message) };
      }

      // Se o usuário foi criado e a sessão retornou diretamente
      if (data.user) {
        // Tenta garantir o perfil na tabela
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: trimmedEmail,
          full_name: trimmedName,
        });

        // Se email confirmation estiver ativo no Supabase, data.session pode ser nulo
        const requiresConfirmation = !data.session;

        return {
          success: true,
          requiresEmailConfirmation: requiresConfirmation,
        };
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha inesperada ao criar conta.';
      return { success: false, error: translateAuthError(message) };
    }
  };

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { success: false, error: 'Supabase não está configurado no ambiente.' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/#type=recovery`,
      });

      if (error) {
        return { success: false, error: translateAuthError(error.message) };
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha ao solicitar redefinição de senha.';
      return { success: false, error: translateAuthError(message) };
    }
  };

  const updatePassword = async (password: string) => {
    if (!supabase) {
      return { success: false, error: 'Supabase não está configurado no ambiente.' };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        return { success: false, error: translateAuthError(error.message) };
      }

      setIsPasswordRecovery(false);
      // Limpa a URL hash
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha ao atualizar a nova senha.';
      return { success: false, error: translateAuthError(message) };
    }
  };

  const updateProfile = async (fullName: string, avatarUrl?: string) => {
    if (!user) {
      return { success: false, error: 'Nenhum usuário logado.' };
    }

    try {
      const trimmedName = fullName.trim();

      if (supabase) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: trimmedName,
            avatar_url: avatarUrl || profile?.avatarUrl || '',
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (profileError) {
          throw profileError;
        }

        // Atualiza também os metadados do auth
        await supabase.auth.updateUser({
          data: {
            full_name: trimmedName,
            avatar_url: avatarUrl || profile?.avatarUrl || '',
          },
        });
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              fullName: trimmedName,
              avatarUrl: avatarUrl ?? prev.avatarUrl,
            }
          : null
      );

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha ao atualizar perfil.';
      return { success: false, error: message };
    }
  };

  const signOut = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Erro ao encerrar sessão no Supabase:', err);
      }
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsPasswordRecovery(false);
    // Limpa hash se houver
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        resetPassword,
        updatePassword,
        updateProfile,
        signOut,
        isPasswordRecovery,
        setIsPasswordRecovery,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

