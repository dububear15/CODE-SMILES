import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PatientSidebarComponent } from '../patient-sidebar/patient-sidebar';
import {
  AppointmentTab,
  PatientAppointment,
  PatientAppointmentStore,
} from './patient-appointment-store';

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
  imports: [CommonModule, RouterLink, PatientSidebarComponent],
  templateUrl: './patient-appointments.html',
  styleUrls: ['./patient-appointments.css'],
})
export class MyAppointments {
  private readonly router = inject(Router);
  private readonly appointmentStore = inject(PatientAppointmentStore);

  protected selectedTab: AppointmentTab = 'upcoming';

  protected readonly patientProfile = {
    name: 'Laura Martinez',
    id: 'CS-48291',
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

  protected setTab(tab: AppointmentTab): void {
    this.selectedTab = tab;
  }

  protected get filteredAppointments(): PatientAppointment[] {
    return this.appointments.filter((appointment) => appointment.tab === this.selectedTab);
  }

  protected get appointments(): PatientAppointment[] {
    return this.appointmentStore.getAppointments();
  }

  protected get panelTitle(): string {
    if (this.selectedTab === 'pending') {
      return 'Pending Approval';
    }

    if (this.selectedTab === 'past') {
      return 'Past Appointments';
    }

    return 'Upcoming Appointments';
  }

  protected get panelSubtitle(): string {
    if (this.selectedTab === 'pending') {
      return 'Requests currently waiting for clinic confirmation.';
    }

    if (this.selectedTab === 'past') {
      return 'Review finished or cancelled bookings.';
    }

    return `You have ${this.appointments.filter((appointment) => appointment.tab === 'upcoming').length} upcoming appointments.`;
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
      queryParams: {
        reschedule: appointmentId,
      },
    });
  }

  protected cancelAppointment(appointmentId: string): void {
    this.appointmentStore.cancelAppointment(appointmentId);

    if (this.filteredAppointments.length === 0 && this.selectedTab !== 'upcoming') {
      this.selectedTab = 'upcoming';
    }
  }
}
