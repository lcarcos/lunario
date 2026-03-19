'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { Moon, Sun, LayoutList, Grid3X3, CalendarDays, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/', label: 'Línea de Tiempo', icon: LayoutList },
  { href: '/ciclos', label: 'Por Ciclo', icon: Grid3X3 },
  { href: '/calendario', label: 'Calendario', icon: CalendarDays },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Buscar sessão atual ao montar
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });

    // Escutar mudanças de autenticação (login, logout, etc)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className="hidden md:flex flex-col"
        style={{
          width: 260,
          minHeight: '100vh',
          borderRight: '1px solid var(--border)',
          padding: '2.5rem 1.75rem',
          gap: '0.5rem',
          position: 'fixed',
          top: 0,
          left: 0,
          background: 'var(--bg)',
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 400,
              color: 'var(--accent)',
              letterSpacing: '0.04em',
            }}
          >
            Lunário
          </h1>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop: '0.15rem',
            }}
          >
            Ciclos & Metas 2026–27
          </p>
        </div>

        {/* Nav links */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: active ? 500 : 300,
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: active ? 'var(--card-bg)' : 'transparent',
                  border: active ? '1px solid var(--border)' : '1px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon
                  size={17}
                  style={{ color: active ? 'var(--accent)' : 'var(--text-secondary)' }}
                />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        </button>

        {/* Auth Section Desktop */}
        <div className="mt-8 border-t border-sand-200 dark:border-obsidian-700 pt-6">
          {user ? (
            <div className="flex flex-col items-center sm:items-start gap-4">
              <div className="flex items-center gap-3 px-3 w-full">
                <div className="w-8 h-8 rounded-full bg-terracotta-100 dark:bg-terracotta-900 flex items-center justify-center text-terracotta-700 dark:text-terracotta-300 font-bold shrink-0">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div className="text-sm truncate w-full flex-1 max-w-[120px] text-obsidian-600 dark:text-sand-300 hidden sm:block">
                  {user.email}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm rounded-xl text-obsidian-500 hover:bg-red-50 hover:text-red-600 dark:text-sand-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5 sm:mr-3 shrink-0" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="flex items-center w-full px-4 py-3 text-sm rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white transition-colors"
              title="Iniciar sesión"
            >
              <User className="w-5 h-5 sm:mr-3 shrink-0" />
              <span className="hidden sm:inline font-medium">Iniciar sesión</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <nav
        className="flex md:hidden"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: '1px solid var(--border)',
          background: 'var(--bg)',
          zIndex: 100,
          justifyContent: 'space-around',
          padding: '0.6rem 0',
        }}
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 1rem',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                textDecoration: 'none',
              }}
            >
              <Icon size={22} />
              <span style={{ fontSize: '0.75rem' }}>{label}</span>
            </Link>
          );
        })}
        
        <button
          onClick={toggle}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.25rem 1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          <span style={{ fontSize: '0.75rem' }}>Tema</span>
        </button>

        {user ? (
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 1rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <LogOut size={20} className="text-red-500" />
            <span style={{ fontSize: '0.75rem' }}>Salir</span>
          </button>
        ) : (
          <button
            onClick={() => router.push('/login')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 1rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <User size={20} className="text-terracotta-600 dark:text-terracotta-400" />
            <span style={{ fontSize: '0.75rem' }}>Login</span>
          </button>
        )}
      </nav>
    </>
  );
}
