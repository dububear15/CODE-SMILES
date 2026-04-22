import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dentist-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dentist-sidebar.html',
  styleUrl: './dentist-sidebar.css',
})
export class DentistSidebar {
  logout(): void {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}
