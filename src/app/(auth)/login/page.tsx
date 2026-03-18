'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (isSignUp) {
      const { error, data } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        if (data?.session) {
          router.push('/');
          router.refresh();
        } else {
          setSuccessMessage('¡Cuenta creada! Revisa tu email para confirmarla.');
          setIsSignUp(false);
          setPassword('');
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Email o contraseña incorrectos.");
      } else {
        router.push('/');
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
    >
      <div 
        className="w-full max-w-md p-8 rounded-2xl shadow-xl transition-all"
        style={{ 
          backgroundColor: 'var(--bg)', 
          border: '1px solid var(--border)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        <h1 
          className="text-4xl text-center mb-2 font-light" 
          style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--accent)' }}
        >
          Lunário
        </h1>
        <p 
          className="text-center mb-8 text-sm uppercase tracking-widest"
          style={{ color: 'var(--text-secondary)' }}
        >
          {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
        </p>
        
        {error && (
          <div className="mb-6 p-4 text-xs rounded-lg border border-red-900/50 bg-red-900/10 text-red-400">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 text-xs rounded-lg border border-green-900/50 bg-green-900/10 text-green-400">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label 
              className="block text-xs uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg focus:outline-none focus:ring-1 transition-all"
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                border: '1px solid var(--border)',
                color: 'var(--text-primary)'
              }}
              required
            />
          </div>
          <div>
            <label 
              className="block text-xs uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg focus:outline-none focus:ring-1 transition-all"
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                border: '1px solid var(--border)',
                color: 'var(--text-primary)'
              }}
              required
              minLength={6}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 text-sm font-medium uppercase tracking-widest"
            style={{ 
              backgroundColor: 'var(--accent)', 
              color: 'var(--bg)',
              border: 'none'
            }}
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (isSignUp ? 'Registrarse' : 'Entrar')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => {
               setIsSignUp(!isSignUp);
               setError(null);
               setSuccessMessage(null);
            }}
            className="text-xs uppercase tracking-wider hover:opacity-100 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}
          >
            {isSignUp ? '¿Ya tienes cuenta? Entrar' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
}
