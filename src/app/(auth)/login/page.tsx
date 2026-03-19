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
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'var(--bg)',
      color: 'var(--text-primary)',
    }}>
      {/* Subtle radial glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
        opacity: 0.07,
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2.5rem 1.75rem 2rem',
        borderRadius: '1.25rem',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--bg)',
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Moon icon */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <img 
            src="/icon-192.png" 
            alt="Lunário" 
            width={64}
            height={64}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              margin: '0 auto',
              display: 'block',
            }}
          />
        </div>

        <h1 style={{
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: 300,
          color: 'var(--accent)',
          margin: '0 0 0.35rem',
          letterSpacing: '0.02em',
        }}>
          Lunário
        </h1>
        <p style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--text-secondary)',
          margin: '0 0 2rem',
        }}>
          {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
        </p>
        
        {error && (
          <div style={{
            marginBottom: '1.25rem',
            padding: '0.85rem 1rem',
            fontSize: '0.85rem',
            borderRadius: '0.6rem',
            lineHeight: 1.4,
            border: '1px solid rgba(220, 38, 38, 0.3)',
            background: 'rgba(220, 38, 38, 0.08)',
            color: '#f87171',
          }}>
            {error}
          </div>
        )}

        {successMessage && (
          <div style={{
            marginBottom: '1.25rem',
            padding: '0.85rem 1rem',
            fontSize: '0.85rem',
            borderRadius: '0.6rem',
            lineHeight: 1.4,
            border: '1px solid rgba(34, 197, 94, 0.3)',
            background: 'rgba(34, 197, 94, 0.08)',
            color: '#4ade80',
          }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleAuth} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              display: 'block',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '0.6rem',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              display: 'block',
            }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '0.6rem',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              marginTop: '0.5rem',
              borderRadius: '0.6rem',
              border: 'none',
              backgroundColor: 'var(--accent)',
              color: 'var(--bg)',
              fontSize: '0.9rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? <Loader2 className="animate-spin" style={{ width: 20, height: 20 }} /> : (isSignUp ? 'Registrarse' : 'Entrar')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            type="button"
            onClick={() => {
               setIsSignUp(!isSignUp);
               setError(null);
               setSuccessMessage(null);
            }}
            style={{
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
          >
            {isSignUp ? '¿Ya tienes cuenta? Entrar' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
}
