import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';

type ReviewStatus = 'Pending' | 'Approved' | 'Rescheduled' | 'Cancelled';

interface StaffReviewAppointment {
  id: string;
  patient: string;
  initials: string;
  patientTag: string;
  phone: string;
  age: number;
  service: string;
  dentist: string;
  chair: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: ReviewStatus;
  note: string;
  updatedAt: string;
  calendarTone: 'blue' | 'amber' | 'teal' | 'slate';
  conflict?: string;
  listStatusLabel?: string;
}

interface ReviewStat {
  label: string;
  value: number;
  note: string;
  icon: 'calendar' | 'check' | 'clock' | 'alert' | 'swap';
  tone: 'blue' | 'mint' | 'gold' | 'rose' | 'violet';
}

@Component({
  selector: 'app-staff-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StaffSidebar],
  templateUrl: './staff-appointments.html',
  styleUrls: ['./staff-appointments.css'],
})
export class StaffAppointmentsComponent {
  protected readonly dentists = ['All Dentists', 'Dr. Angela Lim', 'Dr. Marcus Rivera'];
  protected readonly chairs = ['Chair 1', 'Chair 2', 'Chair 3'];
  protected readonly statuses: Array<'All Status' | ReviewStatus> = [
    'All Status',
    'Pending',
    'Approved',
    'Rescheduled',
    'Cancelled',
  ];
  protected readonly dates = ['April 13, 2026', 'April 14, 2026', 'April 15, 2026'];
  protected readonly sortOptions = ['Time Soonest', 'Patient Name'];
  protected readonly tabs: ReviewStatus[] = ['Pending', 'Approved', 'Rescheduled', 'Cancelled'];

  protected searchTerm = '';
  protected dentistFilter = 'All Dentists';
  protected dateFilter = 'April 13, 2026';
  protected statusFilter: 'All Status' | ReviewStatus = 'All Status';
  protected activeTab: ReviewStatus = 'Pending';
  protected sortBy = 'Time Soonest';

