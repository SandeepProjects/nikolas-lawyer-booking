export interface AppointmentDraft {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  contactPreference: 'email' | 'phone';
  legalArea: string;
  notes: string;
  consent: boolean;
  website: string;
}

export interface SavedAppointment extends AppointmentDraft {
  bookingId: string;
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  price: number;
  date: string;
  time: string;
  timezone: string;
  status: 'saved' | 'cancelled';
  createdAt: string;
}

export interface CalendarSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}
