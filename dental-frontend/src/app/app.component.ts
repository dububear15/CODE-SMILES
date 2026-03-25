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
    <!-- Header (hidden on login/register/forgot-password) -->
    <app-header *ngIf="showHeader"></app-header>
    
    <main [class.no-scroll]="!showFooter">
      <router-outlet></router-outlet>
    </main>
    
    <!-- Footer (hidden on login/register/forgot-password/booking) -->
    <app-footer *ngIf="showFooter"></app-footer>
  `,
  styles: [`
    main { min-height: 80vh; }
    .no-scroll { height: 100vh; overflow: hidden; }
  `]
})
export class AppComponent {
  title = 'dental-frontend';

  showFooter = true;
  showHeader = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {

      const url = event.urlAfterRedirects;

      // Pages with NO header & footer
      const hideAllLayout =
        url === '/login' ||
        url === '/register' ||
        url === '/forgot-password';

      // Pages with NO footer only
      const hideFooterOnly = url === '/booking';

      this.showHeader = !hideAllLayout;
      this.showFooter = !(hideAllLayout || hideFooterOnly);
    });
  }
}