  protected readonly appointments: StaffReviewAppointment[] = [
    {
      id: 'REQ-2084',
      patient: 'Sofia Bautista',
      initials: 'SB',
      patientTag: 'New Patient',
      phone: '0917 555 0123',
      age: 28,
      service: 'Teeth Whitening & Consultation',
      dentist: 'Dr. Angela Lim',
      chair: 'Chair 2',
      date: 'April 13, 2026',
      startTime: '11:00 AM',
      endTime: '12:30 PM',
      durationMinutes: 90,
      status: 'Pending',
      note: 'Preferred slot needs confirmation with chair and dentist availability.',
      updatedAt: 'Apr 12, 2026 4:32 PM',
      calendarTone: 'amber',
      conflict: 'Chair 2 is already booked from 10:30 AM to 12:00 PM.',
      listStatusLabel: 'Pending Review',
    },
    {
      id: 'REQ-2085',
      patient: 'Noah Villanueva',
      initials: 'NV',
      patientTag: 'Returning Patient',
      phone: '0918 444 7788',
      age: 34,
      service: 'Deep Cleaning',
      dentist: 'Dr. Marcus Rivera',
      chair: 'Chair 1',
      date: 'April 13, 2026',
      startTime: '2:00 PM',
      endTime: '3:15 PM',
      durationMinutes: 75,
      status: 'Pending',
      note: 'Patient prefers the same dentist from the previous visit.',
      updatedAt: 'Apr 12, 2026 4:11 PM',
      calendarTone: 'teal',
      listStatusLabel: 'Pending Review',
    },
    {
      id: 'REQ-2086',
      patient: 'Camille Lopez',
      initials: 'CL',
      patientTag: 'Returning Patient',
      phone: '0926 888 3344',
      age: 41,
      service: 'Dental Filling',
      dentist: 'Dr. Angela Lim',
      chair: 'Chair 3',
      date: 'April 13, 2026',
      startTime: '3:30 PM',
      endTime: '4:30 PM',
      durationMinutes: 60,
      status: 'Pending',
      note: 'Requested a later slot after work hours.',
      updatedAt: 'Apr 12, 2026 3:40 PM',
      calendarTone: 'slate',
      listStatusLabel: 'Pending Review',
    },
    {
      id: 'REQ-2076',
      patient: 'Regular Checkup',
      initials: 'RC',
      patientTag: 'Confirmed',
      phone: '0917 321 1000',
      age: 31,
      service: 'Routine Oral Exam',
      dentist: 'Dr. Angela Lim',
      chair: 'Chair 1',
      date: 'April 13, 2026',
      startTime: '10:00 AM',
      endTime: '10:45 AM',
      durationMinutes: 45,
      status: 'Approved',
      note: 'Already confirmed with patient and synced to staff calendar.',
      updatedAt: 'Apr 12, 2026 2:15 PM',
      calendarTone: 'blue',
    },
    {
      id: 'REQ-2077',
      patient: 'Ariana Santos',
      initials: 'AS',
      patientTag: 'Returning Patient',
      phone: '0917 654 3900',
      age: 25,
      service: 'Orthodontic Review',
      dentist: 'Dr. Angela Lim',
      chair: 'Chair 1',
      date: 'April 13, 2026',
      startTime: '1:00 PM',
      endTime: '2:00 PM',
      durationMinutes: 60,
      status: 'Approved',
      note: 'Confirmed after dentist schedule review.',
      updatedAt: 'Apr 12, 2026 1:55 PM',
      calendarTone: 'teal',
    },
    {
      id: 'REQ-2078',
      patient: 'Daniel Flores',
      initials: 'DF',
      patientTag: 'Returning Patient',
      phone: '0918 788 1111',
      age: 39,
      service: 'Root Canal Follow-up',
      dentist: 'Dr. Marcus Rivera',
      chair: 'Chair 3',
      date: 'April 13, 2026',
      startTime: '2:45 PM',
      endTime: '3:30 PM',
      durationMinutes: 45,
      status: 'Approved',
      note: 'No issues detected during availability validation.',
      updatedAt: 'Apr 12, 2026 1:18 PM',
      calendarTone: 'teal',
    },
    {
      id: 'REQ-2079',
      patient: 'Mila Garcia',
      initials: 'MG',
      patientTag: 'Confirmed',
      phone: '0922 333 1009',
      age: 22,
      service: 'Consultation',
      dentist: 'Dr. Angela Lim',
      chair: 'Chair 2',
      date: 'April 14, 2026',
      startTime: '9:00 AM',
      endTime: '9:30 AM',
      durationMinutes: 30,
      status: 'Approved',
      note: 'Assigned after a cancellation opened the slot.',
      updatedAt: 'Apr 12, 2026 12:44 PM',
      calendarTone: 'blue',
    },
    {
      id: 'REQ-2080',
      patient: 'Paolo Mendoza',
      initials: 'PM',
      patientTag: 'Returning Patient',
      phone: '0916 200 8181',
      age: 45,
      service: 'Crown Fitting',
      dentist: 'Dr. Marcus Rivera',
      chair: 'Chair 1',
      date: 'April 14, 2026',
      startTime: '10:00 AM',
      endTime: '11:30 AM',
      durationMinutes: 90,
      status: 'Approved',
      note: 'Prepared for chairside fitting with inventory confirmed.',
      updatedAt: 'Apr 12, 2026 11:37 AM',
      calendarTone: 'blue',
    },
    {
      id: 'REQ-2081',
      patient: 'Liam Perez',
      initials: 'LP',
      patientTag: 'Confirmed',
      phone: '0917 289 1144',
      age: 30,
      service: 'Tooth Extraction',
      dentist: 'Dr. Marcus Rivera',
      chair: 'Chair 2',
      date: 'April 14, 2026',
      startTime: '1:00 PM',
      endTime: '2:00 PM',
      durationMinutes: 60,
      status: 'Approved',
      note: 'Confirmed after review of required equipment and anesthesia window.',
      updatedAt: 'Apr 12, 2026 10:49 AM',
      calendarTone: 'amber',
    },
    {
      id: 'REQ-2082',
      patient: 'Ella Ramos',
      initials: 'ER',
      patientTag: 'Confirmed',
      phone: '0925 147 0087',
      age: 27,
      service: 'Sealant Application',
      dentist: 'Dr. Angela Lim',
      chair: 'Chair 3',
      date: 'April 15, 2026',
      startTime: '10:30 AM',
      endTime: '11:00 AM',
      durationMinutes: 30,
      status: 'Approved',
      note: 'Approved with preventive care bundle.',
      updatedAt: 'Apr 12, 2026 9:51 AM',
      calendarTone: 'blue',
    },
    {
      id: 'REQ-2083',
      patient: 'Jasmine Torres',
      initials: 'JT',
      patientTag: 'Needs Follow-up',
      phone: '0915 777 3040',
      age: 29,
      service: 'Consultation',
      dentist: 'Dr. Angela Lim',
      chair: 'Chair 2',
      date: 'April 15, 2026',
      startTime: '11:30 AM',
      endTime: '12:00 PM',
      durationMinutes: 30,
      status: 'Rescheduled',
      note: 'Patient requested a new time after a work conflict.',
      updatedAt: 'Apr 12, 2026 9:18 AM',
      calendarTone: 'amber',
    },
    {
      id: 'REQ-2075',
      patient: 'Carlo Medina',
      initials: 'CM',
      patientTag: 'Cancelled',
      phone: '0919 403 2711',
      age: 37,
      service: 'Scaling',
      dentist: 'Dr. Marcus Rivera',
      chair: 'Chair 1',
      date: 'April 13, 2026',
      startTime: '4:00 PM',
      endTime: '4:45 PM',
      durationMinutes: 45,
      status: 'Cancelled',
      note: 'Patient cancelled after phone confirmation.',
      updatedAt: 'Apr 12, 2026 8:47 AM',
      calendarTone: 'slate',
    },
  ];

