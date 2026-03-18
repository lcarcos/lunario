'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getAllPhases, getCurrentCycleAndPhase, CYCLES, Phase } from '@/lib/data';
import { ChevronLeft, ChevronRight, CheckSquare, Square, Plus, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const MONTHS_ES_SHORT = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

const DAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const DAYS_FULL_ES = [
  'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo',
];

// Adjust so week starts on Monday (0=Mon, 6=Sun)
function getMondayFirstDay(date: Date): number {
  const day = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  return day === 0 ? 6 : day - 1;
}

function getCalendarDays(year: number, month: number): (string | null)[] {
  const firstDay = getMondayFirstDay(new Date(year, month, 1));
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (string | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    days.push(`${year}-${mm}-${dd}`);
  }
  return days;
}

function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getActiveMoonForDate(dateStr: string, allPhases: Phase[]): Phase | null {
  // Find which lunar phase window is active for this date
  // A phase is "active" from its date until the next phase date
  const sorted = [...allPhases].sort((a, b) => a.date.localeCompare(b.date));
  let active: Phase | null = null;
  for (const phase of sorted) {
    if (phase.date <= dateStr) active = phase;
    else break;
  }
  return active;
}

function getExactPhase(dateStr: string, allPhases: Phase[]): Phase | null {
  return allPhases.find((p) => p.date === dateStr) ?? null;
}

// ── Task storage ──────────────────────────────────────────────
interface Task { id: string; text: string; done: boolean; date_str?: string }

function loadTasks(dateStr: string): Task[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`tasks:${dateStr}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveTasks(dateStr: string, tasks: Task[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`tasks:${dateStr}`, JSON.stringify(tasks));
}

function hasTasks(dateStr: string): boolean {
  if (typeof window === 'undefined') return false;
  const raw = localStorage.getItem(`tasks:${dateStr}`);
  if (!raw) return false;
  try {
    const tasks: Task[] = JSON.parse(raw);
    return tasks.length > 0;
  } catch { return false; }
}

// ── Day Panel ─────────────────────────────────────────────────
function DayPanel({ dateStr, allPhases, onClose, user, onTasksChange }: {
  dateStr: string;
  allPhases: Phase[];
  onClose: () => void;
  user: User | null;
  onTasksChange: () => void;
}) {
  const exactPhase = getExactPhase(dateStr, allPhases);
  const activeMoon = getActiveMoonForDate(dateStr, allPhases);
  const cycle = activeMoon ? CYCLES.find((c) => c.id === activeMoon.cycleId) : null;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      supabase.from('activities').select('*').eq('date_str', dateStr).eq('user_id', user.id).then(({ data }) => {
        if (data) setTasks(data);
      });
    } else {
      setTasks(loadTasks(dateStr));
    }
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [dateStr, user, supabase]);

  const persistAndSet = useCallback((next: Task[]) => {
    setTasks(next);
    saveTasks(dateStr, next);
  }, [dateStr]);

  const addTask = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    
    if (user) {
      const { data } = await supabase.from('activities').insert({ user_id: user.id, date_str: dateStr, text, done: false }).select().single();
      if (data) {
        setTasks(prev => [...prev, data]);
        onTasksChange();
      }
    } else {
      const next = [...tasks, { id: Date.now().toString(), text, done: false }];
      persistAndSet(next);
      onTasksChange();
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    if (user) {
      setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
      await supabase.from('activities').update({ done: !task.done }).eq('id', id);
    } else {
      persistAndSet(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
    }
  };

  const deleteTask = async (id: string) => {
    if (user) {
      setTasks(tasks.filter(t => t.id !== id));
      await supabase.from('activities').delete().eq('id', id);
      onTasksChange();
    } else {
      persistAndSet(tasks.filter((t) => t.id !== id));
      onTasksChange();
    }
  };

  // Format date for display
  const d = new Date(dateStr + 'T12:00:00');
  const dayOfWeek = DAYS_FULL_ES[getMondayFirstDay(d)];
  const dayNum = d.getDate();
  const monthName = MONTHS_ES[d.getMonth()];

  return (
    <div
      className="animate-fade-in"
      style={{
        marginTop: '1.5rem',
        border: '1px solid var(--border)',
        borderRadius: 16,
        background: 'var(--card-bg)',
        overflow: 'hidden',
      }}
    >
      {/* Panel header */}
      <div
        style={{
          padding: '1.25rem 1.5rem 1rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>
            {dayOfWeek}
          </div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.5rem',
              fontWeight: 300,
              lineHeight: 1.1,
            }}
          >
            {dayNum} de {monthName}
          </div>

          {/* Moon context */}
          {activeMoon && (
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1rem' }}>{activeMoon.moon}</span>
              <span style={{ color: 'var(--accent)', fontSize: '0.75rem' }}>
                {exactPhase ? activeMoon.name : `En ${activeMoon.name}`}
              </span>
              {cycle && (
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                  · {cycle.glyph} {cycle.sign}
                </span>
              )}
              {exactPhase?.isSolarEvent && (
                <span
                  style={{
                    fontSize: '0.6rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '0.1rem 0.4rem',
                    border: '1px solid var(--accent)',
                    borderRadius: 4,
                    color: 'var(--accent)',
                  }}
                >
                  ✦ {exactPhase.isSolarEvent}
                </span>
              )}
            </div>
          )}

          {/* Phase theme on exact phase days */}
          {exactPhase && (
            <p
              style={{
                marginTop: '0.6rem',
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                maxWidth: 420,
              }}
            >
              {exactPhase.theme}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            padding: '0.25rem',
            lineHeight: 1,
            fontSize: '1.2rem',
          }}
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      {/* Task list */}
      <div style={{ padding: '1rem 1.5rem' }}>
        <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Actividades del día
        </div>

        {tasks.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.5rem 0.6rem',
                  borderRadius: 8,
                  background: task.done ? 'transparent' : 'var(--card-hover)',
                  transition: 'background 0.2s',
                }}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.done ? 'var(--accent)' : 'var(--text-secondary)', padding: 0, display: 'flex', flexShrink: 0 }}
                >
                  {task.done ? <CheckSquare size={15} /> : <Square size={15} />}
                </button>
                <span
                  style={{
                    flex: 1,
                    fontSize: '0.875rem',
                    color: task.done ? 'var(--text-secondary)' : 'var(--text-primary)',
                    textDecoration: task.done ? 'line-through' : 'none',
                    lineHeight: 1.4,
                  }}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 0, display: 'flex', opacity: 0.5 }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add task input */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addTask(); }}
            placeholder="Añadir actividad…"
            style={{
              flex: 1,
              padding: '0.5rem 0.75rem',
              border: '1px solid var(--border)',
              borderRadius: 8,
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={addTask}
            style={{
              padding: '0.5rem 0.7rem',
              border: '1px solid var(--border)',
              borderRadius: 8,
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Plus size={15} />
          </button>
        </div>

        {/* Suggestions from phase on exact phase days */}
        {exactPhase && exactPhase.suggestions.length > 0 && (
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
              Sugerencias lunares
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {exactPhase.suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  style={{
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    padding: '0.2rem 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.4rem',
                  }}
                >
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>+</span>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function CalendarioPage() {
  const today = new Date();
  const todayStr = toDateStr(today);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr);
  const [, forceUpdate] = useState(0);

  const [user, setUser] = useState<User | null>(null);
  const [activeDates, setActiveDates] = useState<Set<string>>(new Set());
  const supabase = createClient();

  const loadActiveDates = useCallback(async (currUser: User | null) => {
    if (currUser) {
      const { data } = await supabase.from('activities').select('date_str').eq('user_id', currUser.id);
      if (data) {
        setActiveDates(new Set(data.map(d => d.date_str)));
      }
    } else {
      const localDates = new Set<string>();
      if (typeof window !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('tasks:')) {
            const val = localStorage.getItem(key);
            if (val && val !== '[]') localDates.add(key.replace('tasks:', ''));
          }
        }
      }
      setActiveDates(localDates);
    }
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      loadActiveDates(data.user);
    });
  }, [supabase, loadActiveDates]);

  const allPhases = getAllPhases();
  const days = getCalendarDays(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  // Rerender when tasks change so dot indicators update
  const handleClose = () => {
    setSelectedDate(null);
    forceUpdate((n) => n + 1);
  };

  const handleSelectDate = (dateStr: string) => {
    if (selectedDate === dateStr) {
      handleClose();
    } else {
      setSelectedDate(dateStr);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.2rem',
            fontWeight: 300,
          }}
        >
          Planificador Lunar
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Haz clic en cualquier día para añadir actividades
        </p>
      </div>

      {/* Month navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}
      >
        <button
          onClick={prevMonth}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.25rem' }}
        >
          <ChevronLeft size={20} />
        </button>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem' }}>
          {MONTHS_ES[viewMonth]} {viewYear}
        </div>
        <button
          onClick={nextMonth}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.25rem' }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day labels — Monday first */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.4rem' }}>
        {DAYS_ES.map((d) => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-secondary)', padding: '0.2rem 0', letterSpacing: '0.05em' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
        {days.map((dateStr, i) => {
          if (!dateStr) return <div key={`empty-${i}`} />;

          const exactPhase = getExactPhase(dateStr, allPhases);
          const activeMoon = getActiveMoonForDate(dateStr, allPhases);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const hasEntries = activeDates.has(dateStr);

          return (
            <button
              key={dateStr}
              onClick={() => handleSelectDate(dateStr)}
              title={exactPhase ? `${exactPhase.moon} ${exactPhase.name}` : activeMoon ? activeMoon.moon : ''}
              style={{
                aspectRatio: '1',
                border: `1px solid ${isSelected ? 'var(--accent)' : isToday ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 8,
                background: isSelected
                  ? 'var(--card-hover)'
                  : isToday
                    ? 'var(--card-bg)'
                    : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.1rem',
                transition: 'all 0.15s',
                position: 'relative',
                opacity: exactPhase ? 1 : activeMoon ? 0.85 : 0.6,
              }}
            >
              {/* Day number */}
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: isToday ? 500 : 300,
                  color: isToday ? 'var(--accent)' : 'var(--text-primary)',
                  lineHeight: 1,
                }}
              >
                {parseInt(dateStr.split('-')[2])}
              </span>

              {/* Moon emoji — show for phase days, tiny dot for others in range */}
              {exactPhase ? (
                <span style={{ fontSize: '0.7rem', lineHeight: 1 }}>{exactPhase.moon}</span>
              ) : activeMoon ? (
                <span style={{ fontSize: '0.45rem', lineHeight: 1, opacity: 0.4 }}>{activeMoon.moon}</span>
              ) : null}

              {/* Task dot */}
              {hasEntries && (
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    position: 'absolute',
                    bottom: 4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '1rem',
          flexWrap: 'wrap',
          color: 'var(--text-secondary)',
          fontSize: '0.7rem',
        }}
      >
        {(['🌑 Luna Nueva', '🌓 Cuarto Creciente', '🌕 Luna Llena', '🌗 Cuarto Menguante'] as const).map((label) => (
          <span key={label}>{label}</span>
        ))}
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'inline-block',
            }}
          />
          Con actividades
        </span>
      </div>

      {/* Day panel */}
      {selectedDate && (
        <DayPanel
          dateStr={selectedDate}
          allPhases={allPhases}
          onClose={handleClose}
          user={user}
          onTasksChange={() => loadActiveDates(user)}
        />
      )}
    </div>
  );
}
