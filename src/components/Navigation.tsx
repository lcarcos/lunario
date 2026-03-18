'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { Moon, Sun, LayoutList, Grid3X3, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Línea de Tiempo', icon: LayoutList },
  { href: '/ciclos', label: 'Por Ciclo', icon: Grid3X3 },
  { href: '/calendario', label: 'Calendario', icon: CalendarDays },
];

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className="hidden md:flex flex-col"
        style={{
          width: 220,
          minHeight: '100vh',
          borderRight: '1px solid var(--border)',
          padding: '2rem 1.5rem',
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
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.7rem',
              fontWeight: 300,
              color: 'var(--accent)',
              letterSpacing: '0.04em',
            }}
          >
            Lunário
          </h1>
          <p
            style={{
              fontSize: '0.7rem',
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
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: active ? 500 : 300,
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: active ? 'var(--card-bg)' : 'transparent',
                  border: active ? '1px solid var(--border)' : '1px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon
                  size={15}
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
            fontSize: '0.8rem',
          }}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        </button>
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
          display: 'flex',
          justifyContent: 'space-around',
          padding: '0.6rem 0',
        }}
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
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
              <Icon size={20} />
              <span style={{ fontSize: '0.65rem' }}>{label}</span>
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
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span style={{ fontSize: '0.65rem' }}>Tema</span>
        </button>
      </nav>
    </>
  );
}