  protected selectedAppointment: StaffReviewAppointment | null = this.appointments[0];

  protected readonly quickActions = [
    { label: "View Today's Schedule", route: '/staff-calendar', icon: 'calendar' },
    { label: 'Manage Requests', route: '/staff-requests', icon: 'clipboard' },
    { label: 'Open Conflict List', route: '/staff-requests', icon: 'alert' },
    { label: 'Add Walk-in Appointment', route: '/staff-profile', icon: 'plus' },
  ];

  protected get summaryCards(): ReviewStat[] {
    return [
      { label: 'Total Today', value: 12, note: '8:00 AM - 5:00 PM', icon: 'calendar', tone: 'blue' },
      { label: 'Approved', value: 7, note: '58.3% of total', icon: 'check', tone: 'mint' },
      { label: 'Pending Review', value: 3, note: 'Needs your action', icon: 'clock', tone: 'gold' },
      { label: 'Conflicts', value: 1, note: 'Requires attention', icon: 'alert', tone: 'rose' },
      { label: 'Rescheduled', value: 1, note: 'Today', icon: 'swap', tone: 'violet' },
    ];
  }

  protected get filteredAppointments(): StaffReviewAppointment[] {
    return this.appointments
      .filter((item) => item.status === this.activeTab)
      .filter((item) => this.dentistFilter === 'All Dentists' || item.dentist === this.dentistFilter)
      .filter((item) => item.date === this.dateFilter)
      .filter((item) => this.statusFilter === 'All Status' || item.status === this.statusFilter)
      .filter((item) => {
        const search = this.searchTerm.trim().toLowerCase();
        if (!search) {
          return true;
        }

        return [item.patient, item.service, item.dentist, item.chair, item.phone]
          .join(' ')
          .toLowerCase()
          .includes(search);
      })
      .sort((left, right) => {
        if (this.sortBy === 'Patient Name') {
          return left.patient.localeCompare(right.patient);
        }

        return this.toMinutes(left.startTime) - this.toMinutes(right.startTime);
      });
  }

  protected syncSelection(): void {
    if (!this.selectedAppointment) {
      this.selectedAppointment = this.filteredAppointments[0] ?? null;
      return;
    }

    const match = this.filteredAppointments.find((item) => item.id === this.selectedAppointment?.id);
    this.selectedAppointment = match ?? this.filteredAppointments[0] ?? null;
  }

  protected get calendarPreview(): StaffReviewAppointment[] {
    const basisDate = this.selectedAppointment?.date ?? this.dateFilter;

    return this.appointments
      .filter((item) => item.date === basisDate && item.status !== 'Cancelled')
      .sort((left, right) => this.toMinutes(left.startTime) - this.toMinutes(right.startTime))
      .slice(0, 4);
  }

  protected countForTab(status: ReviewStatus): number {
    const tabCounts: Record<ReviewStatus, number> = {
      Pending: 3,
      Approved: 7,
      Rescheduled: 1,
      Cancelled: 1,
    };

    return tabCounts[status];
  }

  protected setActiveTab(tab: ReviewStatus): void {
    this.activeTab = tab;

    if (this.statusFilter !== 'All Status' && this.statusFilter !== tab) {
      this.statusFilter = 'All Status';
    }

    this.syncSelection();
  }

