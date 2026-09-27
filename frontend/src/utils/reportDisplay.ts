export const MISSING_DATE_LABEL = 'Бүртгэгдээгүй';

const utcDateOnlyFormat = new Intl.DateTimeFormat('mn-MN', {
  timeZone: 'UTC',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const localDateOnlyFormat = new Intl.DateTimeFormat('mn-MN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const dateTimeFormat = new Intl.DateTimeFormat('mn-MN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const measurementFormat = new Intl.NumberFormat('mn-MN', {
  maximumFractionDigits: 8,
});

const integerFormat = new Intl.NumberFormat('mn-MN', {
  maximumFractionDigits: 0,
});

const averageFormat = new Intl.NumberFormat('mn-MN', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

interface ParsedDate {
  date: Date;
  dateOnly: boolean;
  /** Format the UTC calendar day, so midnight timestamps do not shift a date-only value. */
  utcCalendar: boolean;
}

function isValidParts(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
): boolean {
  return (
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= 31 &&
    hour >= 0 &&
    hour <= 23 &&
    minute >= 0 &&
    minute <= 59 &&
    second >= 0 &&
    second <= 59
  );
}

function utcDate(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): Date | null {
  if (!isValidParts(year, month, day, hour, minute, second)) return null;
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

function localDate(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): Date | null {
  if (!isValidParts(year, month, day, hour, minute, second)) return null;
  const date = new Date(year, month - 1, day, hour, minute, second, 0);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

/**
 * Accepts the formats this API actually emits, plus common Mongolian wall-clock strings.
 * Compact `yyyyMMddHHmmss` is UTC (backend `formatDateTime`). Strings without a timezone
 * are treated as wall-clock time. Unparseable values return null.
 */
export function parseReportDate(value?: string | null): ParsedDate | null {
  if (value == null) return null;
  const raw = String(value).trim();
  if (!raw || raw === '-' || raw === '—' || raw.toLowerCase() === 'invalid date') {
    return null;
  }

  if (/[zZ]$|[+-]\d{2}:?\d{2}$/.test(raw)) {
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return null;
    return { date, dateOnly: false, utcCalendar: false };
  }

  const compact = raw.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  if (compact) {
    const year = Number(compact[1]);
    const month = Number(compact[2]);
    const day = Number(compact[3]);
    const hour = Number(compact[4]);
    const minute = Number(compact[5]);
    const second = Number(compact[6]);
    const date = utcDate(year, month, day, hour, minute, second);
    if (!date) return null;
    const dateOnly = hour === 0 && minute === 0 && second === 0;
    return { date, dateOnly, utcCalendar: dateOnly };
  }

  const compactDay = raw.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (compactDay) {
    const date = utcDate(Number(compactDay[1]), Number(compactDay[2]), Number(compactDay[3]));
    if (!date) return null;
    return { date, dateOnly: true, utcCalendar: true };
  }

  const dotted = raw.match(
    /^(\d{2})\.(\d{2})\.(\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/,
  );
  if (dotted) {
    const hasTime = dotted[4] !== undefined;
    const date = localDate(
      Number(dotted[3]),
      Number(dotted[2]),
      Number(dotted[1]),
      hasTime ? Number(dotted[4]) : 0,
      hasTime ? Number(dotted[5]) : 0,
      hasTime ? Number(dotted[6] ?? 0) : 0,
    );
    if (!date) return null;
    return { date, dateOnly: !hasTime, utcCalendar: false };
  }

  const isoWall = raw.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/,
  );
  if (isoWall) {
    const hasTime = isoWall[4] !== undefined;
    const date = localDate(
      Number(isoWall[1]),
      Number(isoWall[2]),
      Number(isoWall[3]),
      hasTime ? Number(isoWall[4]) : 0,
      hasTime ? Number(isoWall[5]) : 0,
      hasTime ? Number(isoWall[6] ?? 0) : 0,
    );
    if (!date) return null;
    return { date, dateOnly: !hasTime, utcCalendar: false };
  }

  const fallback = new Date(raw);
  if (Number.isNaN(fallback.getTime())) return null;
  return { date: fallback, dateOnly: false, utcCalendar: false };
}

export function formatReportDate(value?: string | null): string {
  const parsed = parseReportDate(value);
  if (!parsed) return MISSING_DATE_LABEL;
  if (
    parsed.dateOnly ||
    (parsed.date.getHours() === 0 && parsed.date.getMinutes() === 0)
  ) {
    return parsed.utcCalendar
      ? utcDateOnlyFormat.format(parsed.date)
      : localDateOnlyFormat.format(parsed.date);
  }
  return dateTimeFormat.format(parsed.date);
}

export function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  const text = String(value).trim();
  return text === '' || text === '-' || text === '—';
}

export function readField(
  source: object,
  keys: string[],
): string | number | undefined {
  const record = source as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (isEmptyValue(value)) continue;
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') return value;
  }
  return undefined;
}

export function isColumnEmpty<T>(
  rows: T[],
  read: (row: T) => unknown,
): boolean {
  return rows.every((row) => isEmptyValue(read(row)));
}

export function toNumber(value: unknown): number {
  if (isEmptyValue(value)) return 0;
  const parsed = typeof value === 'number' ? value : Number(String(value).trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatMeasurement(value: unknown): string {
  if (isEmptyValue(value)) return '—';
  const parsed = typeof value === 'number' ? value : Number(String(value).trim());
  if (!Number.isFinite(parsed)) return String(value);
  return measurementFormat.format(parsed);
}

export function formatInteger(value: unknown): string {
  return integerFormat.format(toNumber(value));
}

export function formatAverage(value: unknown): string {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return '—';
  return averageFormat.format(parsed);
}

export function formatText(value: unknown): string {
  if (isEmptyValue(value)) return '—';
  return String(value);
}
