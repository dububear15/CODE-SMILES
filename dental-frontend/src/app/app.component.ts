import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Header } from './header/header';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, CommonModule],
  template: `
    <app-header *ngIf="showHeader"></app-header>

    <main [class.no-scroll]="hideScrollLayout">
      <router-outlet></router-outlet>
    </main>

    <app-footer *ngIf="showFooter"></app-footer>
  `,
  styles: [`
    main { min-height: 80vh; }
    .no-scroll { min-height: 100vh; overflow: hidden; }
  `]
})
export class AppComponent {
  title = 'dental-frontend';

  showFooter = true;
  showHeader = true;
  hideScrollLayout = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;

      const hideAllLayout =
        url === '/login' ||
        url === '/register' ||
        url === '/forgot-password';

      const privatePatientRoutes =
        url.startsWith('/patient-dashboard') ||
        url.startsWith('/my-appointments') ||
        url.startsWith('/patient-medical-vault') ||
        url.startsWith('/records') ||
        url.startsWith('/notifications') ||
        url.startsWith('/profile');

      const hideFooterOnly = url === '/booking';

      this.showHeader = !(hideAllLayout || privatePatientRoutes);
      this.showFooter = !(hideAllLayout || hideFooterOnly || privatePatientRoutes);
      this.hideScrollLayout = privatePatientRoutes;
    });
  }
}
