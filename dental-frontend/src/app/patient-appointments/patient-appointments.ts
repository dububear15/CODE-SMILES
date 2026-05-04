import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientSidebarComponent } from '../patient-sidebar/patient-sidebar';
import { PatientAppointmentStore } from './patient-appointment-store';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

export type AppointmentTab = 'upcoming' | 'pending' | 'past';

export interface PatientAppointment {
  id: string;
  dbId: number;
  service: string;
  category: string;
  dentist: string;
  location: string;
  dateMonth: string;
  dateDay: string;
  weekday: string;
  accent: 'blue' | 'amber' | 'violet' | 'teal';
  time: string;
  status: 'Approved' | 'Pending Approval' | 'Completed' | 'Cancelled' | 'Rescheduled';
  tab: AppointmentTab;
  description: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge: string;
  notes: string;
  bookedOn: string;
  durationLabel: string;
  servicesSummary: string[];
  history: { label: string; value: string }[];
}

interface AppointmentTip {
  title: string;
  description: string;
  iconViewBox: string;
  iconPaths: string[];
}

interface AppointmentTabOption {
  key: AppointmentTab;
  label: string;
  iconViewBox: string;
  iconPaths: string[];
}

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PatientSidebarComponent],
  templateUrl: './patient-appointments.html',
  styleUrls: ['./patient-appointments.css'],
})
export class MyAppointments implements OnInit {
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  // Keep store so booking page can still write to it (reschedule flow)
  private readonly appointmentStore = inject(PatientAppointmentStore);

  protected selectedTab: AppointmentTab = 'upcoming';
  protected isLoading = true;
  protected loadError = '';

  protected appointments: PatientAppointment[] = [];

  protected patientProfile = {
    name: 'Patient',
    id: '—',
  };

  protected readonly clinicPhone = '(555) 123-4567';

