import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PatientSidebarComponent } from '../patient-sidebar/patient-sidebar';

@Component({
  selector: 'app-patient-help-center',
  standalone: true,
  imports: [CommonModule, RouterLink, PatientSidebarComponent],
  templateUrl: './patient-help-center.html',
  styleUrl: './patient-help-center.css',
})
export class PatientHelpCenter {
  protected readonly categories = [
    {
      title: 'Appointments',
      description: 'Booking, rescheduling, and what to expect.',
      route: '/patient-appointments',
      tone: 'blue',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M4 5.5h16v14H4z', 'M8 3.5v4M16 3.5v4M4 9.5h16'],
    },
    {
      title: 'Medical Vault',
      description: 'Uploading records, X-rays, and insurance cards.',
      route: '/patient-medical-vault',
      tone: 'mint',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M4.5 7h15A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-7A1.5 1.5 0 0 1 4.5 9H10l1.5-2h8'],
    },
    {
      title: 'Treatment & Care',
      description: 'Understand your treatment, pre & post-care tips.',
      route: '/patient-treatment-progress',
      tone: 'violet',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M9 9c0-1.7 1.3-3 3-3s3 1.3 3 3c0 3-1.4 5.6-3 7-1.6-1.4-3-4-3-7Z', 'M6.5 4.5h11A1.5 1.5 0 0 1 19 6v12a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18V6a1.5 1.5 0 0 1 1.5-1.5Z'],
    },
    {
      title: 'Account & Portal',
      description: 'Profile settings, notifications, and account help.',
      route: '/patient-profile',
      tone: 'amber',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M12 12a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 12 12Z', 'M5.5 19.5a6.8 6.8 0 0 1 13 0'],
    },
  ];

  protected readonly faqs = [
    { question: 'How do I reschedule or cancel my appointment?', answer: 'Open My Appointments and choose the visit you want to change.' },
    { question: 'How do I upload my insurance card or dental records?', answer: 'Use the Medical Vault page and choose Upload Document.' },
    { question: 'Where can I view my treatment plan?', answer: 'Open Treatment Progress to check your current care plan and milestones.' },
    { question: 'How do I update my personal information?', answer: 'Open My Profile and choose Edit Profile to update your saved details.' },
    { question: 'How will I know if my appointment is confirmed?', answer: 'You will receive a notification when the clinic confirms your booking.' },
  ];

  protected readonly supportChannels = [
    {
      title: 'Call Us',
      lineOne: '(555) 123-4567',
      lineTwo: 'Mon - Fri, 8:00 AM - 6:00 PM',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M6.6 5.5h2.2l1.2 3.3-1.6 1.5a15.3 15.3 0 0 0 5.2 5.2l1.5-1.6 3.3 1.2v2.2a1.5 1.5 0 0 1-1.5 1.5A13.4 13.4 0 0 1 5.1 7a1.5 1.5 0 0 1 1.5-1.5Z'],
    },
    {
      title: 'Email Us',
      lineOne: 'support@codesmiles.com',
      lineTwo: 'We typically respond within 24 hours.',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M4.5 6.5h15A1.5 1.5 0 0 1 21 8v8A1.5 1.5 0 0 1 19.5 17.5h-15A1.5 1.5 0 0 1 3 16V8A1.5 1.5 0 0 1 4.5 6.5Z', 'M4 8l8 6 8-6'],
    },
    {
      title: 'Visit Us',
      lineOne: '123 Smile Street',
      lineTwo: 'San Francisco, CA 94105',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M12 20s-6-3.6-6-9.3A6 6 0 1 1 18 10.7C18 16.4 12 20 12 20Z', 'M12 10.5a1.8 1.8 0 1 0 0-.01Z'],
    },
  ];
}
