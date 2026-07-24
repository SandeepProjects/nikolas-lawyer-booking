import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingV2Service } from './booking-v2.service';

@Component({
  selector: 'app-home-v2-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="home-page">
      <!-- Expanded Hero Section -->
      <section class="hero-banner page-shell">
        <div class="hero-banner__grid">
          <div class="hero-banner__copy">
            <span class="hero-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Advocate & Legal Consultant · Nicosia, Cyprus
            </span>
            <h1>Clear legal advice, carefully scheduled.</h1>
            <p class="hero-banner__lede">
              Independent legal counsel in Nicosia, Cyprus. Book an in-person or remote consultation directly into Nikolas Leontides' live calendar with transparent fees and instant email confirmation.
            </p>
            
            <div class="action-row">
              <a routerLink="/book" class="button button--primary button--lg">
                Book a consultation <span aria-hidden="true">→</span>
              </a>
              <a href="#about" class="button button--outline">
                Meet Nikolas Leontides
              </a>
            </div>

            <div class="trust-pills">
              <div class="trust-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                <span>UNIC BA / LLB (2013)</span>
              </div>
              <div class="trust-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Independent Practice Since 2014</span>
              </div>
              <div class="trust-pill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <span>Europe/Nicosia Timezone</span>
              </div>
            </div>
          </div>

          <!-- Hero Image & Live Ledger Card -->
          <div class="hero-banner__visual">
            <div class="image-frame hero-image-frame">
              <img src="/assets/nikolas_office.png" alt="Nikolas Leontides Law Office in Nicosia Cyprus" loading="eager" />
              <div class="image-frame__overlay">
                <div class="live-ledger-card">
                  <div class="live-ledger-card__header">
                    <div>
                      <strong>Live Calendar Sync</strong>
                      <small>Nikolas Leontides Practice</small>
                    </div>
                    <span class="status-indicator">Online</span>
                  </div>
                  <div class="live-ledger-card__service">
                    <span>{{ services[0].name }}</span>
                    <strong>{{ services[0].durationMinutes }} mins · €{{ services[0].price }}</strong>
                  </div>
                  <div class="live-ledger-card__slots">
                    @for (date of previewDates; track date; let index = $index) {
                      <div class="slot-item">
                        <span>{{ booking.formatDate(date, true) }}</span>
                        <strong>{{ index === 0 ? 'Slots available' : 'Open schedule' }}</strong>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- About Nikolas Section -->
      <section id="about" class="spacious-section page-shell bio-section">
        <div class="bio-section__grid">
          <div class="bio-section__visual">
            <div class="image-frame bio-image-frame">
              <img src="/assets/unic_nicosia.png" alt="University of Nicosia UNIC Law Department Cyprus" />
              <div class="floating-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                <div>
                  <strong>UNIC Law Alumni</strong>
                  <small>BA / LLB Class of 2013</small>
                </div>
              </div>
            </div>
          </div>

          <div class="bio-section__content">
            <p class="context-line">Professional Background & Advocacy</p>
            <h2>About Nikolas Leontides</h2>
            <p class="bio-lead">
              Nikolas commenced his law studies in 2013 at the University of Nicosia (UNIC), earning his BA / LLB in law. Since 2014, he has practiced independently in Cyprus, delivering clear, practical, and direct legal representation.
            </p>

            <div class="bio-timeline">
              <div class="timeline-item">
                <span class="timeline-year">2013</span>
                <div>
                  <h3>UNIC BA / LLB Degree</h3>
                  <p>Completed legal education at the University of Nicosia with a strong focus on Cyprus civil law, EU legal frameworks, and commercial litigation.</p>
                </div>
              </div>

              <div class="timeline-item">
                <span class="timeline-year">2014</span>
                <div>
                  <h3>Established Independent Practice</h3>
                  <p>Founded independent legal advisory in Cyprus, offering high-touch client advocacy without corporate bureaucracy.</p>
                </div>
              </div>

              <div class="timeline-item">
                <span class="timeline-year">Present</span>
                <div>
                  <h3>Trusted Legal Advisor in Nicosia</h3>
                  <p>Representing individual clients, business owners, and international property buyers across Cyprus.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Practice Showcase Banner -->
      <section class="showcase-banner">
        <div class="showcase-banner__bg">
          <img src="/assets/cyprus_practice.png" alt="Cyprus Legal Practice Chamber" />
          <div class="showcase-banner__overlay"></div>
        </div>
        <div class="page-shell showcase-banner__content">
          <h2>10+ Years of Independent Legal Advisory in Cyprus</h2>
          <p>Delivering strategic counsel with transparent fees, direct communication, and real-time scheduling.</p>
          <div class="stats-grid">
            <div class="stat-card">
              <strong>10+</strong>
              <span>Years Independent Practice</span>
            </div>
            <div class="stat-card">
              <strong>UNIC</strong>
              <span>BA / LLB Law Degree (2013)</span>
            </div>
            <div class="stat-card">
              <strong>100%</strong>
              <span>Direct Lawyer Access</span>
            </div>
            <div class="stat-card">
              <strong>Live</strong>
              <span>Google Calendar Sync</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Cyprus Practice Areas Section -->
      <section id="practice-areas" class="spacious-section page-shell">
        <header class="section-intro text-center">
          <p class="context-line">Cyprus Legal Expertise</p>
          <h2>Core Practice Areas</h2>
          <p>Independent legal services tailored for domestic and international clients in Cyprus.</p>
        </header>

        <div class="practice-cards-grid">
          <div class="practice-box">
            <div class="practice-box__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
            <h3>Corporate & Commercial Law</h3>
            <p>Cyprus company incorporation, corporate structuring, shareholder agreements, commercial contract negotiations, and compliance advisory.</p>
          </div>

          <div class="practice-box">
            <div class="practice-box__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <h3>Real Estate & Property Conveyancing</h3>
            <p>Comprehensive property purchase due diligence, title deed verification, sale agreement drafting, and representation at the Land Registry.</p>
          </div>

          <div class="practice-box">
            <div class="practice-box__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <h3>Contracts & Civil Litigation</h3>
            <p>Drafting commercial agreements, breach of contract litigation, debt recovery, civil dispute resolution, and settlement negotiations.</p>
          </div>

          <div class="practice-box">
            <div class="practice-box__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3>Family & Personal Legal Matters</h3>
            <p>Estate planning, Cyprus wills drafting, probate administration, asset protection, and personal legal consultations.</p>
          </div>
        </div>
      </section>

      <!-- Services & Fees Section -->
      <section id="services" class="spacious-section page-shell services-section">
        <header class="section-intro">
          <p class="context-line">Transparent Pricing</p>
          <h2>Select a Consultation Service</h2>
          <p>Clear, fixed fees stated upfront before you choose a time.</p>
        </header>

        <div class="services-list">
          @for (service of services; track service.id) {
            <article class="service-card">
              <div class="service-card__body">
                <h3>{{ service.name }}</h3>
                <p class="service-card__suitable">{{ service.suitableFor }}</p>
                <p class="service-card__desc">{{ service.description }}</p>
              </div>
              <div class="service-card__meta">
                <div class="price-tag">
                  <strong>€{{ service.price }}</strong>
                  <small>{{ service.durationMinutes }} minutes</small>
                </div>
                <a [routerLink]="['/book']" [queryParams]="{ service: service.id }" class="button button--primary button--compact">
                  Select & Schedule <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          }
        </div>
      </section>

      <!-- FAQ Section -->
      <section id="faq" class="spacious-section page-shell faq-section">
        <header class="section-intro">
          <p class="context-line">Frequently Asked Questions</p>
          <h2>Got Questions Before Booking?</h2>
        </header>
        <div class="faq-list">
          <details open>
            <summary>What is Nikolas Leontides' legal background?</summary>
            <p>Nikolas completed his BA / LLB law degree at the University of Nicosia (UNIC) in 2013 and has been practicing independently as an Advocate & Legal Consultant in Cyprus since 2014.</p>
          </details>
          <details>
            <summary>How does calendar booking and email confirmation work?</summary>
            <p>When you select a slot and submit your contact details, your consultation is automatically added to Nikolas's Google Calendar and instant confirmation emails are dispatched via Resend to both you and Nikolas.</p>
          </details>
          <details>
            <summary>Where is the law office located?</summary>
            <p>Nikolas's office is located in Nicosia, Cyprus. In-person meetings as well as remote video/phone consultations are available.</p>
          </details>
          <details>
            <summary>Are consultation fees transparent?</summary>
            <p>Yes, all fees are fixed and stated upfront in Euros (€). No unexpected surprises or hidden charges.</p>
          </details>
        </div>
      </section>

      <!-- Closing CTA -->
      <section class="closing-cta-banner page-shell">
        <div class="closing-cta-card">
          <div>
            <h2>Ready to Discuss Your Legal Matter?</h2>
            <p>Schedule your legal consultation with Nikolas Leontides in Nicosia, Cyprus.</p>
          </div>
          <a routerLink="/book" class="button button--primary button--lg">
            Open Calendar Book <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </article>
  `
})
export class HomeV2PageComponent {
  readonly booking = inject(BookingV2Service);
  readonly services = this.booking.services;
  readonly previewDates = this.booking.getAvailableDates().slice(0, 3);
}
