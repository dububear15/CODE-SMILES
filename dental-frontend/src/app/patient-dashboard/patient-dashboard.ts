import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.css',
})
export class PatientDashboardComponent {
  patientName = 'Mark';
  profileInitials = 'MC';

  nextAppointment = {
    service: 'General Dentistry',
    dentist: 'Dr. Lee Sung-Kyung',
    date: 'April 2, 2026',
    time: '2:30 PM',
    status: 'Approved',
  };

  summaryCards = [
    {
      title: 'Next Appointment',
      value: '1',
      subtitle: 'Scheduled visit coming up',
      icon: '📅',
    },
    {
      title: 'Pending Requests',
      value: '2',
      subtitle: 'Awaiting clinic approval',
      icon: '⏳',
    },
    {
      title: 'Notifications',
      value: '3',
      subtitle: 'Unread updates',
      icon: '🔔',
    },
    {
      title: 'Records Updated',
      value: '5',
      subtitle: 'Latest treatment files saved',
      icon: '🦷',
    },
  ];

  appointments = [
    {
      service: 'Cleaning + Consultation',
      dentist: 'Dr. Lee Sung-Kyung',
      date: 'April 2, 2026',
      time: '2:30 PM',
      status: 'Approved',
    },
    {
      service: 'Teeth Whitening',
      dentist: 'Dr. Ju Ji-Hoon',
      date: 'April 18, 2026',
      time: '10:00 AM',
      status: 'Pending',
    },
    {
      service: 'Braces Adjustment',
      dentist: 'Dr. Park Shin-Hye',
      date: 'March 12, 2026',
      time: '1:00 PM',
      status: 'Completed',
    },
  ];

  notifications = [
    {
      title: 'Appointment Approved',
      message: 'Your April 2 appointment has been confirmed by the clinic staff.',
      time: '2 hours ago',
    },
    {
      title: 'Reminder',
      message: 'Please arrive 15 minutes early for your scheduled appointment.',
      time: 'Today',
    },
    {
      title: 'Record Updated',
      message: 'A new treatment note has been added to your Digital Vault.',
      time: 'Yesterday',
    },
  ];

  quickActions = [
  {
    title: 'Book New Appointment',
    description: 'Schedule a new visit based on your preferred service.',
    link: '/booking',
    icon: '➕',
  },
  {
    title: 'View My Records',
    description: 'Check your treatment history and saved dental notes.',
    link: '/records',
    icon: '📁',
  },
  {
    title: 'Track Requests',
    description: 'See if your appointment is pending, approved, or rescheduled.',
    link: '/my-appointments',
    icon: '📌',
  },
  {
    title: 'Edit Profile',
    description: 'Update your contact details and patient information.',
    link: '/profile',
    icon: '👤',
  },
];

  recordPreview = [
    {
      title: 'Dental Cleaning Notes',
      dentist: 'Dr. Lee Sung-Kyung',
      date: 'March 12, 2026',
    },
    {
      title: 'X-Ray Review',
      dentist: 'Dr. Choo Young-Woo',
      date: 'February 21, 2026',
    },
    {
      title: 'Whitening Assessment',
      dentist: 'Dr. Ju Ji-Hoon',
      date: 'January 30, 2026',
    },
  ];

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }
}