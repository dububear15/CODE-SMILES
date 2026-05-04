import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';

type ReviewStatus = 'Pending' | 'Approved' | 'Rescheduled' | 'Cancelled';

export interface StaffReviewAppointment {
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

// Shared appointment data — single source of truth
export const APPOINTMENTS_DATA: StaffReviewAppointment[] = [
  {
    id: 'REQ-2084', patient: 'Sofia Bautista', initials: 'SB', patientTag: 'New Patient',
    phone: '0917 555 0123', age: 28, service: 'Teeth Whitening', dentist: 'Dr. Derence Acojedo',
    chair: 'Chair 2', date: 'April 13, 2026', startTime: '11:00 AM', endTime: '12:30 PM',
    durationMinutes: 90, status: 'Pending',
    note: 'Preferred slot needs confirmation with chair and dentist availability.',
    updatedAt: 'Apr 12, 2026 4:32 PM', calendarTone: 'amber',
    conflict: 'Chair 2 is already booked from 10:30 AM to 12:00 PM.', listStatusLabel: 'Pending Review',
  },
  {
    id: 'REQ-2085', patient: 'Noah Villanueva', initials: 'NV', patientTag: 'Returning Patient',
    phone: '0918 444 7788', age: 34, service: 'Dental Cleaning', dentist: 'Dr. Raphoncel Eduria',
    chair: 'Chair 1', date: 'April 13, 2026', startTime: '2:00 PM', endTime: '3:15 PM',
    durationMinutes: 75, status: 'Pending',
    note: 'Patient prefers the same dentist from the previous visit.',
    updatedAt: 'Apr 12, 2026 4:11 PM', calendarTone: 'teal', listStatusLabel: 'Pending Review',
  },
  {
    id: 'REQ-2086', patient: 'Camille Lopez', initials: 'CL', patientTag: 'Returning Patient',
    phone: '0926 888 3344', age: 41, service: 'Tooth Fillings', dentist: 'Dr. Raphoncel Eduria',
    chair: 'Chair 3', date: 'April 13, 2026', startTime: '3:30 PM', endTime: '4:30 PM',
    durationMinutes: 60, status: 'Pending',
    note: 'Requested a later slot after work hours.',
    updatedAt: 'Apr 12, 2026 3:40 PM', calendarTone: 'slate', listStatusLabel: 'Pending Review',
  },
  {
    id: 'REQ-2076', patient: 'Regular Checkup', initials: 'RC', patientTag: 'Confirmed',
    phone: '0917 321 1000', age: 31, service: 'Oral Consultation / Check-up', dentist: 'Dr. Raphoncel Eduria',
    chair: 'Chair 1', date: 'April 13, 2026', startTime: '10:00 AM', endTime: '10:45 AM',
    durationMinutes: 45, status: 'Approved',
    note: 'Already confirmed with patient and synced to staff calendar.',
    updatedAt: 'Apr 12, 2026 2:15 PM', calendarTone: 'blue',
  },
  {
    id: 'REQ-2077', patient: 'Ariana Santos', initials: 'AS', patientTag: 'Returning Patient',
    phone: '0917 654 3900', age: 25, service: 'Traditional Braces', dentist: 'Dr. Christine Faith Metillo',
    chair: 'Chair 1', date: 'April 13, 2026', startTime: '1:00 PM', endTime: '2:00 PM',
    durationMinutes: 60, status: 'Approved',
    note: 'Confirmed after dentist schedule review.',
    updatedAt: 'Apr 12, 2026 1:55 PM', calendarTone: 'teal',
  },
  {
    id: 'REQ-2078', patient: 'Daniel Flores', initials: 'DF', patientTag: 'Returning Patient',
    phone: '0918 788 1111', age: 39, service: 'Simple Tooth Extraction', dentist: 'Dr. Raphoncel Eduria',
    chair: 'Chair 3', date: 'April 13, 2026', startTime: '2:45 PM', endTime: '3:30 PM',
    durationMinutes: 45, status: 'Approved',
    note: 'No issues detected during availability validation.',
    updatedAt: 'Apr 12, 2026 1:18 PM', calendarTone: 'teal',
  },
  {
    id: 'REQ-2079', patient: 'Mila Garcia', initials: 'MG', patientTag: 'Confirmed',
    phone: '0922 333 1009', age: 22, service: 'Orthodontic Consultation', dentist: 'Dr. Christine Faith Metillo',
    chair: 'Chair 2', date: 'April 14, 2026', startTime: '9:00 AM', endTime: '9:30 AM',
    durationMinutes: 30, status: 'Approved',
    note: 'Assigned after a cancellation opened the slot.',
    updatedAt: 'Apr 12, 2026 12:44 PM', calendarTone: 'blue',
  },
  {
    id: 'REQ-2080', patient: 'Paolo Mendoza', initials: 'PM', patientTag: 'Returning Patient',
    phone: '0916 200 8181', age: 45, service: 'Single Tooth Implant', dentist: 'Dr. Christine Faith Metillo',
    chair: 'Chair 1', date: 'April 14, 2026', startTime: '10:00 AM', endTime: '11:30 AM',
    durationMinutes: 90, status: 'Approved',
    note: 'Prepared for chairside fitting with inventory confirmed.',
    updatedAt: 'Apr 12, 2026 11:37 AM', calendarTone: 'blue',
  },
  {
    id: 'REQ-2081', patient: 'Liam Perez', initials: 'LP', patientTag: 'Confirmed',
    phone: '0917 289 1144', age: 30, service: 'Surgical Tooth Extraction', dentist: 'Dr. Raphoncel Eduria',
    chair: 'Chair 2', date: 'April 14, 2026', startTime: '1:00 PM', endTime: '2:00 PM',
    durationMinutes: 60, status: 'Approved',
    note: 'Confirmed after review of required equipment and anesthesia window.',
    updatedAt: 'Apr 12, 2026 10:49 AM', calendarTone: 'amber',
  },
  {
    id: 'REQ-2082', patient: 'Ella Ramos', initials: 'ER', patientTag: 'Confirmed',
    phone: '0925 147 0087', age: 27, service: 'Dental Sealants', dentist: 'Dr. Raphoncel Eduria',
    chair: 'Chair 3', date: 'April 15, 2026', startTime: '10:30 AM', endTime: '11:00 AM',
    durationMinutes: 30, status: 'Approved',
    note: 'Approved with preventive care bundle.',
    updatedAt: 'Apr 12, 2026 9:51 AM', calendarTone: 'blue',
  },
  {
    id: 'REQ-2083', patient: 'Jasmine Torres', initials: 'JT', patientTag: 'Needs Follow-up',
    phone: '0915 777 3040', age: 29, service: 'Smile Makeover', dentist: 'Dr. Derence Acojedo',
    chair: 'Chair 2', date: 'April 15, 2026', startTime: '11:30 AM', endTime: '12:00 PM',
    durationMinutes: 30, status: 'Rescheduled',
    note: 'Patient requested a new time after a work conflict.',
    updatedAt: 'Apr 12, 2026 9:18 AM', calendarTone: 'amber',
  },
  {
    id: 'REQ-2075', patient: 'Carlo Medina', initials: 'CM', patientTag: 'Cancelled',
    phone: '0919 403 2711', age: 37, service: 'Dental Cleaning', dentist: 'Dr. Raphoncel Eduria',
    chair: 'Chair 1', date: 'April 13, 2026', startTime: '4:00 PM', endTime: '4:45 PM',
    durationMinutes: 45, status: 'Cancelled',
    note: 'Patient cancelled after phone confirmation.',
    updatedAt: 'Apr 12, 2026 8:47 AM', calendarTone: 'slate',
  },
];

@Component({
  selector: 'app-staff-appointment-detail',
  standalone: true,
  imports: [CommonModule, StaffSidebar],
  templateUrl: './staff-appointment-detail.html',
  styleUrls: ['./staff-appointment-detail.css'],
})
export class StaffAppointmentDetailComponent implements OnInit {
  protected appointment: StaffReviewAppointment | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.appointment = APPOINTMENTS_DATA.find(a => a.id === id);
  }

  protected goBack(): void {
    this.router.navigate(['/staff-appointments']);
  }

  protected getStatusClass(status: ReviewStatus): string {
    return `status-${status.toLowerCase()}`;
  }

  protected reschedule(): void {
    if (this.appointment) {
      this.router.navigate(['/staff-appointments', this.appointment.id, 'reschedule'], {
        queryParams: { returnTo: 'details' }
      });
    }
  }

  protected cancel(): void {
    if (this.appointment) {
      this.appointment.status = 'Cancelled';
      this.appointment.updatedAt = 'Apr 13, 2026 (updated)';
    }
  }
}
