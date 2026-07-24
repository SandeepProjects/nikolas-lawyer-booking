import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooterComponent, SiteHeaderComponent } from './v2/site-shell.components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
  template: `
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <div class="site-frame">
      <app-site-header />
      <main id="main-content" class="site-main" tabindex="-1">
        <router-outlet />
      </main>
      <app-site-footer />
    </div>
  `
})
export class AppComponent {}
