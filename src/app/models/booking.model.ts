export interface ServiceType {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: string;
  icon: string;
}

export interface TimeSlot {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  available: boolean;
  googleEventId?: string; // for future Google Calendar sync
}

export interface BookingRequest {
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  durationMinutes: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes?: string;
  createdAt: string;
}

export interface BookingConfirmation extends BookingRequest {
  bookingId: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}
