import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-staff-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './staff-sidebar.html',
  styleUrls: ['./staff-sidebar.css'],
})
export class StaffSidebar {
  fullName: string;
  initial: string;

  constructor(private auth: AuthService) {
    const user = this.auth.getUser();
    this.fullName = user ? `${user.first_name} ${user.last_name}` : 'Staff';
    this.initial  = (user?.first_name?.charAt(0) ?? 'S').toUpperCase();
  }

  logout(): void {
    this.auth.logout();
  }
}
