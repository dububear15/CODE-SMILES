import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common'; // Needed for *ngIf
import { filter } from 'rxjs/operators';

// Assuming your components are exported as HeaderComponent and FooterComponent
import { Header } from './header/header'; 
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, CommonModule],
  template: `
    <app-header></app-header>
    
    <main [class.no-scroll]="!showFooter">
      <router-outlet></router-outlet>
    </main>
    
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

  constructor(private router: Router) {
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // If the URL is exactly '/booking', hide the footer
      this.showFooter = event.urlAfterRedirects !== '/booking';
    });
  }
}