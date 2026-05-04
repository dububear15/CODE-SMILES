import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';
import { ApiService } from '../services/api.service';

type ReviewStatus = 'Approved' | 'Rescheduled' | 'Cancelled';

interface StaffAppointment {
  id: number;
  patient_name: string;
  email: string;
  phone: string;
  treatment: string;
  services: string[];
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: string;
  notes: string;
  dentist_name: string;
  urgency: string;
  created_at: string;
}

@Component({
  selector: 'app-staff-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StaffSidebar],
  templateUrl: './staff-appointments.html',
  styleUrls: ['./staff-appointments.css'],
})
export class StaffAppointmentsComponent implements OnInit {
  protected readonly dentists = [
    'All Dentists',
    'Dr. Raphoncel Eduria',
    'Dr. Christine Faith Metillo',
    'Dr. Nico Bongolto',
    'Dr. Derence Acojedo',
  ];
  protected readonly sortOptions = ['Date Soonest', 'Patient Name'];
  protected readonly tabs: ReviewStatus[] = ['Approved', 'Rescheduled', 'Cancelled'];

  protected dentistFilter = 'All Dentists';
  protected dateFilter = '';
  protected activeTab: ReviewStatus = 'Approved';
  protected sortBy = 'Date Soonest';
  protected searchTerm = '';
  protected isLoading = true;

  protected appointments: StaffAppointment[] = [];

  constructor(private router: Router, private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.isLoading = true;
    this.api.getStaffAppointments().subscribe({
      next: (data) => {
        this.appointments = Array.isArray(data) ? data : [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  protected get filteredAppointments(): StaffAppointment[] {
    const q = this.searchTerm.trim().toLowerCase();
    return this.appointments
      .filter(a => a.status === this.activeTab)
      .filter(a => this.dentistFilter === 'All Dentists' || a.dentist_name === this.dentistFilter)
      .filter(a => !this.dateFilter || a.appointment_date === this.dateFilter)
      .filter(a => {
        if (!q) return true;
        return [a.patient_name, a.treatment, a.dentist_name, a.phone, (a.services || []).join(' ')]
          .join(' ').toLowerCase().includes(q);
      })
      .sort((a, b) => {
        if (this.sortBy === 'Patient Name') return a.patient_name.localeCompare(b.patient_name);
        return a.appointment_date.localeCompare(b.appointment_date) || a.appointment_time.localeCompare(b.appointment_time);
      });
  }

  protected countForTab(status: ReviewStatus): number {
    return this.appointments.filter(a => a.status === status).length;
  }

  protected setActiveTab(tab: ReviewStatus): void {
    this.activeTab = tab;
  }

  protected clearSearch(): void {
    this.searchTerm = '';
  }

  protected applyFilters(): void { /* triggers change detection */ }

  protected resetFilters(): void {
    this.searchTerm = '';
    this.dentistFilter = 'All Dentists';
    this.dateFilter = '';
    this.sortBy = 'Date Soonest';
    this.activeTab = 'Approved';
  }

  protected formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  protected formatTime(timeStr: string): string {
    if (!timeStr) return '—';
    const [h, m] = timeStr.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
  }

  protected get summaryCards() {
    return [
      { label: 'Approved',    value: this.countForTab('Approved'),    tone: 'mint',   icon: 'check'  as const, note: 'Confirmed' },
      { label: 'Rescheduled', value: this.countForTab('Rescheduled'), tone: 'violet', icon: 'swap'   as const, note: 'Today' },
      { label: 'Cancelled',   value: this.countForTab('Cancelled'),   tone: 'rose',   icon: 'alert'  as const, note: 'This month' },
    ];
  }

  protected readonly quickActions = [
    { label: 'Manage Requests', route: '/staff-requests', icon: 'clipboard' },
    { label: 'Add Walk-in',     route: '/staff-calendar', icon: 'plus'      },
  ];

  protected getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  protected getStatIconPath(icon: 'check' | 'swap' | 'alert'): string[] {
    switch (icon) {
      case 'check': return ['M20 6 9 17l-5-5'];
      case 'alert': return ['M12 8v5', 'M12 17h.01', 'M10.3 3.9 2.8 17a2 2 0 0 0 1.74 3h14.92a2 2 0 0 0 1.74-3L13.74 3.9a2 2 0 0 0-3.48 0Z'];
      case 'swap':  return ['M16 3h4v4', 'M20 7a8 8 0 0 0-14.5-2', 'M8 21H4v-4', 'M4 17a8 8 0 0 0 14.5 2'];
    }
  }

  protected getQuickActionIcon(icon: string): string[] {
    switch (icon) {
      case 'clipboard': return ['M9 4h6', 'M9 4a2 2 0 0 0-2 2v1h10V6a2 2 0 0 0-2-2', 'M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1', 'M9 12h6', 'M9 16h4'];
      case 'plus':      return ['M12 5v14', 'M5 12h14'];
      default:          return ['M8 3.5v4', 'M16 3.5v4', 'M4 9.5h16', 'M4 5.5h16v14.5H4z'];
    }
  }
}
