import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookingConfirmation } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-success-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-[80vh] bg-slate-50 flex items-center justify-center py-16 px-4">
      <div class="max-w-lg w-full">
        <div class="card p-8 md:p-10 text-center fade-in">
          <!-- Success icon -->
          <div class="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>

          <h1 class="font-serif text-3xl font-bold text-slate-900 mb-3">
            Booking confirmed
          </h1>
          <p class="text-slate-600 mb-8">
            Your consultation has been successfully scheduled. A confirmation has been prepared for your email.
          </p>

          @if (booking()) {
            <div class="bg-slate-50 rounded-xl p-5 text-left text-sm space-y-3 mb-8">
              <div class="flex justify-between">
                <span class="text-slate-500">Booking ID</span>
                <span class="font-mono font-semibold text-primary-800">{{ booking()!.bookingId }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Service</span>
                <span class="font-medium">{{ booking()!.serviceName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Date</span>
                <span class="font-medium">{{ formatDate(booking()!.date) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Time</span>
                <span class="font-medium">{{ booking()!.time }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Client</span>
                <span class="font-medium">{{ booking()!.clientName }}</span>
              </div>
            </div>
          }

          <div class="space-y-3">
            <p class="text-sm text-slate-500">
              This slot has been reserved and marked as busy (Google Calendar ready).
            </p>
            <a routerLink="/" class="btn-primary w-full">
              Back to home
            </a>
            <a routerLink="/book" class="btn-secondary w-full">
              Book another appointment
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SuccessPageComponent implements OnInit {
  private router = inject(Router);
  private bookingService = inject(BookingService);

  booking = signal<BookingConfirmation | null>(null);

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { booking?: BookingConfirmation } | undefined;
    
    // Fallback for refresh: try history state
    const historyState = history.state as { booking?: BookingConfirmation };
    
    const data = state?.booking || historyState?.booking || null;
    this.booking.set(data);

    if (!data) {
      // If no booking data, redirect home after short delay
      setTimeout(() => this.router.navigate(['/']), 2500);
    }
  }

  formatDate(dateStr: string): string {
    return this.bookingService.formatDate(dateStr);
  }
}
