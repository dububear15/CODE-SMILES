import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-staff-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './staff-sidebar.html',
  styleUrls: ['./staff-sidebar.css'],
})
export class StaffSidebar implements OnInit, OnDestroy {
  fullName: string;
  initial: string;

  // Live badge counts
  pendingCount = 0;

  private pollInterval: any;

  constructor(private auth: AuthService, private api: ApiService) {
    const user = this.auth.getUser();
    this.fullName = user ? `${user.first_name} ${user.last_name}` : 'Staff';
    this.initial  = (user?.first_name?.charAt(0) ?? 'S').toUpperCase();
  }

  ngOnInit(): void {
    this.loadCounts();
    // Refresh badge every 60 seconds
    this.pollInterval = setInterval(() => this.loadCounts(), 60000);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  private loadCounts(): void {
    this.api.getStaffDashboardStats().subscribe({
      next: (data) => { this.pendingCount = data.pending ?? 0; },
      error: () => {}
    });
  }

  logout(): void {
    this.auth.logout();
  }
}
