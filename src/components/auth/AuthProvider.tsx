
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionWarningShown, setSessionWarningShown] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Reset session warning when user logs in
        if (session) {
          setSessionWarningShown(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Session timeout warning effect
  useEffect(() => {
    if (!session || sessionWarningShown) return;

    const sessionExp = session.expires_at;
    if (!sessionExp) return;

    const expirationTime = sessionExp * 1000; // Convert to milliseconds
    const warningTime = expirationTime - (10 * 60 * 1000); // 10 minutes before expiration
    const currentTime = Date.now();

    if (currentTime >= warningTime) {
      // Session expires soon, show warning immediately
      toast({
        title: "Sesión expirando",
        description: "Tu sesión expirará en menos de 10 minutos. Guarda tu trabajo.",
        variant: "destructive",
      });
      setSessionWarningShown(true);
    } else {
      // Set timeout to show warning
      const timeoutId = setTimeout(() => {
        toast({
          title: "Sesión expirando",
          description: "Tu sesión expirará en 10 minutos. Guarda tu trabajo.",
          variant: "destructive",
        });
        setSessionWarningShown(true);
      }, warningTime - currentTime);

      return () => clearTimeout(timeoutId);
    }
  }, [session, sessionWarningShown]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
