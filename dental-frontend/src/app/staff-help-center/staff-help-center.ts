import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';

@Component({
  selector: 'app-staff-help-center',
  standalone: true,
  imports: [CommonModule, RouterLink, StaffSidebar],
  templateUrl: './staff-help-center.html',
  styleUrls: ['./staff-help-center.css'],
})
export class StaffHelpCenter {
  protected readonly supportCards = [
    {
      title: 'Appointments',
      description: 'Booking, approvals, reschedules, and patient coordination.',
      route: '/staff-appointments',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M4 5.5h16v14.5H4z', 'M8 3.5v4M16 3.5v4M4 9.5h16'],
    },
    {
      title: 'Requests',
      description: 'Queue review, approval checks, and schedule validation.',
      route: '/staff-requests',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M12 3.5 5.5 7v5c0 4.2 2.7 7.5 6.5 8.5 3.8-1 6.5-4.3 6.5-8.5V7L12 3.5Z', 'M9.5 11.5h5'],
    },
    {
      title: 'Calendar',
      description: 'Availability control, blocked slots, and chair coordination.',
      route: '/staff-calendar',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M4 5.5h16v14.5H4z', 'M8 3.5v4M16 3.5v4M4 9.5h16'],
    },
    {
      title: 'Alerts',
      description: 'Booking changes, warnings, and clinic updates.',
      route: '/staff-notifications',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M6.5 16.5h11l-1.5-2.2V10a4 4 0 1 0-8 0v4.3Z', 'M10 18.5a2 2 0 0 0 4 0'],
    },
  ];

  protected readonly faqs = [
    'How do I approve or reject a booking request?',
    'When should I reschedule instead of rejecting?',
    'How do I block availability in the calendar?',
    'Where can I check a patient’s next appointment?',
    'What should I do when a warning alert appears?',
  ];
}
