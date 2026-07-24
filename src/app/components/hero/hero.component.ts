import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white">
      <!-- Subtle pattern -->
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 40px 40px;"></div>
      
      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28 lg:py-32">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm mb-6 backdrop-blur-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Accepting new clients · Cyprus
          </div>

          <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Clear legal advice.<br>
            <span class="text-primary-300">Book in under a minute.</span>
          </h1>

          <p class="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            Confidential consultations with Nikolas. No long forms, no waiting on hold — 
            choose a time that works for you and review a clear local summary.
          </p>

          <div class="flex flex-col sm:flex-row gap-4">
            <a routerLink="/book" class="btn-primary bg-white text-primary-900 hover:bg-slate-100 shadow-lg text-base px-8 py-4">
              Book Your Consultation
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
            <a href="#how-it-works" class="btn-secondary bg-transparent border-white/30 text-white hover:bg-white/10">
              How it works
            </a>
          </div>

          <!-- Trust indicators -->
          <div class="mt-14 flex flex-wrap items-center gap-8 text-sm text-slate-400">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Instant confirmation
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Cyprus timezone shown
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Privacy-conscious intake
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HeroComponent {}
