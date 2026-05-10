import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './public-header.html',
  styleUrl: './public-header.css',
})
export class PublicHeaderComponent {
  constructor(public router: Router, private auth: AuthService) {}

  protected handleBook(): void {
    if (this.auth.isLoggedIn() && this.auth.getRole() === 'Patient') {
      this.router.navigate(['/patient-booking']);
    } else if (this.auth.isLoggedIn()) {
      // Logged in but not a patient (staff/dentist) — go to their dashboard
      this.router.navigate([this.auth.getDashboardRoute()]);
    } else {
      // Not logged in — send to login with a return URL hint
      this.router.navigate(['/login'], { queryParams: { redirect: 'booking' } });
    }
  }

  protected scrollToSection(sectionId: string): void {
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      this.scrollNow(sectionId);
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollNow(sectionId), 100);
      });
    }
  }

  private scrollNow(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
