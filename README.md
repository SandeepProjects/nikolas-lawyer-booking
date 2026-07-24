# Nikolas Legal Consultation — Frontend Edition

A premium, responsive Angular booking experience for Nikolas. This edition is intentionally **frontend-only**: it demonstrates the complete client journey without pretending that email, payments, a database or Google Calendar are connected.

## Included

- Editorial Atelier visual system with reusable OKLCH design tokens
- Responsive layouts for 320, 375, 414, 768 and desktop widths
- Accessible edge-aligned navigation, legal footer and skip link
- Four configurable consultation types with transparent fees and durations
- Three-step booking flow with clear progress and summary
- Europe/Nicosia date handling that does not shift around midnight
- Duration-aware availability and closing-time protection
- Same-browser double-booking protection through local storage
- Robust client-side validation, honeypot field and privacy consent
- Local confirmation reference with copy, print and `.ics` calendar download
- Honest empty state when `/success` is opened without an appointment
- Demo privacy notice and booking terms
- Vercel and Netlify-style SPA rewrites
- Unit tests for date, time, duration and overlap logic
- Angular 21 production build with a committed lockfile after installation

## Run and verify

```bash
npm install
npm run check
npm start
```

Open `http://localhost:4200`.

## One-file practice configuration

Edit:

`src/app/v2/practice.config.ts`

It contains the display name, timezone, working hours, booking window, services, durations, fees and general legal-topic choices.

## Important frontend-only behaviour

The app saves demonstration appointments in the visitor’s browser. It does **not**:

- notify Nikolas;
- reserve a slot across different visitors or devices;
- send email;
- create a live Google Calendar event;
- accept payment;
- establish a lawyer–client relationship.

Those limitations are stated clearly in the public interface. Do not remove the disclosure until a secure server-side booking service is connected.

## Before public launch

Nikolas must approve:

1. Full professional name and title
2. Registration or professional details
3. Services, durations and fees
4. Office location and working hours
5. Contact details
6. Cancellation, rescheduling and payment rules
7. Final privacy notice and data-retention policy

The project ships with `noindex` and a blocking `robots.txt` so unapproved legal content is not indexed accidentally. Remove those controls only after the launch review.

## Architecture

The original prototype components remain in `src/app/components` and `src/app/pages` for reference. The production-facing frontend is isolated in `src/app/v2` and wired through the main routes. Booking calculations live in the pure `booking-logic.ts` module so they can be tested without a browser.

## Design system

- `src/tokens.css` — active Angular tokens
- `tokens.css` — portable entry point
- `src/styles.css` — component and responsive styling
- `.hallmark/` — design preflight and structural memory
