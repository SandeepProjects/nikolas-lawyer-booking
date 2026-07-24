import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-slate-900 text-slate-300">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <!-- Brand -->
          <div>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white font-serif font-bold">
                N
              </div>
              <span class="font-serif font-semibold text-white text-lg">Nikolas Legal</span>
            </div>
            <p class="text-sm text-slate-400 leading-relaxed">
              Confidential legal consultations for individuals and businesses across Cyprus. 
              Book online in under 60 seconds.
            </p>
          </div>

          <!-- Quick links -->
          <div>
            <h4 class="text-white font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/" class="hover:text-white transition-colors">Home</a></li>
              <li><a routerLink="/book" class="hover:text-white transition-colors">Book Appointment</a></li>
              <li><a href="#services" class="hover:text-white transition-colors">Services</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="text-white font-semibold mb-4">Contact</h4>
            <ul class="space-y-2 text-sm text-slate-400">
              <li>Nicosia & Larnaca, Cyprus</li>
              <li>Available Mon–Fri, 09:00–17:00</li>
              <li class="pt-2">
                <span class="text-slate-500">Secure online booking</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {{ currentYear }} Nikolas Legal. All rights reserved.</p>
          <p>Frontend booking system · Google Calendar ready</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
