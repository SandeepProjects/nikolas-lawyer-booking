import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section id="services" class="py-20 md:py-28 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center max-w-2xl mx-auto mb-14">
          <h2 class="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Legal services tailored to you
          </h2>
          <p class="text-slate-600 text-lg">
            Choose the consultation that matches your needs. Every session is confidential and focused on clear next steps.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (service of services; track service.id) {
            <div class="card p-6 md:p-8 hover:shadow-lg transition-shadow duration-300 group">
              <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  @switch (service.icon) {
                    @case ('scale') {
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                      </svg>
                    }
                    @case ('document') {
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    }
                    @case ('briefcase') {
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    }
                    @default {
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                      </svg>
                    }
                  }
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-primary-800">{{ service.price }}</div>
                  <div class="text-xs text-slate-500">{{ service.durationMinutes }} min</div>
                </div>
              </div>

              <h3 class="font-serif text-xl font-semibold text-slate-900 mb-2">{{ service.name }}</h3>
              <p class="text-slate-600 text-sm leading-relaxed mb-6">{{ service.description }}</p>

              <a [routerLink]="['/book']" [queryParams]="{service: service.id}" 
                 class="inline-flex items-center text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors">
                Book this session
                <svg class="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class ServicesSectionComponent {
  private bookingService = inject(BookingService);
  services = this.bookingService.services;
}
