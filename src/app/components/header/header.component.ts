import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16 md:h-18">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl bg-primary-700 flex items-center justify-center text-white font-serif font-bold text-lg shadow-soft group-hover:bg-primary-800 transition-colors">
              N
            </div>
            <div class="hidden sm:block">
              <div class="font-serif font-semibold text-slate-900 text-lg leading-tight">Nikolas</div>
              <div class="text-xs text-slate-500 -mt-0.5">Legal Counsel</div>
            </div>
          </a>

          <!-- Nav -->
          <nav class="hidden md:flex items-center gap-8">
            <a routerLink="/" fragment="services" class="text-sm font-medium text-slate-600 hover:text-primary-700 transition-colors">Services</a>
            <a routerLink="/" fragment="how-it-works" class="text-sm font-medium text-slate-600 hover:text-primary-700 transition-colors">How it works</a>
            <a routerLink="/book" class="text-sm font-medium text-slate-600 hover:text-primary-700 transition-colors">Book now</a>
          </nav>

          <!-- CTA -->
          <a routerLink="/book" class="btn-primary text-sm px-5 py-2.5">
            Book Consultation
          </a>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {}
