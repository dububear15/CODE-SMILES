import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StaffSidebar],
  templateUrl: './staff-dashboard.html',
  styleUrls: ['./staff-dashboard.css'],
})
export class StaffDashboard implements OnInit {
  fullName: string;
  initial: string;
  today: string;
  isLoading = true;

  private dbStats = { total: 0, pending: 0, approved: 0, cancelled: 0, today: 0, patients: 0 };
  private dbRecent: any[] = [];

  readonly quickActions = [
    { title: 'New Appointment',  emoji: '📅', route: '/staff-appointments', tone: 'sky'    },
    { title: 'Register Patient', emoji: '👤', route: '/staff-patients',     tone: 'mint'   },
    { title: 'Manage Billing',   emoji: '💳', route: '/staff-billing',      tone: 'violet' },
    { title: 'View Requests',    emoji: '📋', route: '/staff-requests',     tone: 'amber'  },
  ];

  constructor(private auth: AuthService, private api: ApiService, private cdr: ChangeDetectorRef) {
    const user = this.auth.getUser();
    this.fullName = user ? `${user.first_name} ${user.last_name}` : 'Staff';
    this.initial  = (user?.first_name?.charAt(0) ?? 'S').toUpperCase();
    this.today    = new Intl.DateTimeFormat('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }).format(new Date());
  }

  ngOnInit() {
    this.api.getStaffDashboardStats().subscribe({
      next: (data) => {
        this.dbStats  = data;
        this.dbRecent = data.recentAppointments || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get statCards() {
    return [
      { label: "Today's Appointments", value: this.dbStats.today,    delta: 'Scheduled today', tone: 'sky',    emoji: '📅' },
      { label: 'Pending Requests',     value: this.dbStats.pending,  delta: 'Needs action',    tone: 'violet', emoji: '⏳' },
      { label: 'Approved',             value: this.dbStats.approved, delta: 'Confirmed',       tone: 'mint',   emoji: '✅' },
      { label: 'Total Patients',       value: this.dbStats.patients, delta: 'Registered',      tone: 'amber',  emoji: '👥' },
    ];
  }

  // Today's schedule — from recent appointments
  get todaySchedule() {
    const today = new Date().toISOString().split('T')[0];
    return this.dbRecent
      .filter(a => a.appointment_date === today)
      .slice(0, 4)
      .map(a => ({
        time:     this.formatTime(a.appointment_time),
        initials: this.getInitials(a.patient_name),
        patient:  a.patient_name,
        service:  a.treatment,
        status:   a.status,
      }));
  }

  // Approval queue — pending appointments
  get requests() {
    return this.dbRecent
      .filter(a => a.status === 'Pending')
      .slice(0, 3)
      .map(a => ({
        initials:  this.getInitials(a.patient_name),
        patient:   a.patient_name,
        service:   a.treatment,
        shortDate: this.formatDate(a.appointment_date),
        urgency:   'Standard',
      }));
  }

  // Recent updates — last 4 appointments
  get activityFeed() {
    return this.dbRecent.slice(0, 4).map(a => ({
      title:  a.patient_name,
      detail: `${a.treatment} — ${a.status}`,
      time:   this.formatDate(a.appointment_date),
    }));
  }

  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }

  getScheduleStatusClass(status: string): string {
    return status?.toLowerCase().replace(/\s+/g, '-') || 'pending';
  }

  getUrgencyClass(urgency: string): string {
    return urgency ? urgency.toLowerCase() : 'standard';
  }

  getInitials(name: string): string {
    return (name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  formatDate(d: string): string {
    if (!d) return '—';
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatTime(t: string): string {
    if (!t) return '—';
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
  }
}
