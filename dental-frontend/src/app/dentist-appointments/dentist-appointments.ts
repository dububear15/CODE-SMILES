import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DentistSidebar } from '../dentist-sidebar/dentist-sidebar';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

export interface Appointment {
  id: number;
  patient_id: number | null;
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
  // UI helpers
  initials?: string;
}

@Component({
  selector: 'app-dentist-appointment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DentistSidebar],
  templateUrl: './dentist-appointments.html',
  styleUrl: './dentist-appointments.css',
})
export class DentistAppointmentsComponent implements OnInit {

  readonly tabs = ['Upcoming', 'Today', 'Completed', 'Rescheduled', 'Cancelled'];
  activeTab = 'Upcoming';
  searchQuery = '';
  filterStatus = 'All';
  selectedAppointment: Appointment | null = null;
  showFollowUpModal = false;
  followUpDate = '';
  followUpType = 'Procedure Continuation';
  followUpNote = '';
  treatmentNote = '';
  isLoading = true;
  actionMessage = '';

  readonly statusOptions = ['All', 'Approved', 'Completed', 'Rescheduled', 'Cancelled', 'Pending'];
  readonly treatmentOptions = ['All', 'General Dentistry', 'Cosmetic Arts', 'Orthodontics', 'Oral Surgery', 'Dental Implants', 'Pediatric Care'];
  filterTreatment = 'All';

  allAppointments: Appointment[] = [];

  private todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.isLoading = true;
    const user = this.auth.getUser();
    const dentistName = user ? `Dr. ${user.first_name} ${user.last_name}` : '';

    this.api.getDentistAppointments(dentistName).subscribe({
      next: (data) => {
        this.allAppointments = data.map(a => ({
          ...a,
          initials: a.patient_name
            ? a.patient_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
            : '??'
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load appointments:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredAppointments(): Appointment[] {
    return this.allAppointments.filter(a => {
      const matchTab =
        this.activeTab === 'Today'       ? a.appointment_date === this.todayStr && a.status === 'Approved' :
        this.activeTab === 'Upcoming'    ? a.appointment_date > this.todayStr && a.status === 'Approved' :
        this.activeTab === 'Completed'   ? a.status === 'Completed' :
        this.activeTab === 'Rescheduled' ? a.status === 'Rescheduled' :
        a.status === 'Cancelled';

      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || a.patient_name.toLowerCase().includes(q) || a.treatment.toLowerCase().includes(q);

      return matchTab && matchSearch;
    });
  }

  get todayCount()       { return this.allAppointments.filter(a => a.appointment_date === this.todayStr && a.status === 'Approved').length; }
  get upcomingCount()    { return this.allAppointments.filter(a => a.appointment_date > this.todayStr && a.status === 'Approved').length; }
  get completedCount()   { return this.allAppointments.filter(a => a.status === 'Completed').length; }
  get cancelledCount()   { return this.allAppointments.filter(a => a.status === 'Cancelled').length; }
  get rescheduledCount() { return this.allAppointments.filter(a => a.status === 'Rescheduled').length; }

  setTab(tab: string)            { this.activeTab = tab; this.selectedAppointment = null; }
  openDetail(a: Appointment)     { this.selectedAppointment = a; }
  clearSelection()               { this.selectedAppointment = null; }

  markCompleted(a: Appointment) {
    this.api.updateAppointmentStatus(a.id, 'Completed', this.treatmentNote || undefined).subscribe({
      next: () => {
        a.status = 'Completed';
        if (this.treatmentNote) { a.notes = this.treatmentNote; this.treatmentNote = ''; }
        this.actionMessage = `${a.patient_name}'s appointment marked as completed.`;
        setTimeout(() => this.actionMessage = '', 3000);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to update status:', err)
    });
  }

  saveTreatmentNote(a: Appointment) {
    if (!this.treatmentNote.trim()) return;
    this.api.updateAppointmentStatus(a.id, a.status, this.treatmentNote).subscribe({
      next: () => {
        a.notes = this.treatmentNote;
        this.treatmentNote = '';
        this.actionMessage = 'Treatment note saved.';
        setTimeout(() => this.actionMessage = '', 3000);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to save note:', err)
    });
  }

  openFollowUp()  { this.showFollowUpModal = true; }
  closeFollowUp() { this.showFollowUpModal = false; this.followUpDate = ''; this.followUpNote = ''; }

  scheduleFollowUp() {
    if (!this.selectedAppointment || !this.followUpDate) return;
    const a = this.selectedAppointment;
    this.api.bookAppointment({
      patient_id:       a.patient_id,
      full_name:        a.patient_name,
      phone:            a.phone,
      email:            a.email,
      treatment:        a.treatment,
      services:         a.services,
      appointment_date: this.followUpDate,
      appointment_time: a.appointment_time,
      duration_minutes: a.duration_minutes,
      notes:            this.followUpNote || 'Follow-up appointment',
    }).subscribe({
      next: () => {
        this.actionMessage = `Follow-up scheduled for ${this.followUpDate}.`;
        setTimeout(() => this.actionMessage = '', 3000);
        this.closeFollowUp();
        this.cdr.detectChanges();
      },
      error: () => {
        this.actionMessage = 'Failed to schedule follow-up.';
        this.cdr.detectChanges();
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  formatTime(timeStr: string): string {
    if (!timeStr) return '—';
    const [h, m] = timeStr.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
  }

  statusTone(status: string): string {
    const map: Record<string, string> = {
      'Approved': 'confirmed', 'Completed': 'completed',
      'Cancelled': 'cancelled', 'Rescheduled': 'rescheduled', 'Pending': 'pending'
    };
    return map[status] || 'pending';
  }
}

