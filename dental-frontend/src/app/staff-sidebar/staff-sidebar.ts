import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-staff-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './staff-sidebar.html',
  styleUrls: ['./staff-sidebar.css']
})
export class StaffSidebar {
  logout(): void {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}