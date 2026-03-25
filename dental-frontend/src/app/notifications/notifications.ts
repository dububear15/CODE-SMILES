import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
  selectedFilter = 'all';

  filters = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'appointments', label: 'Appointments' },
    { key: 'records', label: 'Records' },
    { key: 'reminders', label: 'Reminders' },
  ];

  notifications = [
    {
      id: 1,
      icon: '📅',
      title: 'Appointment Approved',
      message: 'Your appointment on April 2, 2026 at 2:30 PM has been confirmed by the clinic.',
      time: '2 hours ago',
      category: 'appointments',
      unread: true,
    },
    {
      id: 2,
      icon: '🦷',
      title: 'Record Updated',
      message: 'Dr. Maria Santos added a new note to your dental record after your last visit.',
      time: 'Yesterday',
      category: 'records',
      unread: false,
    },
    {
      id: 3,
      icon: '⏰',
      title: 'Upcoming Appointment Reminder',
      message: 'You have an appointment tomorrow at 2:30 PM. Please arrive 15 minutes early.',
      time: 'Reminder',
      category: 'reminders',
      unread: true,
    },
    {
      id: 4,
      icon: '📌',
      title: 'Follow-up Recommended',
      message: 'Your dentist recommended a follow-up visit after your recent whitening assessment.',
      time: '2 days ago',
      category: 'records',
      unread: false,
    },
    {
      id: 5,
      icon: '🔄',
      title: 'Appointment Rescheduled',
      message: 'Your visit has been moved to April 10, 2026 at 9:00 AM due to schedule adjustment.',
      time: '3 days ago',
      category: 'appointments',
      unread: true,
    },
  ];

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  get filteredNotifications() {
    if (this.selectedFilter === 'all') {
      return this.notifications;
    }

    if (this.selectedFilter === 'unread') {
      return this.notifications.filter((notif) => notif.unread);
    }

    return this.notifications.filter(
      (notif) => notif.category === this.selectedFilter
    );
  }

  get unreadCount() {
    return this.notifications.filter((notif) => notif.unread).length;
  }

  markAsRead(notification: any) {
    notification.unread = false;
  }

  markAllAsRead() {
    this.notifications.forEach((notif) => (notif.unread = false));
  }
}