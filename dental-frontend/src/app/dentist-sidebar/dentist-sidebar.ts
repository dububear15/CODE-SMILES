import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { getDentistInfo } from '../dentist-portal-data';

@Component({
  selector: 'app-dentist-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dentist-sidebar.html',
  styleUrls: ['./dentist-sidebar.css'],
})
export class DentistSidebar {
  fullName: string;
  initial: string;
  specialty: string;

  constructor(private auth: AuthService) {
    const user = this.auth.getUser();
    this.fullName = user ? `${user.first_name} ${user.last_name}` : 'Dentist';
    this.initial  = (user?.first_name?.charAt(0) ?? 'D').toUpperCase();
    const info    = getDentistInfo(user?.email ?? '');
    this.specialty = info?.specialty ?? 'Dentist';
  }

  logout(): void {
    this.auth.logout();
  }
}
