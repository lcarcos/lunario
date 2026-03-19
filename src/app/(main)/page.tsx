'use client';

import { CYCLES, getCurrentCycleAndPhase } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import PhaseCard from '@/components/PhaseCard';
import ExportCalendarButton from '@/components/ExportCalendarButton';

export default function TimelinePage() {
  const current = getCurrentCycleAndPhase();

  return (
    <div className="page-container">
      {/* Page header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 className="page-title">Línea de Tiempo</h2>
            <p className="page-subtitle">
              Año astrológico 2026 – 2027 · {CYCLES.length} ciclos · 52 fases lunares
            </p>
          </div>
          <ExportCalendarButton />
        </div>
      </div>

      {/* Current phase banner */}
      {current && (
        <div
          style={{
            border: '1px solid var(--accent)',
            borderRadius: 12,
            padding: '1.2rem 1.5rem',
            marginBottom: '2.5rem',
            background: 'var(--card-bg)',
          }}
        >
          <div className="section-label" style={{ color: 'var(--accent)', marginBottom: '0.4rem', letterSpacing: '0.15em' }}>
            ✦ Fase Actual
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.8rem' }}>{current.phase.moon}</span>
            <div>
              <div
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 400,
                }}
              >
                {current.phase.name} · {current.cycle.glyph} {current.cycle.sign}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                {current.phase.theme}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {CYCLES.map((cycle) => (
          <section key={cycle.id}>
            {/* Cycle header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.25rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span
                style={{
                  fontSize: '1.8rem',
                  color: 'var(--accent)',
                }}
              >
                {cycle.glyph}
              </span>
              <div>
                <div
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 400,
                    color: 'var(--text-primary)',
                  }}
                >
                  {cycle.sign}
                  {cycle.isFree && (
                    <span
                      style={{
                        marginLeft: '0.5rem',
                        fontSize: '0.75rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        padding: '0.15rem 0.4rem',
                        borderRadius: 4,
                        border: '1px solid var(--accent)',
                        color: 'var(--accent)',
                        verticalAlign: 'middle',
                      }}
                    >
                      Gratis
                    </span>
                  )}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {cycle.period} · {cycle.centralTheme}
                </div>
              </div>
            </div>

            {/* Phases — grid: 1 col mobile, 2 cols desktop */}
            <div className="phase-grid">
              {cycle.phases.map((phase) => (
                <PhaseCard
                  key={phase.id}
                  phase={phase}
                  isCurrentPhase={current?.phase.id === phase.id}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
