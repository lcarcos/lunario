'use client';

import { useState } from 'react';
import { CYCLES, Cycle } from '@/lib/data';
import PhaseCard from '@/components/PhaseCard';
import { getCurrentCycleAndPhase } from '@/lib/data';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CiclosPage() {
  const current = getCurrentCycleAndPhase();
  const initialId = current?.cycle.id ?? 0;
  const [activeCycleId, setActiveCycleId] = useState(initialId);

  const cycle = CYCLES.find((c) => c.id === activeCycleId)!;

  const prev = () => setActiveCycleId((id) => Math.max(0, id - 1));
  const next = () => setActiveCycleId((id) => Math.min(CYCLES.length - 1, id + 1));

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.2rem',
            fontWeight: 300,
          }}
        >
          Por Ciclo
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Explora cada signo y sus cuatro fases lunares
        </p>
      </div>

      {/* Cycle selector pills */}
      <div
        style={{
          display: 'flex',
          gap: '0.4rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
        }}
      >
        {CYCLES.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCycleId(c.id)}
            title={c.sign}
            style={{
              padding: '0.3rem 0.6rem',
              borderRadius: 6,
              border: `1px solid ${activeCycleId === c.id ? 'var(--accent)' : 'var(--border)'}`,
              background: activeCycleId === c.id ? 'var(--card-bg)' : 'transparent',
              color: activeCycleId === c.id ? 'var(--accent)' : 'var(--text-secondary)',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {c.glyph}
          </button>
        ))}
      </div>

      {/* Hero card */}
      <div
        key={cycle.id}
        style={{
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '1.75rem',
          marginBottom: '1.75rem',
          background: 'var(--card-bg)',
        }}
        className="animate-fade-in"
      >
        {/* Navigation arrows */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1rem',
          }}
        >
          <button
            onClick={prev}
            disabled={activeCycleId === 0}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: activeCycleId === 0 ? 'not-allowed' : 'pointer',
              color: activeCycleId === 0 ? 'var(--border)' : 'var(--text-secondary)',
              padding: '0.25rem',
            }}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Glyph + title */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '3.5rem',
                color: 'var(--accent)',
                lineHeight: 1,
              }}
            >
              {cycle.glyph}
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.6rem',
                fontWeight: 300,
                marginTop: '0.25rem',
              }}
            >
              {cycle.sign}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
              {cycle.period}
            </div>
            {cycle.isFree && (
              <span
                style={{
                  display: 'inline-block',
                  marginTop: '0.4rem',
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 4,
                  border: '1px solid var(--accent)',
                  color: 'var(--accent)',
                }}
              >
                Acceso Gratuito
              </span>
            )}
          </div>

          <button
            onClick={next}
            disabled={activeCycleId === CYCLES.length - 1}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: activeCycleId === CYCLES.length - 1 ? 'not-allowed' : 'pointer',
              color:
                activeCycleId === CYCLES.length - 1 ? 'var(--border)' : 'var(--text-secondary)',
              padding: '0.25rem',
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Theme */}
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontStyle: 'italic',
            marginBottom: '0.5rem',
          }}
        >
          {cycle.centralTheme}
        </p>
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.8rem',
            lineHeight: 1.5,
          }}
        >
          {cycle.description}
        </p>
      </div>

      {/* 4 Phases */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            marginBottom: '0.25rem',
          }}
        >
          4 Fases del Ciclo
        </div>
        {cycle.phases.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            isCurrentPhase={current?.phase.id === phase.id}
          />
        ))}
      </div>
    </div>
  );
}
