import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SavedAppointment } from './booking-v2.model';
import { BookingV2Service } from './booking-v2.service';

@Component({
  selector: 'app-success-v2-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="success-page page-shell">
      @if (appointment(); as item) {
        <header class="success-page__header">
          <div class="success-mark" aria-hidden="true">✓</div>
          <div>
            <p class="context-line">Booking confirmed!</p>
            <h1>Your appointment is recorded.</h1>
            <p>Please check your calendar. Your consultation has been scheduled with Nikolas Leontides.</p>
          </div>
        </header>

        <section class="confirmation-sheet">
          <div class="confirmation-sheet__reference">
            <span>Booking reference</span>
            <strong>{{ item.bookingId }}</strong>
            <button type="button" class="text-button" (click)="copyReference()">
              {{ copyLabel() }}
            </button>
          </div>
          <dl>
            <div><dt>Consultation</dt><dd>{{ item.serviceName }}</dd></div>
            <div><dt>Date</dt><dd>{{ booking.formatDate(item.date) }}</dd></div>
            <div><dt>Time</dt><dd>{{ item.time }}</dd></div>
            <div><dt>Duration</dt><dd>{{ item.durationMinutes }} minutes</dd></div>
            <div><dt>Timezone</dt><dd>{{ item.timezone }}</dd></div>
            <div><dt>Fee shown</dt><dd>€{{ item.price }}</dd></div>
            <div><dt>Preferred contact</dt><dd>{{ item.contactPreference === 'email' ? 'Email' : 'Phone' }}</dd></div>
          </dl>
        </section>

        <section class="next-actions">
          <div>
            <h2>Keep a personal reminder.</h2>
            <p>Download the calendar invite below to add this event directly to your personal device calendar.</p>
          </div>
          <div class="next-actions__buttons">
            <button type="button" class="button button--primary" (click)="downloadCalendar()">Add to calendar (.ics)</button>
            <button type="button" class="button button--outline" (click)="printConfirmation()">Print summary</button>
            <a routerLink="/book" class="text-link">Book another time <span aria-hidden="true">→</span></a>
          </div>
        </section>

        <div class="form-alert" role="note">
          <strong>Booking confirmed!</strong>
          <span>Please check your calendar for your appointment confirmation and details.</span>
        </div>
      } @else {
        <section class="empty-confirmation">
          <span aria-hidden="true">—</span>
          <h1>No saved appointment was found.</h1>
          <p>Open the appointment book and complete all three steps to create a local demonstration record.</p>
          <a routerLink="/book" class="button button--primary">Open appointment book</a>
        </section>
      }
    </article>
  `
})
export class SuccessV2PageComponent implements OnInit {
  readonly booking = inject(BookingV2Service);
  readonly appointment = signal<SavedAppointment | null>(null);
  readonly copyLabel = signal('Copy reference');

  ngOnInit(): void {
    this.appointment.set(this.booking.getLatestConfirmation());
  }

  async copyReference(): Promise<void> {
    const value = this.appointment()?.bookingId;
    if (!value || !navigator.clipboard) {
      this.copyLabel.set('Reference shown above');
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      this.copyLabel.set('Copied');
      window.setTimeout(() => this.copyLabel.set('Copy reference'), 2500);
    } catch {
      this.copyLabel.set('Copy unavailable');
    }
  }

  downloadCalendar(): void {
    const appointment = this.appointment();
    if (!appointment) return;
    const blob = new Blob([this.booking.buildCalendarFile(appointment)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${appointment.bookingId}.ics`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  printConfirmation(): void {
    window.print();
  }
}
