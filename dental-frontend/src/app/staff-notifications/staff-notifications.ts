import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';

type StaffNotificationCategory =
  | 'appointments'
  | 'treatment'
  | 'messages'
  | 'medical-vault'
  | 'clinic-updates';

type StaffNotificationTone = 'green' | 'amber' | 'blue' | 'purple' | 'slate';

interface StaffNotificationItem {
  id: number;
  category: StaffNotificationCategory;
  tone: StaffNotificationTone;
  label: string;
  title: string;
  meta: string;
  detail: string;
  time: string;
  actionPrimary: string;
  actionSecondary?: string;
  icon: 'calendar' | 'hourglass' | 'message' | 'document' | 'announcement';
  needsAction: boolean;
  unread: boolean;
}

interface FilterChip {
  key: 'all' | StaffNotificationCategory;
  label: string;
}

interface PreferenceItem {
  title: string;
  enabled: boolean;
  icon: 'mail' | 'sms' | 'message' | 'announcement';
}

@Component({
  selector: 'app-staff-notification',
  standalone: true,
  imports: [CommonModule, RouterLink, StaffSidebar],
  templateUrl: './staff-notifications.html',
  styleUrls: ['./staff-notifications.css'],
})
export class StaffNotificationsComponent {
  selectedFilter: FilterChip['key'] = 'all';

  filters: FilterChip[] = [
    { key: 'all', label: 'All' },
    { key: 'appointments', label: 'Appointments' },
    { key: 'treatment', label: 'Treatment' },
    { key: 'messages', label: 'Messages' },
    { key: 'medical-vault', label: 'Medical Vault' },
    { key: 'clinic-updates', label: 'Clinic Updates' },
  ];

  preferences: PreferenceItem[] = [
    { title: 'Email Notifications', enabled: true, icon: 'mail' },
    { title: 'SMS Notifications', enabled: true, icon: 'sms' },
    { title: 'Messages from Dentists', enabled: true, icon: 'message' },
    { title: 'Clinic Announcements', enabled: false, icon: 'announcement' },
  ];

  notifications: StaffNotificationItem[] = [
    {
      id: 1,
      category: 'appointments',
      tone: 'green',
      label: 'Appointment approved',
      title: 'Appointment Confirmed',
      meta: 'Apr 21, 2026  ·  2:30 PM  ·  Dr. Samantha Lee, DDS',
      detail: 'Patient booking was approved and synced to the clinic calendar.',
      time: '10 minutes ago',
      actionPrimary: 'View Appointment',
      actionSecondary: 'Add to Calendar',
      icon: 'calendar',
      needsAction: true,
      unread: true,
    },
    {
      id: 2,
      category: 'appointments',
      tone: 'amber',
      label: 'Pending approval',
      title: 'Appointment Request Received',
      meta: 'Apr 29, 2026  ·  10:00 AM',
      detail: 'We will notify you once the clinic reviews your request.',
      time: '1 hour ago',
      actionPrimary: 'View Details',
      icon: 'hourglass',
      needsAction: true,
      unread: true,
    },
    {
      id: 3,
      category: 'messages',
      tone: 'blue',
      label: 'Message from Dr. Lee',
      title: 'Braces Care Instructions',
      meta: 'Please check it when you have a moment.',
      detail: 'A new message was sent to the patient portal and staff inbox.',
      time: '2 days ago',
      actionPrimary: 'Open Message',
      icon: 'message',
      needsAction: false,
      unread: true,
    },
    {
      id: 4,
      category: 'medical-vault',
      tone: 'purple',
      label: 'Document uploaded',
      title: 'X-Ray Report Uploaded',
      meta: 'Now available in Medical Vault.',
      detail: 'A new imaging file was attached for staff review and records access.',
      time: '3 days ago',
      actionPrimary: 'View Document',
      icon: 'document',
      needsAction: false,
      unread: false,
    },
    {
      id: 5,
      category: 'clinic-updates',
      tone: 'slate',
      label: 'Clinic announcement',
      title: 'Clinic Will Be Closed on Monday, May 5',
      meta: 'In observance of Labor Day. Regular hours resume May 6.',
      detail: 'Staff schedules and patient communication should reflect the holiday closure.',
      time: 'Apr 15, 2026',
      actionPrimary: 'Review Notice',
      icon: 'announcement',
      needsAction: false,
      unread: false,
    },
  ];

  setFilter(filter: FilterChip['key']): void {
    this.selectedFilter = filter;
  }

  get visibleNotifications(): StaffNotificationItem[] {
    if (this.selectedFilter === 'all') {
      return this.notifications;
    }

    return this.notifications.filter((item) => item.category === this.selectedFilter);
  }

  get needsActionNotifications(): StaffNotificationItem[] {
    return this.visibleNotifications.filter((item) => item.needsAction);
  }

  get recentNotifications(): StaffNotificationItem[] {
    return this.visibleNotifications.filter((item) => !item.needsAction);
  }

  get unreadCount(): number {
    return this.notifications.filter((item) => item.unread).length;
  }

  get upcomingCount(): number {
    return this.notifications.filter((item) => item.category === 'appointments').length;
  }

  get messageCount(): number {
    return this.notifications.filter((item) => item.category === 'messages').length;
  }

  get treatmentCount(): number {
    return this.notifications.filter(
      (item) => item.category === 'treatment' || item.category === 'medical-vault'
    ).length;
  }

  getFilterCount(filter: FilterChip['key']): number {
    if (filter === 'all') {
      return this.notifications.length;
    }

    return this.notifications.filter((item) => item.category === filter).length;
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map((item) => ({ ...item, unread: false }));
  }

  clearRead(): void {
    this.notifications = this.notifications.filter((item) => item.unread);
  }

  togglePreference(preference: PreferenceItem): void {
    preference.enabled = !preference.enabled;
  }
}
