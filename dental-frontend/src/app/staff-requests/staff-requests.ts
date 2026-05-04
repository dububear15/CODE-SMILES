import { CommonModule } from '@angular/common';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';
import { ApiService } from '../services/api.service';

interface Appointment {
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
  selector: 'app-staff-request',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffSidebar],
  templateUrl: './staff-requests.html',
  styleUrls: ['./staff-requests.css'],
})
export class StaffRequestsComponent implements OnInit {
  protected appointments: Appointment[] = [];
  protected isLoading = true;
  protected loadError = '';
  protected selectedRequest: Appointment | null = null;
  protected showRescheduleForm = false;
  protected showRejectForm = false;
  protected actionMessage = '';

  // Search + sort (used by template)
  protected searchTerm = '';
  protected sortBy: 'newest' | 'oldest' | 'az' | 'za' | 'date_asc' | 'date_desc' = 'newest';

  protected selectedDentist = '';
  protected readonly dentistOptions = [
    'Dr. Raphoncel Eduria',
    'Dr. Christine Faith Metillo',
    'Dr. Nico Bongolto',
    'Dr. Derence Acojedo',
  ];

  protected newDate = '';
  protected newTime = '';
  protected rescheduleReason = '';
  protected rejectReason = '';

  constructor(private api: ApiService, private zone: NgZone) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.zone.run(() => {
      this.isLoading = true;
      this.loadError = '';
    });

    fetch('http://localhost:3000/staff/appointments?status=Pending')
      .then(res => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then(data => {
        this.zone.run(() => {
          this.appointments = Array.isArray(data) ? data : [];
          this.isLoading = false;
        });
      })
      .catch(err => {
        this.zone.run(() => {
          this.loadError = 'Could not connect to server. Make sure the backend is running.';
          this.appointments = [];
          this.isLoading = false;
        });
      });
    }

  protected get pendingRequests(): Appointment[] {
    return this.appointments.filter(a => a.status === 'Pending');
  }

  protected get filteredRequests(): Appointment[] {
    const q = this.searchTerm.trim().toLowerCase();
    let list = this.pendingRequests.filter(a => {
      if (!q) return true;
      return [a.patient_name, a.treatment, a.phone, (a.services || []).join(' ')]
        .join(' ').toLowerCase().includes(q);
    });

    switch (this.sortBy) {
      case 'oldest':    list = [...list].sort((a, b) => a.created_at.localeCompare(b.created_at)); break;
      case 'az':        list = [...list].sort((a, b) => a.patient_name.localeCompare(b.patient_name)); break;
      case 'za':        list = [...list].sort((a, b) => b.patient_name.localeCompare(a.patient_name)); break;
      case 'date_asc':  list = [...list].sort((a, b) => a.appointment_date.localeCompare(b.appointment_date)); break;
      case 'date_desc': list = [...list].sort((a, b) => b.appointment_date.localeCompare(a.appointment_date)); break;
      default:          list = [...list].sort((a, b) => b.created_at.localeCompare(a.created_at)); break; // newest
    }
    return list;
  }

  protected get pendingCount(): number { return this.pendingRequests.length; }
  protected get approvedCount(): number { return this.appointments.filter(a => a.status === 'Approved').length; }
  protected get changedCount(): number {
    return this.appointments.filter(a => a.status === 'Cancelled' || a.status === 'Rescheduled').length;
  }

  protected openDetails(req: Appointment): void {
    this.selectedRequest = req;
    this.showRescheduleForm = false;
    this.showRejectForm = false;
    this.selectedDentist = req.dentist_name || '';
  }

  protected closeDetails(): void {
    this.selectedRequest = null;
    this.showRescheduleForm = false;
    this.showRejectForm = false;
  }

  protected approve(req: Appointment): void {
    this.api.approveAppointment(req.id, this.selectedDentist, req.notes).subscribe({
      next: () => {
        req.status = 'Approved';
        req.dentist_name = this.selectedDentist;
        this.actionMessage = `${req.patient_name}'s appointment was approved.`;
        this.closeDetails();
      },
      error: (err) => {
        this.actionMessage = err?.error?.message ?? 'Failed to approve.';
      },
    });
  }

  protected reject(req: Appointment): void {
    this.selectedRequest = req;
    this.showRejectForm = true;
    this.showRescheduleForm = false;
    this.rejectReason = '';
  }

  protected submitReject(): void {
    if (!this.selectedRequest || !this.rejectReason.trim()) return;
    this.api.cancelAppointment(this.selectedRequest.id, this.rejectReason).subscribe({
      next: () => {
        this.selectedRequest!.status = 'Cancelled';
        this.actionMessage = `${this.selectedRequest!.patient_name}'s request was rejected.`;
        this.closeDetails();
      },
      error: (err) => {
        this.actionMessage = err?.error?.message ?? 'Failed to reject.';
      },
    });
  }

  protected reschedule(req: Appointment): void {
    this.selectedRequest = req;
    this.showRescheduleForm = true;
    this.showRejectForm = false;
    this.newDate = req.appointment_date;
    this.newTime = req.appointment_time;
    this.rescheduleReason = '';
  }

  protected submitReschedule(): void {
    if (!this.selectedRequest || !this.newDate || !this.newTime) return;
    this.api.rescheduleAppointment(
      this.selectedRequest.id, this.newDate, this.newTime, this.rescheduleReason
    ).subscribe({
      next: () => {
        this.selectedRequest!.status = 'Rescheduled';
        this.selectedRequest!.appointment_date = this.newDate;
        this.selectedRequest!.appointment_time = this.newTime;
        this.actionMessage = `${this.selectedRequest!.patient_name} rescheduled to ${this.newDate} at ${this.newTime}.`;
        this.closeDetails();
      },
      error: (err) => {
        this.actionMessage = err?.error?.message ?? 'Failed to reschedule.';
      },
    });
  }

  protected formatDate(date: string): string {
    if (!date) return '—';
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      .format(new Date(date + 'T00:00:00'));
  }

  protected formatTime(time: string): string {
    if (!time) return '—';
    const [h, m] = time.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
  }
}
