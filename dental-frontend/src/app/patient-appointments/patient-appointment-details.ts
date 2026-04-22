import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientSidebarComponent } from '../patient-sidebar/patient-sidebar';
import { PatientAppointmentStore } from './patient-appointment-store';

@Component({
  selector: 'app-patient-appointment-details',
  standalone: true,
  imports: [CommonModule, RouterLink, PatientSidebarComponent],
  templateUrl: './patient-appointment-details.html',
  styleUrls: ['./patient-appointment-details.css'],
})
export class PatientAppointmentDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly appointmentStore = inject(PatientAppointmentStore);

  protected get appointment() {
    return this.appointmentStore.getAppointmentById(this.route.snapshot.paramMap.get('id'));
  }

  protected goBack(): void {
    this.router.navigate(['/patient-appointments']);
  }

  protected requestReschedule(): void {
    if (!this.appointment) {
      return;
    }

    this.router.navigate(['/patient-booking'], {
      queryParams: {
        reschedule: this.appointment.id,
      },
    });
  }

  protected cancelAppointment(): void {
    if (!this.appointment) {
      return;
    }

    const shouldCancel = window.confirm(
      'Cancel this appointment request? You can still book a new appointment after this.',
    );

    if (!shouldCancel) {
      return;
    }

    this.appointmentStore.cancelAppointment(this.appointment.id);
    this.router.navigate(['/patient-appointments']);
  }

  protected getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  protected get canManageAppointment(): boolean {
    return !!this.appointment && this.appointment.status !== 'Completed' && this.appointment.status !== 'Cancelled';
  }
}
