import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientSidebarComponent } from '../patient-sidebar/patient-sidebar';

@Component({
  selector: 'app-patient-help-center',
  standalone: true,
  imports: [CommonModule, RouterLink, PatientSidebarComponent],
  templateUrl: './patient-help-center.html',
  styleUrl: './patient-help-center.css',
})
export class PatientHelpCenter implements OnInit {
  protected activeFaqIndex: number | null = null;
  protected activeLegalSection: 'privacy-policy' | 'terms-of-use' = 'privacy-policy';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment === 'terms-of-use' || fragment === 'privacy-policy') {
        this.activeLegalSection = fragment;
      }
    });
  }

  protected toggleFaq(index: number): void {
    this.activeFaqIndex = this.activeFaqIndex === index ? null : index;
  }

  protected showLegalSection(section: 'privacy-policy' | 'terms-of-use'): void {
    this.activeLegalSection = section;
    this.router.navigate(['/patient-help-center'], { fragment: section });
  }

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

  protected readonly privacyPoints = [
    {
      title: 'Information We Collect',
      description:
        'Personal details, dental records, appointment history, insurance information, and portal communication preferences.',
      tone: 'blue',
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M5 7.5C5 6.1 8.1 5 12 5s7 1.1 7 2.5S15.9 10 12 10 5 8.9 5 7.5Z',
        'M5 7.5v4C5 12.9 8.1 14 12 14s7-1.1 7-2.5v-4',
        'M5 11.5v4C5 16.9 8.1 18 12 18s7-1.1 7-2.5v-4',
      ],
    },
    {
      title: 'How We Use Your Information',
      description:
        'To provide dental care, manage appointments, process insurance, send updates, and improve your portal experience.',
      tone: 'mint',
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M12 4 19 7.5v4.8c0 4.1-2.7 7.6-7 8.7-4.3-1.1-7-4.6-7-8.7V7.5Z',
        'M12 9v5',
        'M9.5 11.5h5',
      ],
    },
    {
      title: 'Your Privacy Rights',
      description:
        'You can ask to review, update, or receive a copy of your portal information by contacting the clinic.',
      tone: 'violet',
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M12 12a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 12 12Z',
        'M5.5 19.5a6.8 6.8 0 0 1 13 0',
      ],
    },
  ];

  protected readonly termsPoints = [
    {
      title: 'Account Responsibilities',
      description:
        'Keep your login details secure and make sure the profile information you submit stays accurate and current.',
      tone: 'blue',
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M12 12a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 12 12Z',
        'M5.5 19.5a6.8 6.8 0 0 1 13 0',
      ],
    },
    {
      title: 'Appointment Requests',
      description:
        'Bookings, reschedules, and treatment requests may require clinic confirmation before they are final.',
      tone: 'mint',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M4 5.5h16v14H4z', 'M8 3.5v4M16 3.5v4M4 9.5h16'],
    },
    {
      title: 'Appropriate Portal Use',
      description:
        'Use the portal for routine dental coordination and account management, not as a substitute for urgent care.',
      tone: 'amber',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M12 4 20 19H4L12 4Z', 'M12 9v4', 'M12 16h.01'],
    },
  ];
}
