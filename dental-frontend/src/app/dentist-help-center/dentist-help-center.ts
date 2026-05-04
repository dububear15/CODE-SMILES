import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DentistSidebar } from '../dentist-sidebar/dentist-sidebar';

@Component({
  selector: 'app-dentist-help-center',
  standalone: true,
  imports: [CommonModule, RouterLink, DentistSidebar],
  templateUrl: './dentist-help-center.html',
  styleUrl: './dentist-help-center.css',
})
export class DentistHelpCenter implements OnInit {
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
    this.router.navigate(['/dentist-help-center'], { fragment: section });
  }

  protected readonly faqs = [
    {
      question: 'Where can I review my appointments?',
      answer: 'Open My Appointments or Schedule to review assigned visits, appointment status, and daily patient flow.',
    },
    {
      question: 'How do I check a patient record?',
      answer: 'Open My Patients, select the patient, then review their medical records, appointments, and treatment notes.',
    },
    {
      question: 'Where do I manage treatment plans?',
      answer: 'Use Treatment Plans to review, update, and track active patient care plans and milestones.',
    },
    {
      question: 'How do I handle clinical notifications?',
      answer: 'Open Notifications, review the alert details, and update the related appointment or patient record when needed.',
    },
    {
      question: 'How do I update my dentist profile?',
      answer: 'Open Profile or Settings to manage your account details, preferences, and portal settings.',
    },
  ];

  protected readonly privacyPoints = [
    {
      title: 'Clinical Record Access',
      description:
        'Access patient records only for assigned care, clinical review, treatment planning, or authorized follow-up.',
      tone: 'blue',
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M12 4 19 7.5v4.8c0 4.1-2.7 7.6-7 8.7-4.3-1.1-7-4.6-7-8.7V7.5Z',
        'M9.5 12.5 11.2 14 14.8 10.5',
      ],
    },
    {
      title: 'Protect Patient Information',
      description:
        'Keep treatment notes, X-rays, prescriptions, and patient messages private and visible only to authorized clinic users.',
      tone: 'mint',
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M8 11V8a4 4 0 1 1 8 0v3',
        'M6.5 11.5h11A1.5 1.5 0 0 1 19 13v6A1.5 1.5 0 0 1 17.5 20.5h-11A1.5 1.5 0 0 1 5 19v-6A1.5 1.5 0 0 1 6.5 11.5Z',
      ],
    },
    {
      title: 'Report Access Issues',
      description:
        'Notify clinic leadership if records look incorrect, a chart is exposed, or account activity seems suspicious.',
      tone: 'violet',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M12 4 20 19H4L12 4Z', 'M12 9v4', 'M12 16h.01'],
    },
  ];

  protected readonly termsPoints = [
    {
      title: 'Account Responsibilities',
      description:
        'Use your own dentist account, keep access secure, and sign out when leaving shared or clinic devices.',
      tone: 'blue',
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M12 12a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 12 12Z',
        'M5.5 19.5a6.8 6.8 0 0 1 13 0',
      ],
    },
    {
      title: 'Treatment Plan Accuracy',
      description:
        'Clinical updates, notes, and treatment milestones should reflect the dentist recommendation and current patient status.',
      tone: 'mint',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M4 18.5h3l2.3-6 4 3 2.3-7L20 12.5'],
    },
    {
      title: 'Appropriate Dentist Portal Use',
      description:
        'Use the portal for clinical workflows, patient review, prescriptions, schedules, and authorized care coordination.',
      tone: 'amber',
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M7 3.5h8l4 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z',
        'M15 3.5v4h4',
        'M9 12h6',
      ],
    },
  ];
}