  protected readonly appointmentTabs: AppointmentTabOption[] = [
    {
      key: 'upcoming',
      label: 'Upcoming',
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M7 3v3M17 3v3M4 8h16',
        'M4 5h16a1 1 0 0 1 1 1v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1Z',
      ],
    },
    {
      key: 'pending',
      label: 'Pending Approval',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M12 4a8 8 0 1 0 8 8 8 8 0 0 0-8-8Z', 'M12 8v5l3 2'],
    },
    {
      key: 'past',
      label: 'Past Appointments',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M6.5 12.5 10 16l7.5-8', 'M12 3.5a8.5 8.5 0 1 0 8.5 8.5A8.5 8.5 0 0 0 12 3.5Z'],
    },
  ];

  protected readonly appointmentTips: AppointmentTip[] = [
    {
      title: 'Arrive 10 Minutes Early',
      description: 'Helps us stay on schedule and give you the best care.',
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M12 3a7.5 7.5 0 1 0 7.5 7.5A7.5 7.5 0 0 0 12 3Z',
        'M12 7.5v4.4l2.8 1.7',
      ],
    },
    {
      title: 'Bring Valid ID or Insurance',
      description: "We'll need it for verification.",
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v9A1.5 1.5 0 0 1 18.5 18h-13A1.5 1.5 0 0 1 4 16.5Z',
        'M8 11h4',
        'M8 14h3',
        'M15.5 9.5a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6Z',
      ],
    },
    {
      title: 'Check Your Notifications',
      description: "We'll notify you once your appointment is confirmed or updated.",
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M12 3a5 5 0 0 0-5 5v2.4c0 .7-.2 1.4-.6 2L5 15h14l-1.4-2.6c-.4-.6-.6-1.3-.6-2V8a5 5 0 0 0-5-5',
        'M10 18a2 2 0 0 0 4 0',
      ],
    },
  ];

  ngOnInit(): void {
    const user = this.auth.getUser();
    if (user) {
      this.patientProfile = {
        name: `${user.first_name} ${user.last_name}`,
        id: `CS-${String(user.id).padStart(5, '0')}`,
      };
      this.loadAppointments(user.id);
    } else {
      this.isLoading = false;
    }
  }

  private loadAppointments(patientId: number): void {
    this.isLoading = true;
    this.api.getMyAppointments(patientId).subscribe({
      next: (data) => {
        this.appointments = data.map(a => this.mapDbAppointment(a));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadError = 'Could not load appointments. Please make sure the server is running.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private mapDbAppointment(a: any): PatientAppointment {
    const dateObj = new Date(`${a.appointment_date}T00:00:00`);
    const status = this.mapStatus(a.status);
    const tab = this.mapTab(a.status, a.appointment_date);
    const accent = this.mapAccent(a.status);

    // Format time from "HH:MM:SS" → "H:MM AM/PM"
    const timeFormatted = this.formatTime(a.appointment_time);

    const services: string[] = Array.isArray(a.services) ? a.services : [];

    return {
      id: `APT-${a.id}`,
      dbId: a.id,
      service: services[0] || a.treatment || 'Appointment',
      category: a.treatment || '—',
      dentist: a.dentist_name || 'Dentist assignment pending',
      location: 'Code Smiles Dental Clinic',
      dateMonth: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj).toUpperCase(),
      dateDay: new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(dateObj),
      weekday: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj).toUpperCase(),
      accent,
      time: timeFormatted,
      status,
      tab,
      description: services.length > 1
        ? `${services.join(', ')}`
        : (a.notes || a.treatment || 'Appointment'),
      patientName: a.patient_name || '—',
      patientEmail: a.email || '—',
      patientPhone: a.phone || '—',
      patientAge: '—',
      notes: a.notes || '',
      bookedOn: a.created_at
        ? new Date(a.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
        : '—',
      durationLabel: a.duration_minutes ? `${a.duration_minutes} minutes` : '60 minutes',
      servicesSummary: services,
      history: [
        { label: 'Request submitted', value: a.created_at ? new Date(a.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—' },
        ...(a.status === 'Approved' ? [{ label: 'Approved by clinic', value: a.updated_at ? new Date(a.updated_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—' }] : []),
        ...(a.status === 'Completed' ? [{ label: 'Completed', value: a.updated_at ? new Date(a.updated_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—' }] : []),
        ...(a.status === 'Cancelled' ? [{ label: 'Cancelled', value: a.updated_at ? new Date(a.updated_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—' }] : []),
        ...(a.status === 'Rescheduled' ? [{ label: 'Rescheduled', value: a.updated_at ? new Date(a.updated_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—' }] : []),
      ],
    };
  }

  private mapStatus(dbStatus: string): PatientAppointment['status'] {
    const map: Record<string, PatientAppointment['status']> = {
      'Pending':     'Pending Approval',
      'Approved':    'Approved',
      'Completed':   'Completed',
      'Cancelled':   'Cancelled',
      'Rescheduled': 'Rescheduled',
    };
    return map[dbStatus] ?? 'Pending Approval';
  }

  private mapTab(dbStatus: string, dateStr: string): AppointmentTab {
    if (dbStatus === 'Pending') return 'pending';
    if (dbStatus === 'Completed' || dbStatus === 'Cancelled') return 'past';
    if (dbStatus === 'Rescheduled') return 'pending';
    // Approved — check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const apptDate = new Date(`${dateStr}T00:00:00`);
    return apptDate >= today ? 'upcoming' : 'past';
  }

  private mapAccent(dbStatus: string): PatientAppointment['accent'] {
    const map: Record<string, PatientAppointment['accent']> = {
      'Approved':    'blue',
      'Pending':     'amber',
      'Completed':   'teal',
      'Cancelled':   'violet',
      'Rescheduled': 'amber',
    };
    return map[dbStatus] ?? 'blue';
  }

  private formatTime(timeStr: string): string {
    if (!timeStr) return '—';
    const [h, m] = timeStr.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
  }

  protected setTab(tab: AppointmentTab): void {
    this.selectedTab = tab;
  }

  protected get filteredAppointments(): PatientAppointment[] {
    return this.appointments.filter(a => a.tab === this.selectedTab);
  }

  protected get panelTitle(): string {
    if (this.selectedTab === 'pending') return 'Pending Approval';
    if (this.selectedTab === 'past') return 'Past Appointments';
    return 'Upcoming Appointments';
  }

  protected get panelSubtitle(): string {
    if (this.selectedTab === 'pending') return 'Requests currently waiting for clinic confirmation.';
    if (this.selectedTab === 'past') return 'Review finished or cancelled bookings.';
    const count = this.appointments.filter(a => a.tab === 'upcoming').length;
    return `You have ${count} upcoming appointment${count !== 1 ? 's' : ''}.`;
  }

  protected get shouldConstrainAppointmentsList(): boolean {
    return this.filteredAppointments.length >= 5;
  }

  protected getStatusClass(status: PatientAppointment['status']): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  protected viewDetails(appointmentId: string): void {
    this.router.navigate(['/patient-appointments', appointmentId]);
  }

  protected requestReschedule(appointmentId: string): void {
    this.router.navigate(['/patient-booking'], {
      queryParams: { reschedule: appointmentId },
    });
  }

  protected cancelAppointment(appointmentId: string): void {
    this.cancelTargetId = appointmentId;
    this.cancelReason = '';
    this.showCancelModal = true;
  }

  protected confirmCancel(): void {
    if (!this.cancelTargetId || !this.cancelReason.trim()) return;

    const appt = this.appointments.find(a => a.id === this.cancelTargetId);
    if (!appt) return;

    this.api.cancelMyAppointment(appt.dbId, this.cancelReason).subscribe({
      next: () => {
        appt.status = 'Cancelled';
        appt.tab = 'past';
        this.showCancelModal = false;
        this.cancelTargetId = null;
        this.cancelReason = '';
        // Switch to past tab if nothing left in current tab
        if (this.filteredAppointments.length === 0 && this.selectedTab !== 'upcoming') {
          this.selectedTab = 'upcoming';
        }
        this.cdr.detectChanges();
      },
      error: () => {
        // Still update UI optimistically so the user isn't stuck
        appt.status = 'Cancelled';
        appt.tab = 'past';
        this.showCancelModal = false;
        this.cancelTargetId = null;
        this.cancelReason = '';
        this.cdr.detectChanges();
      },
    });
  }

  protected dismissCancel(): void {
    this.showCancelModal = false;
    this.cancelTargetId = null;
    this.cancelReason = '';
  }

  protected cancelTargetId: string | null = null;
  protected cancelReason = '';
  protected showCancelModal = false;

  protected get cancelTarget(): PatientAppointment | null {
    if (!this.cancelTargetId) return null;
    return this.appointments.find(a => a.id === this.cancelTargetId) ?? null;
  }
}
