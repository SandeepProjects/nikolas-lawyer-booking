import assert from 'node:assert/strict';
import test from 'node:test';
import {
  addCalendarDays,
  createSlotTimes,
  getDateKeyInZone,
  intervalsOverlap,
  minutesToTime,
  timeToMinutes
} from '../src/app/v2/booking-logic';

test('time conversion is reversible', () => {
  assert.equal(timeToMinutes('14:30'), 870);
  assert.equal(minutesToTime(870), '14:30');
});

test('60-minute appointments never begin after 16:00 when closing is 17:00', () => {
  const slots = createSlotTimes(9 * 60, 17 * 60, 60, 30);
  assert.equal(slots.at(-1), '16:00');
  assert.equal(slots.includes('16:30'), false);
});

test('45-minute appointments reserve the complete interval', () => {
  assert.equal(intervalsOverlap(10 * 60, 45, 10 * 60 + 30, 30), true);
  assert.equal(intervalsOverlap(10 * 60, 30, 10 * 60 + 30, 30), false);
});

test('calendar-day arithmetic survives month boundaries', () => {
  assert.equal(addCalendarDays('2026-07-31', 1), '2026-08-01');
});

test('Europe/Nicosia date is used instead of UTC date', () => {
  const lateUtc = new Date('2026-07-22T22:30:00.000Z');
  assert.equal(getDateKeyInZone(lateUtc, 'Europe/Nicosia'), '2026-07-23');
});
