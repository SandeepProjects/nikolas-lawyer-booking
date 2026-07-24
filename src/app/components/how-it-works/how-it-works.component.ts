import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section id="how-it-works" class="py-20 md:py-28 bg-slate-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Booking takes less than a minute
          </h2>
          <p class="text-slate-600 text-lg">
            Simple, transparent process. No phone calls required.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <!-- Step 1 -->
          <div class="relative text-center">
            <div class="w-14 h-14 rounded-2xl bg-primary-700 text-white font-bold text-xl flex items-center justify-center mx-auto mb-5 shadow-soft">
              1
            </div>
            <h3 class="font-semibold text-lg text-slate-900 mb-2">Choose a service</h3>
            <p class="text-slate-600 text-sm leading-relaxed">
              Select the type of consultation that fits your needs — from quick advice to full strategy sessions.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="relative text-center">
            <div class="w-14 h-14 rounded-2xl bg-primary-700 text-white font-bold text-xl flex items-center justify-center mx-auto mb-5 shadow-soft">
              2
            </div>
            <h3 class="font-semibold text-lg text-slate-900 mb-2">Pick date & time</h3>
            <p class="text-slate-600 text-sm leading-relaxed">
              Review demonstration availability in Cyprus time. Busy example slots are clearly unavailable.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="relative text-center">
            <div class="w-14 h-14 rounded-2xl bg-primary-700 text-white font-bold text-xl flex items-center justify-center mx-auto mb-5 shadow-soft">
              3
            </div>
            <h3 class="font-semibold text-lg text-slate-900 mb-2">Confirm details</h3>
            <p class="text-slate-600 text-sm leading-relaxed">
              Enter your contact information and review a local on-screen summary before continuing.
            </p>
          </div>
        </div>

        <div class="mt-14 text-center">
          <a routerLink="/book" class="btn-primary text-base px-8 py-4">
            Start booking now
          </a>
        </div>
      </div>
    </section>
  `
})
export class HowItWorksComponent {}
