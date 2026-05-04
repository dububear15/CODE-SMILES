import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';

@Component({
  selector: 'app-staff-help-center',
  standalone: true,
  imports: [CommonModule, RouterLink, StaffSidebar],
  templateUrl: './staff-help-center.html',
  styleUrls: ['./staff-help-center.css'],
})
export class StaffHelpCenter implements OnInit {
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
    this.router.navigate(['/staff-help-center'], { fragment: section });
  }

  protected readonly faqs = [
    {
      question: 'How do I approve or reject a booking request?',
      answer:
        'Open Requests, review the validation details, then choose Approve, Reject, Reschedule, or View Details.',
    },
    {
      question: 'When should I reschedule instead of rejecting?',
      answer:
        'Reschedule when the patient request is valid but the preferred time, provider, or chair availability needs adjustment.',
    },
    {
      question: 'How do I block availability in the calendar?',
      answer:
        'Open Calendar and add a blocked slot for chair maintenance, provider breaks, clinic events, or unavailable time.',
    },
    {
      question: "Where can I check a patient's next appointment?",
      answer: 'Use Appointments or Patients to find the patient record and review upcoming visits.',
    },
    {
      question: 'What should I do when a warning alert appears?',
      answer:
        'Review the warning, confirm the schedule or request details, and update the related appointment before notifying the patient.',
    },
  ];

  protected readonly privacyPoints = [
    {
      title: 'Staff Access to Patient Data',
      description:
        'Use patient records only for appointment coordination, clinic operations, and authorized care support.',
      tone: 'blue',
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M12 4 19 7.5v4.8c0 4.1-2.7 7.6-7 8.7-4.3-1.1-7-4.6-7-8.7V7.5Z',
        'M9.5 12.5 11.2 14 14.8 10.5',
      ],
    },
    {
      title: 'Protect Portal Information',
      description:
        'Keep patient details, schedules, billing notes, and internal messages private and visible only to approved staff.',
      tone: 'mint',
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M8 11V8a4 4 0 1 1 8 0v3',
        'M6.5 11.5h11A1.5 1.5 0 0 1 19 13v6A1.5 1.5 0 0 1 17.5 20.5h-11A1.5 1.5 0 0 1 5 19v-6A1.5 1.5 0 0 1 6.5 11.5Z',
      ],
    },
    {
      title: 'Report Privacy Concerns',
      description:
        'Contact clinic leadership if you notice incorrect access, exposed information, or suspicious account activity.',
      tone: 'violet',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M12 4 20 19H4L12 4Z', 'M12 9v4', 'M12 16h.01'],
    },
  ];

  protected readonly termsPoints = [
    {
      title: 'Account Responsibilities',
      description:
        'Keep your staff login secure, use your own account, and sign out when stepping away from shared devices.',
      tone: 'blue',
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M12 12a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 12 12Z',
        'M5.5 19.5a6.8 6.8 0 0 1 13 0',
      ],
    },
    {
      title: 'Appointment Decisions',
      description:
        'Approvals, rejections, and reschedules should follow clinic timing rules and be reflected accurately across views.',
      tone: 'mint',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M4 5.5h16v14H4z', 'M8 3.5v4M16 3.5v4M4 9.5h16'],
    },
    {
      title: 'Appropriate Staff Use',
      description:
        'Use the staff portal for clinic work only, including scheduling, patient coordination, billing, and internal support.',
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
