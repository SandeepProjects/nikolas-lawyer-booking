import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-legal-v2-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="legal-document page-shell">
      <header>
        <p class="context-line">Nikolas Leontides Law Office</p>
        <h1>{{ isPrivacy ? 'Privacy Policy' : 'Booking Terms' }}</h1>
        <p class="legal-document__intro">
          {{ isPrivacy
            ? 'This policy explains how client information is collected and processed when booking a consultation with Nikolas Leontides in Cyprus.'
            : 'These terms outline the booking guidelines, calendar synchronization, and consultation policies for Nikolas Leontides Law Office.' }}
        </p>
      </header>

      @if (isPrivacy) {
        <section>
          <h2>Information We Collect</h2>
          <p>When you request a legal consultation, we collect your full name, email address, phone number, general area of enquiry, preferred contact method, and optional preparation note.</p>
        </section>
        <section>
          <h2>How Your Data Is Used</h2>
          <p>Your details are used solely to schedule your appointment on Nikolas Leontides' Google Calendar and send automated confirmation and reminder emails via Resend.</p>
        </section>
        <section>
          <h2>Client Confidentiality</h2>
          <p>Please refrain from submitting confidential legal documents or sensitive evidence through the online booking form. Confidential details will be handled during your private consultation.</p>
        </section>
        <section>
          <h2>Data Protection Rights</h2>
          <p>You have the right to request access to, correction of, or deletion of your contact records by contacting Nikolas Leontides directly.</p>
        </section>
      } @else {
        <section>
          <h2>Appointment Scheduling & Calendar Sync</h2>
          <p>All online bookings reserve a time slot directly on Nikolas Leontides' live calendar in the Europe/Nicosia timezone.</p>
        </section>
        <section>
          <h2>Transparent Consultation Fees</h2>
          <p>Displayed fees are inclusive and stated in Euros (€). Fees are settled at the consultation session as agreed.</p>
        </section>
        <section>
          <h2>Rescheduling & Cancellation</h2>
          <p>If you need to adjust or cancel your appointment, please provide at least 24 hours notice by contacting the practice by phone or email.</p>
        </section>
      }

      <div class="legal-document__action">
        <a routerLink="/book" class="button button--outline">Return to booking</a>
      </div>
    </article>
  `
})
export class LegalV2PageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly isPrivacy = this.route.snapshot.data['document'] === 'privacy';
}
