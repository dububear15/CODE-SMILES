import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PublicAboutComponent } from '../public-about/public-about';
import { PublicContactComponent } from '../public-contact/public-contact';
import { PublicServicesComponent } from '../public-services/public-services';

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [
    CommonModule,
    PublicServicesComponent,
    PublicAboutComponent,
    PublicContactComponent,
    RouterLink
  ],
  templateUrl: './public-home.html',
  styleUrls: ['./public-home.css']
})
export class PublicHomeComponent {
  constructor(private router: Router) {}

  handleBook(): void {
    const isLoggedIn = localStorage.getItem('auth_token');

    if (isLoggedIn) {
      this.router.navigate(['/patient-booking']);
    } else {
      this.router.navigate(['/register']);
    }
  }
}