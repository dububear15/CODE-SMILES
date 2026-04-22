import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';
import { STAFF_PATIENTS } from '../staff-portal-data';

@Component({
  selector: 'app-staff-patient',
  standalone: true,
  imports: [CommonModule, StaffSidebar],
  templateUrl: './staff-patients.html',
  styleUrls: ['./staff-patients.css'],
})
export class StaffPatientsComponent {
  protected readonly patients = STAFF_PATIENTS;

  protected get activePatientsCount(): number {
    return this.patients.filter((patient) => patient.status === 'Active').length;
  }

  protected get inactivePatientsCount(): number {
    return this.patients.filter((patient) => patient.status === 'Inactive').length;
  }

  protected get patientsWithAppointments(): number {
    return this.patients.filter((patient) => patient.nextAppointment !== 'No booking').length;
  }

  protected getStatusClass(status: 'Active' | 'Inactive'): string {
    return `status-${status.toLowerCase()}`;
  }
}
