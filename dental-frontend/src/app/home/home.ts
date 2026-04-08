import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AboutComponent } from '../about/about';
import { ContactComponent } from '../contact/contact';
import { ServicesComponent } from '../services/services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ServicesComponent, AboutComponent, ContactComponent, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  handleBook(): void {
    const isLoggedIn = localStorage.getItem('user');

    if (isLoggedIn) {
      this.router.navigate(['/booking']);
      return;
    }

    this.router.navigate(['/register']);
  }
}
