'use client';

import { useState, useRef, useEffect } from 'react';
import { CalendarDays, ChevronDown, Check, Download } from 'lucide-react';
import { downloadICS } from '@/lib/ics';

export default function ExportCalendarButton() {
  const [open, setOpen] = useState(false);
  const [exported, setExported] = useState<null | 'phases' | 'full'>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleExport(includeCycles: boolean) {
    downloadICS(includeCycles);
    setExported(includeCycles ? 'full' : 'phases');
    setOpen(false);
    setTimeout(() => setExported(null), 3000);
  }

  const buttonBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '0.45rem 0.85rem',
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap' as const,
  };

  const successStyle: React.CSSProperties = {
    ...buttonBase,
    borderColor: 'var(--accent)',
    color: 'var(--accent)',
  };

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={exported ? successStyle : buttonBase}
        title="Exportar al Calendario"
      >
        {exported ? (
          <>
            <Check size={15} />
            <span>¡Exportado!</span>
          </>
        ) : (
          <>
            <CalendarDays size={15} />
            <span>Exportar al Calendario</span>
            <ChevronDown
              size={13}
              style={{
                transition: 'transform 0.2s',
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </>
        )}
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '0.4rem',
            minWidth: 240,
            zIndex: 100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '0.5rem 0.75rem 0.4rem',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Compatible con Google, Apple y Outlook
          </div>

          {/* Option 1: Solo fases */}
          <button
            onClick={() => handleExport(false)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
              background: 'transparent',
              border: 'none',
              borderRadius: 7,
              padding: '0.6rem 0.75rem',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                'rgba(255,255,255,0.05)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')
            }
          >
            <Download size={15} style={{ marginTop: 2, flexShrink: 0, color: 'var(--accent)' }} />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>52 Fases Lunares</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Cada fase lunar como un evento de 1 día
              </div>
            </div>
          </button>

          {/* Option 2: Fases + ciclos */}
          <button
            onClick={() => handleExport(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
              background: 'transparent',
              border: 'none',
              borderRadius: 7,
              padding: '0.6rem 0.75rem',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                'rgba(255,255,255,0.05)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')
            }
          >
            <Download size={15} style={{ marginTop: 2, flexShrink: 0, color: 'var(--accent)' }} />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>Fases + 13 Ciclos</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Incluye bloques por ciclo astrológico completo
              </div>
            </div>
          </button>

          {/* Footer info */}
          <div
            style={{
              margin: '0.4rem 0.75rem 0.3rem',
              paddingTop: '0.5rem',
              borderTop: '1px solid var(--border)',
              fontSize: '0.72rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            🌙 Descarga el archivo <code style={{ fontFamily: 'monospace' }}>.ics</code> y ábrelo
            en tu app de calendario favorita.
          </div>
        </div>
      )}
    </div>
  );
}
