'use client';

import { useState } from 'react';
import { Phase } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import IntentionField from '@/components/IntentionField';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PhaseCardProps {
  phase: Phase;
  isCurrentPhase?: boolean;
}

export default function PhaseCard({ phase, isCurrentPhase }: PhaseCardProps) {
  const [expanded, setExpanded] = useState(isCurrentPhase ?? false);

  return (
    <div
      style={{
        border: `1px solid ${isCurrentPhase ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 10,
        overflow: 'hidden',
        background: isCurrentPhase ? 'var(--card-bg)' : 'transparent',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Phase header (always visible) */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.9rem 1.1rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{phase.moon}</span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-primary)',
            }}
          >
            {phase.name}
            {isCurrentPhase && (
              <span
                style={{
                  marginLeft: '0.5rem',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0.15rem 0.4rem',
                  borderRadius: 4,
                  background: 'var(--accent)',
                  color: 'var(--bg)',
                  verticalAlign: 'middle',
                }}
              >
                Hoy
              </span>
            )}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {formatDate(phase.date)}
            {phase.isSolarEvent && (
              <span style={{ marginLeft: '0.5rem', color: 'var(--accent)' }}>
                · ☀ {phase.isSolarEvent}
              </span>
            )}
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
        ) : (
          <ChevronDown size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div
          style={{
            borderTop: '1px solid var(--border)',
            padding: '1rem 1.1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.1rem',
          }}
          className="animate-fade-in"
        >
          {/* Theme */}
          <p
            style={{
              fontSize: '1.15rem',
              fontStyle: 'italic',
              color: 'var(--text-primary)',
              lineHeight: 1.4,
            }}
          >
            {phase.theme}
          </p>

          {/* Suggestions */}
          <div>
            <div
              style={{
                fontSize: '0.8rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                marginBottom: '0.6rem',
              }}
            >
              Sugerencias Prácticas
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {phase.suggestions.map((s, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: '1rem',
                    color: 'var(--text-secondary)',
                    paddingLeft: '1rem',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      color: 'var(--accent)',
                    }}
                  >
                    ·
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Intention field */}
          <IntentionField phaseId={phase.id} />
        </div>
      )}
    </div>
  );
}
