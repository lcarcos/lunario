'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(errorParam);
    }
  }, [searchParams]);
  
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

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError("Error al conectar con Google.");
      setLoading(false);
    }
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

        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.9rem',
            marginBottom: '1.5rem',
            borderRadius: '0.6rem',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            transition: 'background 0.2s',
            opacity: loading ? 0.7 : 1,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-bg)')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.11a6.625 6.625 0 010-4.22V7.05H2.18a10.999 10.999 0 000 9.9l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z" fill="#EA4335"/>
          </svg>
          {isSignUp ? 'Regístrate con Google' : 'Entrar con Google'}
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '1.5rem',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ margin: '0 1rem' }}>o con email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

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
