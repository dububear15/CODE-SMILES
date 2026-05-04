import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientSidebarComponent } from '../patient-sidebar/patient-sidebar';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

type NotificationFilterKey =
  | 'all'
  | 'appointments'
  | 'treatment'
  | 'messages'
  | 'medical-vault'
  | 'clinic-updates';

type NotificationType = 'appointment' | 'message' | 'document' | 'update';
type NotificationStatus = 'approved' | 'pending' | 'info';
type NotificationTone = 'green' | 'orange' | 'blue' | 'violet' | 'teal';
type NotificationActionKind =
  | 'view-appointment'
  | 'add-calendar'
  | 'view-details'
  | 'open-message'
  | 'view-document'
  | 'view-update';

interface NotificationFilter {
  key: NotificationFilterKey;
  label: string;
}

interface NotificationAction {
  label: string;
  kind: NotificationActionKind;
  style: 'primary' | 'secondary';
}

interface NotificationItem {
  id: string;
  section: 'needs-action' | 'recent';
  filter: Exclude<NotificationFilterKey, 'all'>;
  type: NotificationType;
  title: string;
  description: string;
  subtitle: string;
  status: NotificationStatus;
  isRead: boolean;
  createdAt: Date;
  badge: string;
  tone: NotificationTone;
  appointmentId?: string;
  calendarTitle?: string;
  calendarDescription?: string;
  calendarLocation?: string;
  calendarStart?: string;
  calendarEnd?: string;
  documentTitle?: string;
  actions: NotificationAction[];
  iconViewBox: string;
  iconPaths: string[];
}

interface NotificationPreference {
  key: 'email' | 'sms' | 'dentistMessages';
  title: string;
  description: string;
  enabled: boolean;
  tone: NotificationTone;
  iconViewBox: string;
  iconPaths: string[];
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, PatientSidebarComponent],
  templateUrl: './patient-notifications.html',
  styleUrl: './patient-notifications.css',
})
export class PatientNotificationsComponent implements OnInit {
  protected selectedFilter: NotificationFilterKey = 'all';
  protected activeMenuId: string | null = null;
  protected toastMessage = '';

  protected readonly filters: NotificationFilter[] = [
    { key: 'all', label: 'All' },
    { key: 'appointments', label: 'Appointments' },
    { key: 'treatment', label: 'Treatment' },
    { key: 'messages', label: 'Messages' },
    { key: 'medical-vault', label: 'Medical Vault' },
    { key: 'clinic-updates', label: 'Clinic Updates' },
  ];

