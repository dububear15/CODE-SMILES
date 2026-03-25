import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-appointments.html',
  styleUrl: './my-appointments.css',
})
export class MyAppointments {
  selectedTab = 'upcoming';

  appointmentTabs = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  appointments = [
    {
      service: 'General Dentistry',
      dentist: 'Dr. Lee Sung-Kyung',
      date: 'April 2, 2026',
      time: '2:30 PM',
      status: 'Approved',
      type: 'upcoming',
      notes: 'Please arrive 15 minutes early for assessment.',
    },
    {
      service: 'Teeth Whitening',
      dentist: 'Dr. Ju Ji-Hoon',
      date: 'April 18, 2026',
      time: '10:00 AM',
      status: 'Pending',
      type: 'pending',
      notes: 'Waiting for clinic confirmation.',
    },
    {
      service: 'Braces Adjustment',
      dentist: 'Dr. Park Shin-Hye',
      date: 'March 12, 2026',
      time: '1:00 PM',
      status: 'Completed',
      type: 'completed',
      notes: 'Treatment completed successfully.',
    },
    {
      service: 'Pediatric Consultation',
      dentist: 'Dr. Choo Young-Woo',
      date: 'March 1, 2026',
      time: '9:00 AM',
      status: 'Cancelled',
      type: 'cancelled',
      notes: 'Cancelled by patient request.',
    },
  ];

  setTab(tab: string) {
    this.selectedTab = tab;
  }

  get filteredAppointments() {
    return this.appointments.filter((appointment) => appointment.type === this.selectedTab);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }
}