import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentDraft, CalendarSlot } from './booking-v2.model';
import { BookingV2Service } from './booking-v2.service';
import { PracticeService } from './practice.config';

@Component({
  selector: 'app-book-v2-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="modal-backdrop" (click)="onBackdropClick($event)">
      <div class="modal-container" (click)="$event.stopPropagation()" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        
        <!-- Top-Right Close Button -->
        <button type="button" class="modal-close-btn" (click)="closeModal()" aria-label="Close booking modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <header class="modal-header">
          <div class="modal-title-wrap">
            <span class="modal-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              Live Calendar Sync
            </span>
            <h1 id="modal-title">Book a Legal Consultation</h1>
            <p>Schedule directly into Nikolas Leontides' practice calendar (Europe/Nicosia timezone).</p>
          </div>

          <nav class="booking-progress" aria-label="Booking steps">
            <ol>
              <li [class.is-current]="step() === 1" [class.is-complete]="step() > 1">
                <span>1</span><strong>Service</strong>
              </li>
              <li [class.is-current]="step() === 2" [class.is-complete]="step() > 2">
                <span>2</span><strong>Date & Time</strong>
              </li>
              <li [class.is-current]="step() === 3">
                <span>3</span><strong>Client Details</strong>
              </li>
            </ol>
          </nav>
        </header>

        <div class="modal-body">
          <div class="booking-workspace">
            <section class="booking-stage" aria-live="polite">
              @if (pageError()) {
                <div class="form-alert form-alert--error" role="alert">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>{{ pageError() }}</span>
                </div>
              }

              <!-- Step 1: Select Service -->
              @if (step() === 1) {
                <div class="stage-head">
                  <h2>Select Consultation Type</h2>
                  <p>Choose by scope, duration and fee. Upfront pricing with no hidden charges.</p>
                </div>
                <div class="service-selector" role="radiogroup" aria-label="Consultation type">
                  @for (service of services; track service.id) {
                    <button
                      type="button"
                      class="service-option"
                      [class.is-selected]="selectedService()?.id === service.id"
                      [attr.aria-pressed]="selectedService()?.id === service.id"
                      (click)="selectService(service)">
                      <span class="service-option__icon" aria-hidden="true">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                      </span>
                      <span class="service-option__name">
                        <strong>{{ service.name }}</strong>
                        <small>{{ service.suitableFor }}</small>
                      </span>
                      <span class="service-option__details">
                        <strong>{{ service.durationMinutes }} min</strong>
                        <small>€{{ service.price }}</small>
                      </span>
                    </button>
                  }
                </div>
                <div class="stage-actions stage-actions--end">
                  <button
                    type="button"
                    class="button button--primary"
                    [disabled]="!selectedService()"
                    [attr.aria-disabled]="!selectedService()"
                    (click)="openSchedule()">
                    Select Date & Time <span aria-hidden="true">→</span>
                  </button>
                </div>
              }

              <!-- Step 2: Select Date & Time Slot -->
              @if (step() === 2) {
                <div class="stage-head stage-head--with-action">
                  <div>
                    <h2>Choose Date & Time Slot</h2>
                    <p>Real-time slot availability for {{ selectedService()?.name }} ({{ selectedService()?.durationMinutes }} mins).</p>
                  </div>
                  <button type="button" class="text-button" (click)="backToServices()">Change service</button>
                </div>

                <div class="calendar-panel">
                  <fieldset class="date-picker">
                    <legend>Select a Date</legend>
                    <div class="date-picker__rail">
                      @for (date of dates; track date) {
                        <button
                          type="button"
                          class="date-option"
                          [class.is-selected]="selectedDate() === date"
                          [attr.aria-pressed]="selectedDate() === date"
                          (click)="selectDate(date)">
                          <span>{{ getDatePart(date, 'weekday') }}</span>
                          <strong>{{ getDatePart(date, 'day') }}</strong>
                          <small>{{ getDatePart(date, 'month') }}</small>
                        </button>
                      }
                    </div>
                  </fieldset>

                  @if (selectedDate()) {
                    <fieldset class="time-picker">
                      <legend>Available Slots on {{ booking.formatDate(selectedDate()!) }}</legend>
                      <div class="time-picker__grid">
                        @for (slot of slots(); track slot.id) {
                          <button
                            type="button"
                            class="time-option"
                            [class.is-selected]="selectedTime() === slot.time"
                            [class.is-unavailable]="!slot.available"
                            [disabled]="!slot.available"
                            (click)="selectTime(slot.time)">
                            {{ slot.time }}
                          </button>
                        }
                      </div>
                    </fieldset>
                  } @else {
                    <div class="calendar-empty">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      <p>Select a date above to view open time slots.</p>
                    </div>
                  }
                </div>

                <div class="stage-actions">
                  <button type="button" class="button button--outline" (click)="backToServices()">Back</button>
                  <button
                    type="button"
                    class="button button--primary"
                    [disabled]="!selectedDate() || !selectedTime()"
                    (click)="openDetails()">
                    Enter Client Details <span aria-hidden="true">→</span>
                  </button>
                </div>
              }

              <!-- Step 3: Enter Client Contact Details -->
              @if (step() === 3) {
                <div class="stage-head stage-head--with-action">
                  <div>
                    <h2>Client Information</h2>
                    <p>Enter your contact details to complete calendar reservation and email dispatch.</p>
                  </div>
                  <button type="button" class="text-button" (click)="backToSchedule()">Change time</button>
                </div>

                <form #clientForm="ngForm" class="client-form" (ngSubmit)="saveAppointment(clientForm)" novalidate>
                  <div class="form-grid">
                    <div class="field-group">
                      <label for="clientName">Full Name <span aria-hidden="true">*</span></label>
                      <input
                        id="clientName"
                        name="clientName"
                        type="text"
                        class="form-control"
                        required
                        minlength="2"
                        maxlength="80"
                        placeholder="Your full name"
                        [(ngModel)]="details.clientName"
                        #nameModel="ngModel">
                    </div>

                    <div class="field-group">
                      <label for="clientEmail">Email Address <span aria-hidden="true">*</span></label>
                      <input
                        id="clientEmail"
                        name="clientEmail"
                        type="email"
                        class="form-control"
                        required
                        maxlength="120"
                        placeholder="name@example.com"
                        [(ngModel)]="details.clientEmail"
                        #emailModel="ngModel">
                    </div>

                    <div class="field-group">
                      <label for="clientPhone">Phone Number <span aria-hidden="true">*</span></label>
                      <input
                        id="clientPhone"
                        name="clientPhone"
                        type="tel"
                        class="form-control"
                        required
                        pattern="[+0-9 ()-]{7,20}"
                        maxlength="20"
                        placeholder="+357 99 123 456"
                        [(ngModel)]="details.clientPhone"
                        #phoneModel="ngModel">
                    </div>

                    <div class="field-group">
                      <label for="legalArea">General Topic <span aria-hidden="true">*</span></label>
                      <select
                        id="legalArea"
                        name="legalArea"
                        class="form-control"
                        required
                        [(ngModel)]="details.legalArea"
                        #areaModel="ngModel">
                        <option value="" disabled>Select general legal area</option>
                        @for (area of booking.config.legalAreas; track area) {
                          <option [value]="area">{{ area }}</option>
                        }
                      </select>
                    </div>
                  </div>

                  <fieldset class="contact-choice">
                    <legend>Preferred Contact Method <span aria-hidden="true">*</span></legend>
                    <label>
                      <input type="radio" name="contactPreference" value="email" [(ngModel)]="details.contactPreference">
                      <span>Email</span>
                    </label>
                    <label>
                      <input type="radio" name="contactPreference" value="phone" [(ngModel)]="details.contactPreference">
                      <span>Phone</span>
                    </label>
                  </fieldset>

                  <div class="field-group">
                    <label for="notes">Preparation Note <span class="label-optional">(optional)</span></label>
                    <textarea
                      id="notes"
                      name="notes"
                      class="form-control"
                      rows="3"
                      maxlength="500"
                      placeholder="Brief non-confidential note..."
                      [(ngModel)]="details.notes"></textarea>
                  </div>

                  <div class="form-trap" aria-hidden="true">
                    <input id="website" name="website" type="text" tabindex="-1" autocomplete="off" [(ngModel)]="details.website">
                  </div>

                  <label class="consent-check">
                    <input type="checkbox" name="consent" required [(ngModel)]="details.consent" #consentModel="ngModel">
                    <span>
                      I confirm that I wish to book this legal consultation with Nikolas Leontides.
                    </span>
                  </label>

                  <div class="stage-actions">
                    <button type="button" class="button button--outline" (click)="backToSchedule()">Back</button>
                    <button
                      type="submit"
                      class="button button--primary"
                      [disabled]="isSubmitting()">
                      @if (isSubmitting()) {
                        <span class="button-spinner" aria-hidden="true"></span>
                        Saving Appointment...
                      } @else {
                        Confirm & Send Email
                      }
                    </button>
                  </div>
                </form>
              }
            </section>

            <!-- Sidebar Summary -->
            <aside class="booking-summary" aria-label="Booking summary">
              <h3>Appointment Summary</h3>
              @if (selectedService(); as service) {
                <dl>
                  <div><dt>Service</dt><dd>{{ service.name }}</dd></div>
                  <div><dt>Duration</dt><dd>{{ service.durationMinutes }} mins</dd></div>
                  <div><dt>Fee</dt><dd>€{{ service.price }}</dd></div>
                  <div><dt>Date</dt><dd>{{ selectedDate() ? booking.formatDate(selectedDate()!, true) : 'Not selected' }}</dd></div>
                  <div><dt>Time</dt><dd>{{ selectedTime() || 'Not selected' }}</dd></div>
                  <div><dt>Timezone</dt><dd>Europe/Nicosia</dd></div>
                </dl>
              } @else {
                <div class="booking-summary__empty">
                  <p>Select a consultation type to begin.</p>
                </div>
              }
            </aside>
          </div>
        </div>

      </div>
    </div>
  `
})
export class BookV2PageComponent implements OnInit {
  readonly booking = inject(BookingV2Service);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly services = this.booking.services;
  readonly dates = this.booking.getAvailableDates();
  readonly step = signal(1);
  readonly selectedService = signal<PracticeService | null>(null);
  readonly selectedDate = signal<string | null>(null);
  readonly selectedTime = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly pageError = signal('');
  readonly asyncSlots = signal<CalendarSlot[]>([]);
  readonly slots = computed(() => {
    const service = this.selectedService();
    const date = this.selectedDate();
    if (!service || !date) return [];
    return this.asyncSlots().length > 0
      ? this.asyncSlots()
      : this.booking.getSlots(date, service.durationMinutes);
  });

  details: AppointmentDraft = {
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    contactPreference: 'email',
    legalArea: '',
    notes: '',
    consent: false,
    website: ''
  };

  ngOnInit(): void {
    const requestedService = this.booking.getService(this.route.snapshot.queryParamMap.get('service'));
    if (requestedService) {
      this.selectedService.set(requestedService);
      this.step.set(2);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }

  closeModal(): void {
    void this.router.navigate(['/']);
  }

  selectService(service: PracticeService): void {
    if (this.selectedService()?.id !== service.id) {
      this.selectedDate.set(null);
      this.selectedTime.set(null);
      this.asyncSlots.set([]);
    }
    this.selectedService.set(service);
    this.pageError.set('');
  }

  openSchedule(): void {
    if (this.selectedService()) this.step.set(2);
  }

  async selectDate(date: string): Promise<void> {
    this.selectedDate.set(date);
    this.selectedTime.set(null);
    this.pageError.set('');
    const service = this.selectedService();
    if (service) {
      const liveSlots = await this.booking.getSlotsAsync(date, service.durationMinutes);
      this.asyncSlots.set(liveSlots);
    }
  }

  selectTime(time: string): void {
    this.selectedTime.set(time);
    this.pageError.set('');
  }

  openDetails(): void {
    if (this.selectedDate() && this.selectedTime()) this.step.set(3);
  }

  backToServices(): void {
    this.step.set(1);
    this.selectedDate.set(null);
    this.selectedTime.set(null);
    this.asyncSlots.set([]);
  }

  backToSchedule(): void {
    this.step.set(2);
    this.pageError.set('');
  }

  async saveAppointment(form: NgForm): Promise<void> {
    form.control.markAllAsTouched();
    if (form.invalid || this.isSubmitting()) return;

    const service = this.selectedService();
    const date = this.selectedDate();
    const time = this.selectedTime();
    if (!service || !date || !time) {
      this.pageError.set('Review the consultation, date and time before saving.');
      return;
    }

    this.isSubmitting.set(true);
    this.pageError.set('');
    try {
      await this.booking.createAppointmentAsync(service, date, time, this.details);
      void this.router.navigate(['/success']);
    } catch (error) {
      this.pageError.set(error instanceof Error ? error.message : 'Choose another time and try again.');
      this.selectedTime.set(null);
      this.step.set(2);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  getDatePart(date: string, part: 'weekday' | 'day' | 'month'): string {
    const [year, month, day] = date.split('-').map(Number);
    const value = new Date(Date.UTC(year, month - 1, day, 12));
    if (part === 'day') return day.toString();
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'UTC',
      [part]: part === 'weekday' ? 'short' : 'short'
    }).format(value);
  }
}
