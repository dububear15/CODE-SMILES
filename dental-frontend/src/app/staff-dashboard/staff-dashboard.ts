import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';
import {
  STAFF_ACTIVITY,
  STAFF_REQUESTS,
  STAFF_SUMMARY_CARDS,
  TODAY_SCHEDULE,
} from '../staff-portal-data';

interface DashboardStatCard {
  label: string;
  value: string;
  delta: string;
  tone: 'sky' | 'violet' | 'mint' | 'amber';
  iconViewBox: string;
  iconPaths: string[];
}

interface DashboardRequest {
  id: string;
  patient: string;
  service: string;
  dentist: string;
  preferredDate: string;
  preferredTime: string;
  duration: number;
  status: string;
  notes: string;
  validation: string;
  urgency: string;
  shortDate: string;
  iconViewBox: string;
  iconPaths: string[];
}

interface DashboardActivity {
  title: string;
  detail: string;
  time: string;
  iconViewBox: string;
  iconPaths: string[];
}

interface StaffQuickAction {
  title: string;
  route: string;
  iconViewBox: string;
  iconPaths: string[];
}

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StaffSidebar],
  templateUrl: './staff-dashboard.html',
  styleUrls: ['./staff-dashboard.css'],
})
export class StaffDashboard {
  protected readonly statCards: DashboardStatCard[] = STAFF_SUMMARY_CARDS.map((card, index) => {
    const icons = [
      {
        tone: 'sky' as const,
        iconViewBox: '0 0 24 24',
        iconPaths: [
          'M4 5.5h16v14H4z',
          'M8 3.5v4M16 3.5v4M4 9.5h16',
          'M8 13h3M13 13h3',
        ],
      },
      {
        tone: 'violet' as const,
        iconViewBox: '0 0 24 24',
        iconPaths: [
          'M8 3.5h8l3 3V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20V5A1.5 1.5 0 0 1 6.5 3.5Z',
          'M9 12h6M9 16h4M15 3.5v4h4',
        ],
      },
      {
        tone: 'mint' as const,
        iconViewBox: '0 0 24 24',
        iconPaths: ['M20 6 9 17l-5-5'],
      },
      {
        tone: 'amber' as const,
        iconViewBox: '0 0 24 24',
        iconPaths: [
          'M12 6v6l-3 2',
          'M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17Z',
        ],
      },
    ][index];

    return {
      label: card.label,
      value: card.value,
      delta: card.delta ?? card.note,
      tone: icons.tone,
      iconViewBox: icons.iconViewBox,
      iconPaths: icons.iconPaths,
    };
  });

  protected readonly todaySchedule = TODAY_SCHEDULE;

  protected readonly requests: DashboardRequest[] = STAFF_REQUESTS.map((request, index) => ({
    ...request,
    shortDate: index === 2 ? 'Apr 14, 2026' : 'Apr 13, 2026',
    iconViewBox: '0 0 24 24',
    iconPaths:
      index === 0
        ? ['M12 12a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 12 12Z', 'M5.5 19.5a6.8 6.8 0 0 1 13 0']
        : ['M8 3.5h8l3 3V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20V5A1.5 1.5 0 0 1 6.5 3.5Z', 'M12 8v5M9.5 10.5H14.5'],
  }));

  protected readonly activityFeed: DashboardActivity[] = [
    {
      ...STAFF_ACTIVITY[0],
      title: 'New appointment scheduled',
      detail: 'Ariana Santos - Today, 1:00 PM',
      time: '5 min ago',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M4 5.5h16v14H4z', 'M8 3.5v4M16 3.5v4M4 9.5h16'],
    },
    {
      ...STAFF_ACTIVITY[1],
      title: 'Patient check-in completed',
      detail: 'Miguel Reyes - 10:28 AM',
      time: '32 min ago',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M12 12a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 12 12Z', 'M5.5 19.5a6.8 6.8 0 0 1 13 0'],
    },
    {
      ...STAFF_ACTIVITY[2],
      title: 'Request needs review',
      detail: 'Insurance verification for Daniel Flores',
      time: '1 hour ago',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M6.5 16.5h11l-1.5-2.2V10a4 4 0 1 0-8 0v4.3Z', 'M10 18.5a2 2 0 0 0 4 0'],
    },
    {
      ...STAFF_ACTIVITY[3],
      title: 'Appointment approved',
      detail: 'Camille Navarro - Apr 14, 9:30 AM',
      time: '2 hours ago',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M20 6 9 17l-5-5'],
    },
  ];

  protected readonly quickActions: StaffQuickAction[] = [
    {
      title: 'Book Appointment',
      route: '/staff-appointments',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M4 5.5h16v14H4z', 'M8 3.5v4M16 3.5v4M4 9.5h16', 'M12 11v5M9.5 13.5h5'],
    },
    {
      title: 'Check In Patient',
      route: '/staff-patients',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M12 12a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 12 12Z', 'M5.5 19.5a6.8 6.8 0 0 1 13 0', 'M17 11l1.5 1.5L21 10'],
    },
    {
      title: 'Manage Requests',
      route: '/staff-requests',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M8 3.5h8l3 3V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20V5A1.5 1.5 0 0 1 6.5 3.5Z', 'M9 12h6M9 16h4M15 3.5v4h4'],
    },
    {
      title: 'View Calendar',
      route: '/staff-calendar',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M4 5.5h16v14H4z', 'M8 3.5v4M16 3.5v4M4 9.5h16'],
    },
    {
      title: 'Send Alert',
      route: '/staff-notifications',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M6.5 16.5h11l-1.5-2.2V10a4 4 0 1 0-8 0v4.3Z', 'M10 18.5a2 2 0 0 0 4 0'],
    },
    {
      title: 'Search Patient',
      route: '/staff-patients',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M10.5 18a7.5 7.5 0 1 1 5.2-2.1L20 20'],
    },
  ];

  protected getScheduleStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  protected getUrgencyClass(urgency: string): string {
    return urgency.toLowerCase();
  }
}
