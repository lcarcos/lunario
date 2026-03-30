'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface IntentionFieldProps {
  phaseId: string;
}

export default function IntentionField({ phaseId }: IntentionFieldProps) {
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        // Load via encrypted API route
        fetch(`/api/intentions?phase_id=${encodeURIComponent(phaseId)}`)
          .then((res) => res.json())
          .then((json) => {
            if (json.value) {
              setValue(json.value);
            } else {
              // Fallback to local
              const stored = localStorage.getItem(`intention:${phaseId}`);
              if (stored) setValue(stored);
            }
          })
          .catch(() => {
            const stored = localStorage.getItem(`intention:${phaseId}`);
            if (stored) setValue(stored);
          });
      } else {
        // Load from localStorage
        const stored = localStorage.getItem(`intention:${phaseId}`);
        if (stored) setValue(stored);
      }
    });
  }, [phaseId, supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    setDirty(true);
    setSaved(false);
  };

  const handleSave = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    if (user) {
      const res = await fetch('/api/intentions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase_id: phaseId, value }),
      });
      if (!res.ok) {
        console.error('Error saving intention');
      }
    }
    
    // Always save to local storage as fallback/offline
    localStorage.setItem(`intention:${phaseId}`, value);
    
    setIsLoading(false);
    setSaved(true);
    setDirty(false);
  };

  return (
    <div>
      <div
        style={{
          fontSize: '0.8rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          marginBottom: '0.5rem',
        }}
      >
        Mi Intención
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="¿Qué intención guardas para esta fase?"
        rows={3}
        style={{
          width: '100%',
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '0.65rem 0.8rem',
          color: 'var(--text-primary)',
          fontSize: '1rem',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          resize: 'vertical',
          outline: 'none',
          lineHeight: 1.5,
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '0.5rem',
        }}
      >
        {saved ? (
          <span style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>✓ Guardada</span>
        ) : (
          <span />
        )}
        <button
          onClick={handleSave}
          disabled={!dirty || isLoading}
          style={{
            padding: '0.35rem 0.85rem',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: dirty ? 'var(--accent)' : 'transparent',
            color: dirty ? 'var(--bg)' : 'var(--text-secondary)',
            fontSize: '0.9rem',
            cursor: dirty ? 'pointer' : 'not-allowed',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            transition: 'all 0.2s',
          }}
        >
          {isLoading ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}
