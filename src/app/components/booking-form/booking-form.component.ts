import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceType } from '../../models/booking.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" class="space-y-5">
      <div>
        <label class="label" for="clientName">Full name *</label>
        <input
          id="clientName"
          type="text"
          [(ngModel)]="name"
          name="clientName"
          required
          class="input-field"
          placeholder="Your full name"
          autocomplete="name">
      </div>

      <div>
        <label class="label" for="clientEmail">Email address *</label>
        <input
          id="clientEmail"
          type="email"
          [(ngModel)]="email"
          name="clientEmail"
          required
          class="input-field"
          placeholder="you@example.com"
          autocomplete="email">
      </div>

      <div>
        <label class="label" for="clientPhone">Phone number *</label>
        <input
          id="clientPhone"
          type="tel"
          [(ngModel)]="phone"
          name="clientPhone"
          required
          class="input-field"
          placeholder="+357 99 123 456"
          autocomplete="tel">
      </div>

      <div>
        <label class="label" for="notes">Brief description of your matter (optional)</label>
        <textarea
          id="notes"
          [(ngModel)]="notes"
          name="notes"
          rows="3"
          class="input-field resize-none"
          placeholder="A few words help prepare for the consultation..."></textarea>
      </div>

      <!-- Summary -->
      @if (service && date && time) {
        <div class="bg-primary-50 border border-primary-100 rounded-xl p-4 text-sm">
          <div class="font-semibold text-primary-900 mb-2">Booking summary</div>
          <div class="space-y-1 text-primary-800">
            <div class="flex justify-between">
              <span>Service</span>
              <span class="font-medium">{{ service.name }}</span>
            </div>
            <div class="flex justify-between">
              <span>Date</span>
              <span class="font-medium">{{ formatDate(date) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Time</span>
              <span class="font-medium">{{ time }}</span>
            </div>
            <div class="flex justify-between">
              <span>Duration</span>
              <span class="font-medium">{{ service.durationMinutes }} min</span>
            </div>
            <div class="flex justify-between pt-2 border-t border-primary-200 mt-2">
              <span>Fee</span>
              <span class="font-bold text-base">{{ service.price }}</span>
            </div>
          </div>
        </div>
      }

      <button
        type="submit"
        [disabled]="!isValid()"
        class="btn-primary w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
        Confirm Booking
      </button>

      <p class="text-xs text-center text-slate-500">
        By booking you agree to the confidentiality terms. You will receive a confirmation email.
      </p>
    </form>
  `
})
export class BookingFormComponent {
  @Input() service: ServiceType | null = null;
  @Input() date: string | null = null;
  @Input() time: string | null = null;
  @Output() formSubmitted = new EventEmitter<{
    name: string;
    email: string;
    phone: string;
    notes: string;
  }>();

  name = '';
  email = '';
  phone = '';
  notes = '';

  isValid(): boolean {
    return !!(this.name.trim() && this.email.trim() && this.phone.trim() && this.service && this.date && this.time);
  }

  onSubmit() {
    if (!this.isValid()) return;
    this.formSubmitted.emit({
      name: this.name.trim(),
      email: this.email.trim(),
      phone: this.phone.trim(),
      notes: this.notes.trim()
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  }
}
