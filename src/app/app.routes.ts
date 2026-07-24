import { Routes } from '@angular/router';
import { BookV2PageComponent } from './v2/book-v2.page';
import { HomeV2PageComponent } from './v2/home-v2.page';
import { LegalV2PageComponent } from './v2/legal-v2.page';
import { SuccessV2PageComponent } from './v2/success-v2.page';

export const routes: Routes = [
  { path: '', component: HomeV2PageComponent, title: 'Nikolas Leontides | Advocate & Legal Consultant Cyprus' },
  { path: 'book', component: BookV2PageComponent, title: 'Book Consultation | Nikolas Leontides' },
  { path: 'success', component: SuccessV2PageComponent, title: 'Booking Confirmed | Nikolas Leontides' },
  { path: 'privacy', component: LegalV2PageComponent, data: { document: 'privacy' }, title: 'Privacy Policy | Nikolas Leontides' },
  { path: 'terms', component: LegalV2PageComponent, data: { document: 'terms' }, title: 'Booking Terms | Nikolas Leontides' },
  { path: '**', redirectTo: '' }
];
