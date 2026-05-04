import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientSidebarComponent } from '../patient-sidebar/patient-sidebar';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { PatientAppointment } from './patient-appointments';

@Component({
  selector: 'app-patient-appointment-details',
  standalone: true,
  imports: [CommonModule, RouterLink, PatientSidebarComponent],
  templateUrl: './patient-appointment-details.html',
  styleUrls: ['./patient-appointment-details.css'],
})
export class PatientAppointmentDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  protected appointment: PatientAppointment | null = null;
  protected isLoading = true;

  ngOnInit(): void {
    const rawId = this.route.snapshot.paramMap.get('id') ?? '';
    // Route param is "APT-42" — extract the numeric part
    const numericId = parseInt(rawId.replace(/^APT-/i, ''), 10);

    if (isNaN(numericId)) {
      this.isLoading = false;
      return;
    }

    const user = this.auth.getUser();
    if (!user?.id) {
      this.isLoading = false;
      return;
    }

    // Load all appointments for this patient and find the matching one
    this.api.getMyAppointments(user.id).subscribe({
      next: (data) => {
        const raw = data.find(a => a.id === numericId);
        if (raw) {
          this.appointment = this.mapDbAppointment(raw);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  private mapDbAppointment(a: any): PatientAppointment {
    const dateObj = new Date(`${a.appointment_date}T00:00:00`);
    const status = this.mapStatus(a.status);
    const tab = this.mapTab(a.status, a.appointment_date);
    const accent = this.mapAccent(a.status);
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
      time: this.formatTime(a.appointment_time),
      status,
      tab,
      description: services.length > 1 ? services.join(', ') : (a.notes || a.treatment || 'Appointment'),
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
        ...(a.status === 'Approved'     ? [{ label: 'Approved by clinic', value: a.updated_at ? new Date(a.updated_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—' }] : []),
        ...(a.status === 'Completed'    ? [{ label: 'Completed',          value: a.updated_at ? new Date(a.updated_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—' }] : []),
        ...(a.status === 'Cancelled'    ? [{ label: 'Cancelled',          value: a.updated_at ? new Date(a.updated_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—' }] : []),
        ...(a.status === 'Rescheduled'  ? [{ label: 'Rescheduled',        value: a.updated_at ? new Date(a.updated_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—' }] : []),
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

  private mapTab(dbStatus: string, dateStr: string): 'upcoming' | 'pending' | 'past' {
    if (dbStatus === 'Pending' || dbStatus === 'Rescheduled') return 'pending';
    if (dbStatus === 'Completed' || dbStatus === 'Cancelled') return 'past';
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return new Date(`${dateStr}T00:00:00`) >= today ? 'upcoming' : 'past';
  }

  private mapAccent(dbStatus: string): PatientAppointment['accent'] {
    const map: Record<string, PatientAppointment['accent']> = {
      'Approved': 'blue', 'Pending': 'amber', 'Completed': 'teal',
      'Cancelled': 'violet', 'Rescheduled': 'amber',
    };
    return map[dbStatus] ?? 'blue';
  }

  private formatTime(timeStr: string): string {
    if (!timeStr) return '—';
    const [h, m] = timeStr.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`;
  }

  protected goBack(): void {
    this.router.navigate(['/patient-appointments']);
  }

  protected requestReschedule(): void {
    if (!this.appointment) return;
    this.router.navigate(['/patient-booking'], {
      queryParams: { reschedule: this.appointment.id },
    });
  }

  protected cancelAppointment(): void {
    if (!this.appointment) return;

    const shouldCancel = window.confirm(
      'Cancel this appointment request? You can still book a new appointment after this.',
    );
    if (!shouldCancel) return;

    this.api.cancelMyAppointment(this.appointment.dbId, 'Cancelled by patient').subscribe({
      next: () => this.router.navigate(['/patient-appointments']),
      error: () => this.router.navigate(['/patient-appointments']),
    });
  }

  protected getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  protected get canManageAppointment(): boolean {
    return !!this.appointment &&
      this.appointment.status !== 'Completed' &&
      this.appointment.status !== 'Cancelled';
  }
}
