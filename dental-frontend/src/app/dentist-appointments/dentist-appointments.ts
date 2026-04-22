import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DentistSidebar } from '../dentist-sidebar/dentist-sidebar';
import { DENTIST_APPOINTMENTS } from '../dentist-portal-data';

@Component({
  selector: 'app-dentist-appointment',
  standalone: true,
  imports: [CommonModule, RouterLink, DentistSidebar],
  templateUrl: './dentist-appointments.html',
  styleUrl: './dentist-appointments.css',
})
export class DentistAppointmentsComponent {
  protected readonly tabs = ['Today', 'Upcoming', 'Completed', 'Cancelled'];
  protected activeTab = 'Today';
  protected readonly appointments = DENTIST_APPOINTMENTS;
  protected readonly todayAppointments = this.appointments.filter(
    (appointment) => appointment.date === 'April 17, 2024' && appointment.status !== 'Cancelled' && appointment.status !== 'Completed',
  );
  protected readonly upcomingAppointments = this.appointments.filter((appointment) => appointment.status === 'Upcoming');
  protected readonly completedAppointments = this.appointments.filter((appointment) => appointment.status === 'Completed');
  protected readonly cancelledAppointments = this.appointments.filter((appointment) => appointment.status === 'Cancelled');

  protected setTab(tab: string): void {
    this.activeTab = tab;
  }

  protected get filteredAppointments() {
    return this.appointments.filter((appointment) => {
      if (this.activeTab === 'Today') {
        return appointment.date === 'April 17, 2024' && appointment.status !== 'Cancelled' && appointment.status !== 'Completed';
      }

      if (this.activeTab === 'Upcoming') {
        return appointment.status === 'Upcoming';
      }

      if (this.activeTab === 'Completed') {
        return appointment.status === 'Completed';
      }

      return appointment.status === 'Cancelled';
    });
  }

  protected statusTone(status: string): string {
    switch (status) {
      case 'Confirmed':
        return 'confirmed';
      case 'In Progress':
        return 'progress';
      case 'Upcoming':
        return 'upcoming';
      case 'Completed':
        return 'completed';
      default:
        return 'pending';
    }
  }
}
