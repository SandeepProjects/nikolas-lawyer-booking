import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { ServiceType } from '../../models/booking.model';
import { BookingCalendarComponent } from '../../components/booking-calendar/booking-calendar.component';
import { BookingFormComponent } from '../../components/booking-form/booking-form.component';

@Component({
  selector: 'app-book-page',
  standalone: true,
  imports: [CommonModule, BookingCalendarComponent, BookingFormComponent],
  template: `
    <div class="min-h-[80vh] bg-slate-50 py-10 md:py-16">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <!-- Header -->
        <div class="text-center mb-10">
          <h1 class="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Book your consultation
          </h1>
          <p class="text-slate-600">Select a service, choose a time, and confirm in a few clicks.</p>
        </div>

        <!-- Progress steps -->
        <div class="flex items-center justify-center gap-2 mb-10">
          <div class="flex items-center gap-2">
            <div [class]="step() >= 1 ? 'bg-primary-700 text-white' : 'bg-slate-200 text-slate-500'"
                 class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <span class="text-sm font-medium hidden sm:inline" [class]="step() >= 1 ? 'text-primary-800' : 'text-slate-400'">Service</span>
          </div>
          <div class="w-8 h-px bg-slate-300"></div>
          <div class="flex items-center gap-2">
            <div [class]="step() >= 2 ? 'bg-primary-700 text-white' : 'bg-slate-200 text-slate-500'"
                 class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <span class="text-sm font-medium hidden sm:inline" [class]="step() >= 2 ? 'text-primary-800' : 'text-slate-400'">Date & Time</span>
          </div>
          <div class="w-8 h-px bg-slate-300"></div>
          <div class="flex items-center gap-2">
            <div [class]="step() >= 3 ? 'bg-primary-700 text-white' : 'bg-slate-200 text-slate-500'"
                 class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <span class="text-sm font-medium hidden sm:inline" [class]="step() >= 3 ? 'text-primary-800' : 'text-slate-400'">Details</span>
          </div>
        </div>

        <div class="card p-6 md:p-8">
          <!-- STEP 1: Service selection -->
          @if (step() === 1) {
            <div class="fade-in space-y-4">
              <h2 class="font-semibold text-lg text-slate-900 mb-4">Choose a service</h2>
              @for (service of services; track service.id) {
                <button
                  type="button"
                  (click)="selectService(service)"
                  class="w-full text-left p-4 rounded-xl border-2 transition-colors duration-150 hover:border-primary-300 hover:bg-primary-50/50"
                  [class]="selectedService()?.id === service.id ? 'border-primary-600 bg-primary-50' : 'border-slate-200'">
                  <div class="flex justify-between items-start">
                    <div>
                      <div class="font-semibold text-slate-900">{{ service.name }}</div>
                      <div class="text-sm text-slate-600 mt-1">{{ service.description }}</div>
                    </div>
                    <div class="text-right ml-4">
                      <div class="font-bold text-primary-800">{{ service.price }}</div>
                      <div class="text-xs text-slate-500">{{ service.durationMinutes }} min</div>
                    </div>
                  </div>
                </button>
              }
              <div class="pt-4">
                <button
                  type="button"
                  (click)="goToStep(2)"
                  [disabled]="!selectedService()"
                  class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue to date & time
                </button>
              </div>
            </div>
          }

          <!-- STEP 2: Calendar -->
          @if (step() === 2) {
            <div class="fade-in">
              <div class="flex items-center justify-between mb-6">
                <h2 class="font-semibold text-lg text-slate-900">Select date & time</h2>
                <button type="button" (click)="goToStep(1)" class="text-sm text-primary-700 hover:underline">
                  ← Change service
                </button>
              </div>
              
              @if (selectedService()) {
                <div class="mb-6 p-3 bg-slate-50 rounded-lg text-sm flex justify-between">
                  <span class="text-slate-600">Selected:</span>
                  <span class="font-medium">{{ selectedService()!.name }} · {{ selectedService()!.price }}</span>
                </div>
              }

              <app-booking-calendar
                (dateTimeSelected)="onDateTimeSelected($event)">
              </app-booking-calendar>

              <div class="pt-6">
                <button
                  type="button"
                  (click)="goToStep(3)"
                  [disabled]="!selectedDate() || !selectedTime()"
                  class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue to your details
                </button>
              </div>
            </div>
          }

          <!-- STEP 3: Client form -->
          @if (step() === 3) {
            <div class="fade-in">
              <div class="flex items-center justify-between mb-6">
                <h2 class="font-semibold text-lg text-slate-900">Your details</h2>
                <button type="button" (click)="goToStep(2)" class="text-sm text-primary-700 hover:underline">
                  ← Change time
                </button>
              </div>

              <app-booking-form
                [service]="selectedService()"
                [date]="selectedDate()"
                [time]="selectedTime()"
                (formSubmitted)="onFormSubmitted($event)">
              </app-booking-form>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class BookPageComponent implements OnInit {
  private bookingService = inject(BookingService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  services = this.bookingService.services;
  step = signal(1);
  selectedService = signal<ServiceType | null>(null);
  selectedDate = signal<string | null>(null);
  selectedTime = signal<string | null>(null);

  ngOnInit() {
    // Pre-select service from query param
    const serviceId = this.route.snapshot.queryParamMap.get('service');
    if (serviceId) {
      const found = this.services.find(s => s.id === serviceId);
      if (found) {
        this.selectedService.set(found);
        this.step.set(2);
      }
    }
  }

  selectService(service: ServiceType) {
    this.selectedService.set(service);
  }

  onDateTimeSelected(event: { date: string; time: string }) {
    this.selectedDate.set(event.date);
    this.selectedTime.set(event.time);
  }

  goToStep(n: number) {
    this.step.set(n);
  }

  onFormSubmitted(details: { name: string; email: string; phone: string; notes: string }) {
    const service = this.selectedService();
    const date = this.selectedDate();
    const time = this.selectedTime();

    if (!service || !date || !time) return;

    const confirmation = this.bookingService.createBooking({
      serviceId: service.id,
      serviceName: service.name,
      date,
      time,
      durationMinutes: service.durationMinutes,
      clientName: details.name,
      clientEmail: details.email,
      clientPhone: details.phone,
      notes: details.notes,
      createdAt: new Date().toISOString()
    });

    // Navigate to success with booking data
    this.router.navigate(['/success'], {
      state: { booking: confirmation }
    });
  }
}
