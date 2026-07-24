import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { ServicesSectionComponent } from '../../components/services-section/services-section.component';
import { HowItWorksComponent } from '../../components/how-it-works/how-it-works.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeroComponent, ServicesSectionComponent, HowItWorksComponent],
  template: `
    <app-hero />
    <app-services-section />
    <app-how-it-works />
  `
})
export class HomePageComponent {}
