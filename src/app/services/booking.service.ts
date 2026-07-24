import { Injectable, signal } from '@angular/core';
import { ServiceType, TimeSlot, BookingRequest, BookingConfirmation } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  // Available legal services
  readonly services: ServiceType[] = [
    {
      id: 'initial-consultation',
      name: 'Initial Consultation',
      description: '30-minute confidential discussion of your legal matter. Perfect first step.',
      durationMinutes: 30,
      price: '€80',
      icon: 'scale'
    },
    {
      id: 'document-review',
      name: 'Document Review',
      description: 'Detailed review of contracts, agreements or legal documents with written feedback.',
      durationMinutes: 45,
      price: '€120',
      icon: 'document'
    },
    {
      id: 'full-consultation',
      name: 'Full Legal Consultation',
      description: 'In-depth 60-minute session covering strategy, options and next steps.',
      durationMinutes: 60,
      price: '€160',
      icon: 'briefcase'
    },
    {
      id: 'follow-up',
      name: 'Follow-up Session',
      description: 'Progress review and additional advice after previous consultation.',
      durationMinutes: 30,
      price: '€70',
      icon: 'refresh'
    }
  ];

  // Mock already booked slots (simulating Google Calendar busy times)
  private bookedSlots = new Set<string>([
    // Format: YYYY-MM-DD|HH:mm
    this.getDateString(1) + '|10:00',
    this.getDateString(1) + '|11:00',
    this.getDateString(1) + '|14:30',
    this.getDateString(2) + '|09:30',
    this.getDateString(2) + '|15:00',
    this.getDateString(3) + '|10:30',
    this.getDateString(3) + '|16:00',
    this.getDateString(4) + '|11:30',
    this.getDateString(5) + '|09:00',
    this.getDateString(5) + '|13:00',
  ]);

  // Current booking state (for multi-step form)
  selectedService = signal<ServiceType | null>(null);
  selectedDate = signal<string | null>(null);
  selectedTime = signal<string | null>(null);
  clientDetails = signal<Partial<BookingRequest>>({});

  private getDateString(daysFromToday: number): string {
    const d = new Date();
    d.setDate(d.getDate() + daysFromToday);
    return d.toISOString().split('T')[0];
  }

  getAvailableDates(daysAhead = 21): string[] {
    const dates: string[] = [];
    const today = new Date();
    // Skip today and weekends for professional feel, start from tomorrow
    for (let i = 1; i <= daysAhead; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const day = d.getDay();
      if (day !== 0 && day !== 6) { // Mon-Fri only
        dates.push(d.toISOString().split('T')[0]);
      }
    }
    return dates;
  }

  getTimeSlotsForDate(date: string): TimeSlot[] {
    // Working hours: 09:00 - 17:00, 30-min slots
    const slots: TimeSlot[] = [];
    const times = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30'
    ];

    times.forEach((time, index) => {
      const key = `${date}|${time}`;
      slots.push({
        id: `slot-${date}-${index}`,
        date,
        time,
        available: !this.bookedSlots.has(key)
      });
    });

    return slots;
  }

  // Simulate Google Calendar check (frontend mock)
  isSlotAvailable(date: string, time: string): boolean {
    return !this.bookedSlots.has(`${date}|${time}`);
  }

  // Create booking (frontend only – later connect to backend + Google Calendar API)
  createBooking(request: BookingRequest): BookingConfirmation {
    // Mark slot as booked in mock
    this.bookedSlots.add(`${request.date}|${request.time}`);

    const confirmation: BookingConfirmation = {
      ...request,
      bookingId: 'NK-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    // In real app: call Google Calendar API here to create event
    // and send confirmation email via backend
    return confirmation;
  }

  resetBookingState() {
    this.selectedService.set(null);
    this.selectedDate.set(null);
    this.selectedTime.set(null);
    this.clientDetails.set({});
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
