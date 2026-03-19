// lib/ics.ts — Gerador de arquivo .ics para exportar as fases lunares ao Google Calendar

import { CYCLES, Phase, Cycle } from './data';

/** Remove caracteres não ASCII e limpa texto para o formato iCal */
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

/** Converte uma data ISO (YYYY-MM-DD) para o formato iCal (YYYYMMDD) */
function toICSDate(isoDate: string): string {
  return isoDate.replace(/-/g, '');
}

/** Gera um UID único para cada evento */
function generateUID(phaseId: string): string {
  return `${phaseId}@lunario.app`;
}

/** Mapeia emoji de lua para descrição textual */
const moonEmoji: Record<string, string> = {
  '🌑': 'Luna Nueva',
  '🌒': 'Luna Creciente',
  '🌓': 'Cuarto Creciente',
  '🌔': 'Gibosa Creciente',
  '🌕': 'Luna Llena',
  '🌖': 'Gibosa Menguante',
  '🌗': 'Cuarto Menguante',
  '🌘': 'Luna Menguante',
};

/**
 * Calcula a data de fim de um evento:
 * - Luna Nueva / Luna Llena → 1 dia (marcador de momento)
 * - Cuarto Creciente / Cuarto Menguante → 1 dia
 * Todas as fases têm duração de 1 dia como marcador.
 * A "duração real" de cada ciclo é coberta pelo evento do ciclo inteiro.
 */
function getEndDate(startDate: string): string {
  const d = new Date(startDate + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

/** Gera o bloco VEVENT para uma fase lunar */
function phaseToVEvent(phase: Phase, cycle: Cycle): string {
  const moonName = moonEmoji[phase.moon] || phase.name;
  const summary = `${phase.moon} ${phase.name} en ${phase.sign} · ${cycle.sign}`;
  const startDate = toICSDate(phase.date);
  const endDate = getEndDate(phase.date);

  const descLines = [
    `Tema: ${phase.theme}`,
    '',
    'Sugerencias:',
    ...phase.suggestions.map((s, i) => `${i + 1}. ${s}`),
    '',
    `Ciclo ${cycle.glyph} ${cycle.sign}: ${cycle.centralTheme}`,
    '',
    phase.isSolarEvent ? `⭐ Evento Solar: ${phase.isSolarEvent}` : '',
    'Lunário · lunario.app',
  ].filter((l) => l !== undefined);

  const description = escapeICS(descLines.join('\n').trim());

  return [
    'BEGIN:VEVENT',
    `UID:${generateUID(phase.id)}`,
    `DTSTART;VALUE=DATE:${startDate}`,
    `DTEND;VALUE=DATE:${endDate}`,
    `SUMMARY:${escapeICS(summary)}`,
    `DESCRIPTION:${description}`,
    `CATEGORIES:${escapeICS(moonName)},Lunario,Astrología`,
    phase.isSolarEvent ? `COMMENT:${escapeICS(`⭐ ${phase.isSolarEvent}`)}` : '',
    'STATUS:CONFIRMED',
    'TRANSP:TRANSPARENT',
    'END:VEVENT',
  ]
    .filter(Boolean)
    .join('\r\n');
}

/** Genera un VEVENT para el ciclo completo (evento de varios días) */
function cycleToVEvent(cycle: Cycle): string {
  const summary = `${cycle.glyph} Ciclo ${cycle.sign} · ${cycle.centralTheme}`;
  const startDate = toICSDate(cycle.startDate);
  const endIso = new Date(cycle.endDate + 'T12:00:00Z');
  endIso.setUTCDate(endIso.getUTCDate() + 1);
  const endDate = endIso.toISOString().slice(0, 10).replace(/-/g, '');

  const description = escapeICS(
    `${cycle.description}\n\nPeriodo: ${cycle.period}\n\nLunário · lunario.app`
  );

  return [
    'BEGIN:VEVENT',
    `UID:cycle-${cycle.id}@lunario.app`,
    `DTSTART;VALUE=DATE:${startDate}`,
    `DTEND;VALUE=DATE:${endDate}`,
    `SUMMARY:${escapeICS(summary)}`,
    `DESCRIPTION:${description}`,
    'CATEGORIES:Ciclo Lunar,Lunario',
    'STATUS:CONFIRMED',
    'TRANSP:TRANSPARENT',
    'END:VEVENT',
  ].join('\r\n');
}

/** Gera o conteúdo completo do arquivo .ics com todos os ciclos e fases */
export function generateICS(includeCycleEvents = false): string {
  const now = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lunário//Año Astrológico 2026-2027//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:🌙 Lunário 2026-2027',
    'X-WR-CALDESC:Calendario astrológico con las 52 fases lunares del año 2026-2027. Generado por Lunário · lunario.app',
    'X-WR-TIMEZONE:Europe/Madrid',
  ];

  for (const cycle of CYCLES) {
    if (includeCycleEvents) {
      lines.push(cycleToVEvent(cycle));
    }
    for (const phase of cycle.phases) {
      lines.push(phaseToVEvent(phase, cycle));
    }
  }

  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}

/** Descarga el archivo .ics en el navegador */
export function downloadICS(includeCycleEvents = false): void {
  const content = generateICS(includeCycleEvents);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'lunario-2026-2027.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
