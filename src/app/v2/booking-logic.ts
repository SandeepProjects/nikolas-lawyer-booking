export interface BusyInterval {
  date: string;
  startMinute: number;
  durationMinutes: number;
}

export interface LocalDateParts {
  year: number;
  month: number;
  day: number;
}

export function timeToMinutes(time: string): number {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match) throw new Error(`Invalid time: ${time}`);
  return Number(match[1]) * 60 + Number(match[2]);
}

export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function intervalsOverlap(
  firstStart: number,
  firstDuration: number,
  secondStart: number,
  secondDuration: number
): boolean {
  return firstStart < secondStart + secondDuration && secondStart < firstStart + firstDuration;
}

export function createSlotTimes(
  openingMinute: number,
  closingMinute: number,
  durationMinutes: number,
  intervalMinutes: number
): string[] {
  const slots: string[] = [];
  for (
    let start = openingMinute;
    start + durationMinutes <= closingMinute;
    start += intervalMinutes
  ) {
    slots.push(minutesToTime(start));
  }
  return slots;
}

export function getDateKeyInZone(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values['year']}-${values['month']}-${values['day']}`;
}

export function addCalendarDays(dateKey: string, amount: number): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + amount, 12));
  return [
    date.getUTCFullYear(),
    (date.getUTCMonth() + 1).toString().padStart(2, '0'),
    date.getUTCDate().toString().padStart(2, '0')
  ].join('-');
}

export function isWeekday(dateKey: string): boolean {
  const [year, month, day] = dateKey.split('-').map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
  return weekday !== 0 && weekday !== 6;
}

export function formatDateKey(dateKey: string, options?: Intl.DateTimeFormatOptions): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}
