import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { addCalendarDays, createSlotTimes, formatDateKey, getDateKeyInZone, intervalsOverlap, isWeekday, timeToMinutes } from './booking-logic';
import { AppointmentDraft, CalendarSlot, SavedAppointment } from './booking-v2.model';
import { PRACTICE_CONFIG, PracticeService } from './practice.config';
import { environment } from '../../environments/environment';

const BOOKINGS_KEY = 'nikolas-legal-demo-bookings-v2';
const CONFIRMATION_KEY = 'nikolas-legal-demo-confirmation-v2';

export interface BusyInterval {
  date: string;
  startMinute: number;
  durationMinutes: number;
}

export interface AvailabilityResponse {
  configured: boolean;
  date: string;
  busyIntervals: BusyInterval[];
}

export interface BookingApiResponse {
  success: boolean;
  googleCalendarConnected: boolean;
  bookingId: string;
  eventId?: string;
  htmlLink?: string;
  meetLink?: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class BookingV2Service {
  private readonly http = inject(HttpClient, { optional: true });
  readonly config = PRACTICE_CONFIG;
  readonly services = PRACTICE_CONFIG.services;
  readonly apiBaseUrl = environment.apiBaseUrl || 'http://localhost:3000/api';

  getService(id: string | null): PracticeService | null {
    return this.services.find((service) => service.id === id) ?? null;
  }

  getAvailableDates(): string[] {
    const today = getDateKeyInZone(new Date(), this.config.timezone);
    const dates: string[] = [];
    for (let offset = 1; offset <= this.config.bookingWindowDays; offset += 1) {
      const date = addCalendarDays(today, offset);
      if (isWeekday(date)) dates.push(date);
    }
    return dates;
  }

  /**
   * Synchronous getSlots for immediate rendering & backward compatibility.
   */
  getSlots(date: string, durationMinutes: number, extraBusy: BusyInterval[] = []): CalendarSlot[] {
    const stored = this.getSavedAppointments().filter((booking) => booking.status === 'saved');
    const busy = [
      ...this.getDemoBusyIntervals(),
      ...extraBusy,
      ...stored.map((booking) => ({
        date: booking.date,
        startMinute: timeToMinutes(booking.time),
        durationMinutes: booking.durationMinutes
      }))
    ];

    return createSlotTimes(
      this.config.openingMinute,
      this.config.closingMinute,
      durationMinutes,
      this.config.slotIntervalMinutes
    ).map((time) => {
      const startMinute = timeToMinutes(time);
      const available = !busy.some((interval) =>
        interval.date === date &&
        intervalsOverlap(startMinute, durationMinutes, interval.startMinute, interval.durationMinutes)
      );
      return {
        id: `${date}-${time}`,
        date,
        time,
        available
      };
    });
  }

  /**
   * Async getSlots that queries the Google Calendar API backend if connected.
   */
  async getSlotsAsync(date: string, durationMinutes: number): Promise<CalendarSlot[]> {
    if (!this.http) return this.getSlots(date, durationMinutes);
    try {
      const res = await firstValueFrom(
        this.http.get<AvailabilityResponse>(`${this.apiBaseUrl}/availability`, {
          params: { date, durationMinutes: durationMinutes.toString() }
        })
      );
      return this.getSlots(date, durationMinutes, res.busyIntervals || []);
    } catch {
      // Fallback seamlessly to client-side slot calculation if server is offline
      return this.getSlots(date, durationMinutes);
    }
  }

  /**
   * Synchronous appointment creation.
   */
  createAppointment(
    service: PracticeService,
    date: string,
    time: string,
    details: AppointmentDraft
  ): SavedAppointment {
    const slot = this.getSlots(date, service.durationMinutes).find((candidate) => candidate.time === time);
    if (!slot?.available) {
      throw new Error('That time is no longer available. Choose another appointment.');
    }
    if (details.website) {
      throw new Error('The booking could not be saved.');
    }

    const appointment: SavedAppointment = {
      ...details,
      bookingId: this.createBookingId(),
      serviceId: service.id,
      serviceName: service.name,
      durationMinutes: service.durationMinutes,
      price: service.price,
      date,
      time,
      timezone: this.config.timezone,
      status: 'saved',
      createdAt: new Date().toISOString()
    };

    const bookings = this.getSavedAppointments();
    bookings.push(appointment);
    this.setLocalItem(BOOKINGS_KEY, JSON.stringify(bookings));
    this.setSessionItem(CONFIRMATION_KEY, JSON.stringify(appointment));
    return appointment;
  }

  /**
   * Async appointment creation that registers the event with the Google Calendar backend API.
   */
  async createAppointmentAsync(
    service: PracticeService,
    date: string,
    time: string,
    details: AppointmentDraft
  ): Promise<SavedAppointment> {
    const localAppointment = this.createAppointment(service, date, time, details);

    if (!this.http) return localAppointment;

    try {
      const apiResponse = await firstValueFrom(
        this.http.post<BookingApiResponse>(`${this.apiBaseUrl}/bookings`, {
          serviceName: service.name,
          durationMinutes: service.durationMinutes,
          date,
          time,
          fullName: details.clientName,
          email: details.clientEmail,
          phone: details.clientPhone,
          matter: details.legalArea,
          notes: details.notes,
          website: details.website
        })
      );

      if (apiResponse.success && apiResponse.bookingId) {
        localAppointment.bookingId = apiResponse.bookingId;
        this.setSessionItem(CONFIRMATION_KEY, JSON.stringify(localAppointment));
      }
    } catch {
      // Keep local saved appointment if server network call fails
      console.warn('Backend server notification skipped; local appointment saved.');
    }

    return localAppointment;
  }

  getLatestConfirmation(): SavedAppointment | null {
    return this.parseAppointment(this.getSessionItem(CONFIRMATION_KEY));
  }

  clearLatestConfirmation(): void {
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(CONFIRMATION_KEY);
  }

  getSavedAppointments(): SavedAppointment[] {
    const raw = this.getLocalItem(BOOKINGS_KEY);
    if (!raw) return [];
    try {
      const value = JSON.parse(raw) as SavedAppointment[];
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  formatDate(date: string, short = false): string {
    return formatDateKey(date, short
      ? { weekday: 'short', day: 'numeric', month: 'short', year: undefined }
      : undefined);
  }

  buildCalendarFile(appointment: SavedAppointment): string {
    const start = appointment.time.replace(':', '') + '00';
    const endMinutes = timeToMinutes(appointment.time) + appointment.durationMinutes;
    const end = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}${(endMinutes % 60).toString().padStart(2, '0')}00`;
    const date = appointment.date.replaceAll('-', '');
    const escape = (value: string) => value.replaceAll('\\', '\\\\').replaceAll(',', '\\,').replaceAll(';', '\\;').replaceAll('\n', '\\n');

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Nikolas Legal//Consultation Booking//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${escape(appointment.bookingId)}@nikolas-legal.local`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
      `DTSTART;TZID=${appointment.timezone}:${date}T${start}`,
      `DTEND;TZID=${appointment.timezone}:${date}T${end}`,
      `SUMMARY:${escape(appointment.serviceName)} — Nikolas`,
      `DESCRIPTION:${escape(`Booking reference ${appointment.bookingId}. Legal consultation appointment with Nikolas.`)}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }

  private getDemoBusyIntervals() {
    const today = getDateKeyInZone(new Date(), this.config.timezone);
    return [
      { date: addCalendarDays(today, 1), startMinute: 10 * 60, durationMinutes: 60 },
      { date: addCalendarDays(today, 1), startMinute: 14 * 60 + 30, durationMinutes: 30 },
      { date: addCalendarDays(today, 2), startMinute: 9 * 60 + 30, durationMinutes: 90 },
      { date: addCalendarDays(today, 3), startMinute: 15 * 60, durationMinutes: 60 }
    ];
  }

  private createBookingId(): string {
    const bytes = new Uint8Array(4);
    if (typeof crypto !== 'undefined') crypto.getRandomValues(bytes);
    const suffix = Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('').toUpperCase();
    return `NK-${suffix || Date.now().toString(36).toUpperCase()}`;
  }

  private parseAppointment(raw: string | null): SavedAppointment | null {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as SavedAppointment;
      return parsed.bookingId ? parsed : null;
    } catch {
      return null;
    }
  }

  private getLocalItem(key: string): string | null {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
  }

  private setLocalItem(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  }

  private getSessionItem(key: string): string | null {
    return typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem(key);
  }

  private setSessionItem(key: string, value: string): void {
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(key, value);
  }
}
