import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="site-header">
      <div class="nav-edge">
        <a routerLink="/" class="wordmark" aria-label="Nikolas Leontides Legal Practice Nicosia Home">
          <span class="wordmark__mark" aria-hidden="true">N</span>
          <span>
            <strong>Nikolas Leontides</strong>
            <small>Advocate & Legal Consultant · Cyprus</small>
          </span>
        </a>
        <nav class="nav-links" aria-label="Main Navigation">
          <a routerLink="/" fragment="about" class="nav-link">About</a>
          <a routerLink="/" fragment="practice-areas" class="nav-link">Practice Areas</a>
          <a routerLink="/" fragment="services" class="nav-link">Services & Fees</a>
          <a routerLink="/" fragment="faq" class="nav-link">FAQ</a>
        </nav>
        <a routerLink="/book" class="button button--outline button--compact">Book Consultation</a>
      </div>
    </header>
  `
})
export class SiteHeaderComponent {}

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="foot-mast">
        <div>
          <p class="foot-mast__wordmark">Nikolas Leontides</p>
          <p class="foot-mast__tagline">Advocate & Legal Consultant · Independent Practice in Cyprus since 2014 (UNIC BA LLB 2013).</p>
        </div>
        <nav class="foot-mast__links" aria-label="Footer Navigation">
          <a routerLink="/">Home</a>
          <a routerLink="/" fragment="about">About Nikolas</a>
          <a routerLink="/" fragment="practice-areas">Practice Areas</a>
          <a routerLink="/book">Book Consultation</a>
          <a routerLink="/privacy">Privacy Policy</a>
          <a routerLink="/terms">Terms of Service</a>
        </nav>
      </div>
      <div class="foot-meta">
        <p>© {{ year }} Nikolas Leontides Law Office. All rights reserved. Nicosia, Cyprus. Designed and Developed by <a href="https://sandeep-gautam.com" target="_blank" rel="noopener">Sandeep Gautam</a>.</p>
        <p>All appointment scheduling managed in Europe/Nicosia timezone.</p>
      </div>
    </footer>
  `
})
export class SiteFooterComponent {
  readonly year = new Date().getFullYear();
}