  protected notifications: NotificationItem[] = [
    {
      id: 'NTF-001',
      section: 'needs-action',
      filter: 'appointments',
      type: 'appointment',
      title: 'Appointment Confirmed',
      subtitle: 'Apr 21, 2026 • 2:30 PM • Dr. Samantha Lee, DDS',
      description: 'Your requested appointment has been confirmed and is ready in your visit schedule.',
      status: 'approved',
      isRead: false,
      createdAt: new Date('2026-04-20T14:35:00'),
      badge: 'Appointment Approved',
      tone: 'green',
      appointmentId: 'APT-1041',
      calendarTitle: 'Code Smiles Appointment Confirmation',
      calendarDescription:
        'Patient appointment confirmed with Dr. Samantha Lee, DDS.',
      calendarLocation: 'Code Smiles Dental Clinic',
      calendarStart: '2026-04-21T14:30:00',
      calendarEnd: '2026-04-21T15:30:00',
      actions: [
        { label: 'View Appointment', kind: 'view-appointment', style: 'primary' },
        { label: 'Add to Calendar', kind: 'add-calendar', style: 'secondary' },
      ],
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M7 3v3M17 3v3M4 8h16',
        'M5.5 5.5h13A1.5 1.5 0 0 1 20 7v11.5A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5V7A1.5 1.5 0 0 1 5.5 5.5Z',
        'M9 12.5l2 2 4-5',
      ],
    },
    {
      id: 'NTF-002',
      section: 'needs-action',
      filter: 'appointments',
      type: 'appointment',
      title: 'Appointment Request Received',
      subtitle: 'Apr 29, 2026 • 10:00 AM',
      description: 'We will notify you once the clinic reviews your request.',
      status: 'pending',
      isRead: false,
      createdAt: new Date('2026-04-20T13:40:00'),
      badge: 'Pending Approval',
      tone: 'orange',
      appointmentId: 'APT-1053',
      actions: [{ label: 'View Details', kind: 'view-details', style: 'primary' }],
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M7 3.5h8l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5Z',
        'M15 3.5v4h4',
        'M9 11h6M9 15h6',
      ],
    },
    {
      id: 'NTF-003',
      section: 'recent',
      filter: 'messages',
      type: 'message',
      title: 'Braces Care Instructions',
      subtitle: 'From: Dr. Lee',
      description: 'Please check it when you have a moment.',
      status: 'info',
      isRead: false,
      createdAt: new Date('2026-04-18T09:20:00'),
      badge: 'Message',
      tone: 'violet',
      actions: [{ label: 'Open Message', kind: 'open-message', style: 'secondary' }],
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M5.5 6.5h13A1.5 1.5 0 0 1 20 8v7a1.5 1.5 0 0 1-1.5 1.5H11l-4.5 3v-3H5.5A1.5 1.5 0 0 1 4 15V8a1.5 1.5 0 0 1 1.5-1.5Z',
        'M8 10.5h8M8 13.5h5',
      ],
    },
    {
      id: 'NTF-004',
      section: 'recent',
      filter: 'medical-vault',
      type: 'document',
      title: 'X-Ray Uploaded',
      subtitle: 'Panoramic X-Ray - 2026',
      description: 'Uploaded to your medical vault.',
      status: 'info',
      isRead: true,
      createdAt: new Date('2026-04-17T11:10:00'),
      badge: 'Medical Vault',
      tone: 'blue',
      documentTitle: 'Panoramic X-Ray - 2026',
      actions: [{ label: 'View Document', kind: 'view-document', style: 'secondary' }],
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M7 3.5h8l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5Z',
        'M15 3.5v4h4',
        'M9 11h6M9 15h6',
      ],
    },
    {
      id: 'NTF-005',
      section: 'recent',
      filter: 'clinic-updates',
      type: 'update',
      title: 'Holiday Closure Notice',
      subtitle: 'Code Smiles will be closed on Apr 25, 2026.',
      description: 'Please plan your visits with the updated clinic schedule in mind.',
      status: 'info',
      isRead: true,
      createdAt: new Date('2026-04-15T10:15:00'),
      badge: 'Clinic Update',
      tone: 'teal',
      actions: [{ label: 'View Details', kind: 'view-update', style: 'secondary' }],
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M5 12.5V9.8a1 1 0 0 1 .7-1l10-3.3a1 1 0 0 1 1.3 1V16a1 1 0 0 1-1.3 1l-10-3.3a1 1 0 0 1-.7-1v-.2Z',
        'M8.5 14.5v4',
        'M18.5 9a4.5 4.5 0 0 1 0 6',
      ],
    },
  ];

  protected preferences: NotificationPreference[] = [
    {
      key: 'email',
      title: 'Email Notifications',
      description: 'Appointment reminders, updates',
      enabled: true,
      tone: 'blue',
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M4.5 6.5h15A1.5 1.5 0 0 1 21 8v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16V8a1.5 1.5 0 0 1 1.5-1.5Z',
        'M4 8l8 6 8-6',
      ],
    },
    {
      key: 'sms',
      title: 'SMS Notifications',
      description: 'Text reminders and alerts',
      enabled: true,
      tone: 'violet',
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M5.5 6.5h13A1.5 1.5 0 0 1 20 8v7a1.5 1.5 0 0 1-1.5 1.5H11l-4.5 3v-3H5.5A1.5 1.5 0 0 1 4 15V8a1.5 1.5 0 0 1 1.5-1.5Z',
        'M8 10.5h8M8 13.5h5',
      ],
    },
    {
      key: 'dentistMessages',
      title: 'Messages from Dentists',
      description: 'Messages, instructions',
      enabled: true,
      tone: 'green',
      iconViewBox: '0 0 24 24',
      iconPaths: [
        'M5 12.5V9.8a1 1 0 0 1 .7-1l10-3.3a1 1 0 0 1 1.3 1V16a1 1 0 0 1-1.3 1l-10-3.3a1 1 0 0 1-.7-1v-.2Z',
        'M8.5 14.5v4',
        'M18.5 9a4.5 4.5 0 0 1 0 6',
      ],
    },
  ];

  constructor(private readonly router: Router, private api: ApiService, private auth: AuthService) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (!user?.id) return;
    this.api.getNotifications(user.id).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          // Map real DB notifications into the NotificationItem shape
          const dbNotifs: NotificationItem[] = data.map((n: any) => ({
            id:          String(n.id),
            section:     n.is_read ? 'recent' : 'needs-action',
            filter:      'appointments' as const,
            type:        'appointment' as const,
            title:       n.title,
            subtitle:    new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            description: n.detail,
            status:      (n.level === 'Update' ? 'approved' : n.level === 'Warning' ? 'pending' : 'info') as NotificationStatus,
            isRead:      n.is_read,
            createdAt:   new Date(n.created_at),
            badge:       n.title,
            tone:        (n.level === 'Update' ? 'green' : n.level === 'Warning' ? 'orange' : 'blue') as NotificationTone,
            actions:     [{ label: 'View Appointment', kind: 'view-appointment' as const, style: 'primary' as const }],
            iconViewBox: '0 0 24 24',
            iconPaths:   ['M7 3v3M17 3v3M4 8h16', 'M5.5 5.5h13A1.5 1.5 0 0 1 20 7v11.5A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5V7A1.5 1.5 0 0 1 5.5 5.5Z'],
          }));
          // Prepend real notifications, keep static ones at the end
          this.notifications = [...dbNotifs, ...this.notifications.filter(n => !n.id.startsWith('NTF-00'))];
        }
      },
      error: () => {} // keep static fallback on error
    });
  }

  protected setFilter(filter: NotificationFilterKey): void {
    this.selectedFilter = filter;
    this.activeMenuId = null;
  }

  protected markAllAsRead(): void {
    this.notifications = this.notifications.map((item) => ({ ...item, isRead: true }));
    this.toastMessage = 'All notifications marked as read.';
    this.clearToastLater();
  }

  protected togglePreference(key: NotificationPreference['key']): void {
    this.preferences = this.preferences.map((item) =>
      item.key === key ? { ...item, enabled: !item.enabled } : item,
    );
    this.toastMessage = 'Notification preferences updated.';
    this.clearToastLater();
  }

  protected toggleMenu(notificationId: string): void {
    this.activeMenuId = this.activeMenuId === notificationId ? null : notificationId;
  }

  protected markAsRead(notificationId: string): void {
    this.notifications = this.notifications.map((item) =>
      item.id === notificationId ? { ...item, isRead: true } : item,
    );
    this.activeMenuId = null;
    this.toastMessage = 'Notification marked as read.';
    this.clearToastLater();
  }

  protected deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter((item) => item.id !== notificationId);
    this.activeMenuId = null;
    this.toastMessage = 'Notification removed.';
    this.clearToastLater();
  }

  protected handleAction(notification: NotificationItem, action: NotificationAction): void {
    this.notifications = this.notifications.map((item) =>
      item.id === notification.id ? { ...item, isRead: true } : item,
    );

    switch (action.kind) {
      case 'view-appointment':
      case 'view-details':
        this.router.navigate(['/patient-appointments']);
        return;
      case 'add-calendar':
        this.downloadCalendarInvite(notification);
        this.toastMessage = `Calendar file downloaded for ${notification.title}.`;
        this.clearToastLater();
        return;
      case 'open-message':
        this.router.navigate(['/patient-messages']);
        return;
      case 'view-document':
        this.router.navigate(['/patient-medical-vault'], {
          queryParams: { record: notification.documentTitle || notification.title },
        });
        return;
      case 'view-update':
        this.toastMessage = 'Clinic update opened.';
        this.clearToastLater();
        return;
    }
  }

  protected openHelpCenter(): void {
    this.router.navigate(['/help-center']);
  }

  protected get filteredNotifications(): NotificationItem[] {
    if (this.selectedFilter === 'all') {
      return this.notifications;
    }

    return this.notifications.filter((item) => item.filter === this.selectedFilter);
  }

  protected get needsActionNotifications(): NotificationItem[] {
    return this.filteredNotifications.filter((item) => item.section === 'needs-action');
  }

  protected get recentNotifications(): NotificationItem[] {
    return this.filteredNotifications.filter((item) => item.section === 'recent');
  }

  protected get filterCounts(): Record<NotificationFilterKey, number> {
    return {
      all: this.notifications.length,
      appointments: this.notifications.filter((item) => item.filter === 'appointments').length,
      treatment: this.notifications.filter((item) => item.filter === 'treatment').length,
      messages: this.notifications.filter((item) => item.filter === 'messages').length,
      'medical-vault': this.notifications.filter((item) => item.filter === 'medical-vault').length,
      'clinic-updates': this.notifications.filter((item) => item.filter === 'clinic-updates').length,
    };
  }

  protected get needsActionCount(): number {
    return this.notifications.filter((item) => item.section === 'needs-action' && !item.isRead).length;
  }

  protected get unreadCount(): number {
    return this.notifications.filter((item) => !item.isRead).length;
  }

  protected formatRelativeDate(value: Date): string {
    const diff = Date.now() - value.getTime();
    const minutes = Math.round(diff / 60000);

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }

    const hours = Math.round(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }

    const days = Math.round(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  private clearToastLater(): void {
    window.clearTimeout((this as { toastTimeout?: number }).toastTimeout);
    (this as { toastTimeout?: number }).toastTimeout = window.setTimeout(() => {
      this.toastMessage = '';
    }, 2200);
  }

  private downloadCalendarInvite(notification: NotificationItem): void {
    if (!notification.calendarStart || !notification.calendarEnd) {
      return;
    }

    const fileName = `${notification.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Code Smiles//Patient Portal//EN',
      'BEGIN:VEVENT',
      `UID:${notification.id}@codesmiles.local`,
      `DTSTAMP:${this.formatCalendarDate(new Date().toISOString())}`,
      `DTSTART:${this.formatCalendarDate(notification.calendarStart)}`,
      `DTEND:${this.formatCalendarDate(notification.calendarEnd)}`,
      `SUMMARY:${notification.calendarTitle || notification.title}`,
      `DESCRIPTION:${(notification.calendarDescription || notification.description).replace(/\n/g, '\\n')}`,
      `LOCATION:${notification.calendarLocation || 'Code Smiles Dental Clinic'}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  private formatCalendarDate(value: string): string {
    return new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  }
}
