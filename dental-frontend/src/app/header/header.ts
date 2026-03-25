import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isPatientView = false;
  isClinicMenuOpen = false;
  isNotifOpen = false;
  selectedNotifTab = 'all';

  notifications = [
    {
      id: 1,
      title: 'Appointment Approved',
      message: 'April 2, 2026 at 2:30 PM is confirmed.',
      time: '2h ago',
      read: false,
      icon: '📅',
    },
    {
      id: 2,
      title: 'Record Updated',
      message: 'Dr. Maria Santos updated your dental record.',
      time: 'Yesterday',
      read: false,
      icon: '🦷',
    },
    {
      id: 3,
      title: 'Upcoming Appointment',
      message: 'You have a visit tomorrow at 2:30 PM.',
      time: 'Reminder',
      read: false,
      icon: '⏰',
    },
  ];

  constructor(public router: Router) {
    this.updateHeaderMode();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateHeaderMode();
        this.isClinicMenuOpen = false;
        this.isNotifOpen = false;
      });
  }

  updateHeaderMode() {
    const patientRoutes = [
      '/patient-dashboard',
      '/my-appointments',
      '/records',
      '/notifications',
      '/profile',
    ];

    this.isPatientView = patientRoutes.some((route) =>
      this.router.url.startsWith(route)
    );
  }

  setNotifTab(tab: string) {
    this.selectedNotifTab = tab;
  }

  get filteredNotifications() {
    if (this.selectedNotifTab === 'unread') {
      return this.notifications.filter((notif) => !notif.read);
    }
    return this.notifications;
  }

  get unreadCount() {
    return this.notifications.filter((notif) => !notif.read).length;
  }

  goDashboard() {
    this.isClinicMenuOpen = false;
    this.isNotifOpen = false;
    this.router.navigate(['/patient-dashboard']);
  }

  toggleClinicMenu() {
    this.isClinicMenuOpen = !this.isClinicMenuOpen;
    if (this.isClinicMenuOpen) {
      this.isNotifOpen = false;
    }
  }

  toggleNotifications() {
    this.isNotifOpen = !this.isNotifOpen;

    if (this.isNotifOpen) {
      this.isClinicMenuOpen = false;
      this.notifications.forEach((notif) => (notif.read = true));
    }
  }

  markAsRead(notification: any) {
    notification.read = true;
  }

  goToNotifications() {
    this.isNotifOpen = false;
    this.router.navigate(['/notifications']);
  }

  goToPublicSection(sectionId: string) {
    this.router.navigate(['/']).then(() => {
      setTimeout(() => this.scrollNow(sectionId), 100);
      this.isClinicMenuOpen = false;
      this.isNotifOpen = false;
    });
  }

  logout() {
    this.isClinicMenuOpen = false;
    this.isNotifOpen = false;
    this.router.navigate(['/']);
  }

  scrollToSection(sectionId: string) {
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      this.scrollNow(sectionId);
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollNow(sectionId), 100);
      });
    }
  }

  private scrollNow(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.clinic-dropdown')) {
      this.isClinicMenuOpen = false;
    }

    if (!target.closest('.notif-wrapper')) {
      this.isNotifOpen = false;
    }
  }
}