  protected selectAppointment(appointment: StaffReviewAppointment): void {
    this.selectedAppointment = appointment;
  }

  protected clearSelection(): void {
    this.selectedAppointment = null;
  }

  protected approve(appointment: StaffReviewAppointment): void {
    appointment.status = 'Approved';
    appointment.updatedAt = 'Apr 13, 2026 9:04 AM';

    if (this.selectedAppointment?.id === appointment.id) {
      this.selectedAppointment = appointment;
    }
  }

  protected reject(appointment: StaffReviewAppointment): void {
    appointment.status = 'Cancelled';
    appointment.updatedAt = 'Apr 13, 2026 9:06 AM';

    if (this.selectedAppointment?.id === appointment.id) {
      this.selectedAppointment = appointment;
    }
  }

  protected suggestNewTime(appointment: StaffReviewAppointment): void {
    appointment.status = 'Rescheduled';
    appointment.updatedAt = 'Apr 13, 2026 9:09 AM';
    appointment.note = 'Suggested a new time while keeping the service request active.';

    if (this.selectedAppointment?.id === appointment.id) {
      this.selectedAppointment = appointment;
    }
  }

  protected resetFilters(): void {
    this.searchTerm = '';
    this.dentistFilter = 'All Dentists';
    this.dateFilter = 'April 13, 2026';
    this.statusFilter = 'All Status';
    this.sortBy = 'Time Soonest';
    this.activeTab = 'Pending';
    this.syncSelection();
  }

  protected getStatusClass(status: ReviewStatus): string {
    return `status-${status.toLowerCase()}`;
  }

  protected getQuickActionIcon(icon: string): string[] {
    switch (icon) {
      case 'clipboard':
        return ['M9 4h6', 'M9 4a2 2 0 0 0-2 2v1h10V6a2 2 0 0 0-2-2', 'M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1', 'M9 12h6', 'M9 16h4'];
      case 'alert':
        return ['M12 8v5', 'M12 17h.01', 'M10.3 3.9 2.8 17a2 2 0 0 0 1.74 3h14.92a2 2 0 0 0 1.74-3L13.74 3.9a2 2 0 0 0-3.48 0Z'];
      case 'plus':
        return ['M12 5v14', 'M5 12h14'];
      default:
        return ['M8 3.5v4', 'M16 3.5v4', 'M4 9.5h16', 'M4 5.5h16v14.5H4z'];
    }
  }

  protected getTimelineStyle(appointment: StaffReviewAppointment): Record<string, string> {
    const clinicStart = this.toMinutes('8:00 AM');
    const clinicEnd = this.toMinutes('5:00 PM');
    const start = this.toMinutes(appointment.startTime);
    const end = this.toMinutes(appointment.endTime);
    const left = ((start - clinicStart) / (clinicEnd - clinicStart)) * 100;
    const width = ((end - start) / (clinicEnd - clinicStart)) * 100;

    return {
      left: `${Math.max(0, left)}%`,
      width: `${Math.max(10, width)}%`,
    };
  }

  protected getStatIconPath(icon: ReviewStat['icon']): string[] {
    switch (icon) {
      case 'check':
        return ['M20 6 9 17l-5-5'];
      case 'clock':
        return ['M12 6v6l4 2', 'M21 12a9 9 0 1 1-2.64-6.36'];
      case 'alert':
        return ['M12 8v5', 'M12 17h.01', 'M10.3 3.9 2.8 17a2 2 0 0 0 1.74 3h14.92a2 2 0 0 0 1.74-3L13.74 3.9a2 2 0 0 0-3.48 0Z'];
      case 'swap':
        return ['M16 3h4v4', 'M20 7a8 8 0 0 0-14.5-2', 'M8 21H4v-4', 'M4 17a8 8 0 0 0 14.5 2'];
      default:
        return ['M8 3.5v4', 'M16 3.5v4', 'M4 9.5h16', 'M4 5.5h16v14.5H4z'];
    }
  }

  private getCount(status: ReviewStatus): number {
    return this.appointments.filter((item) => item.status === status).length;
  }

  private toMinutes(value: string): number {
    const [time, meridiem] = value.split(' ');
    const [hourPart, minutePart] = time.split(':').map(Number);
    let hour = hourPart % 12;

    if (meridiem === 'PM') {
      hour += 12;
    }

    return hour * 60 + minutePart;
  }
}
