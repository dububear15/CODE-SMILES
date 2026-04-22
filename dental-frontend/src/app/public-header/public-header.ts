import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './public-header.html',
  styleUrl: './public-header.css',
})
export class PublicHeaderComponent {
  constructor(public router: Router) {}

  protected logout(): void {
    this.router.navigate(['/']);
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
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
