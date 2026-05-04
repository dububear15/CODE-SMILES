import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DentistSidebar } from '../dentist-sidebar/dentist-sidebar';

@Component({
  selector: 'app-dentist-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DentistSidebar],
  templateUrl: './dentist-settings.html',
  styleUrl: './dentist-settings.css',
})
export class DentistSettingsComponent {

  activeTab = 'account';

  readonly categories = [
    { key: 'account',       label: 'Account',        icon: '👤', desc: 'Name, email, contact, photo'         },
    { key: 'security',      label: 'Security',        icon: '🔒', desc: 'Password, 2FA, login activity'       },
    { key: 'notifications', label: 'Notifications',   icon: '🔔', desc: 'Alerts, reminders, updates'          },
    { key: 'schedule',      label: 'Schedule',        icon: '📅', desc: 'Working days, hours, availability'   },
    { key: 'preferences',   label: 'Preferences',     icon: '⚙',  desc: 'Display, language, theme'           },
    { key: 'privacy',       label: 'Privacy',         icon: '🛡',  desc: 'Visibility, data, access control'   },
  ];

  // Account
  account = {
    firstName: 'Maria', lastName: 'Santos',
    username: 'dr.maria.santos',
    email: 'dr.maria.santos@codesmiles.com',
    phone: '+63 917 234 5678',
  };

  // Security
  security = {
    currentPassword: '', newPassword: '', confirmPassword: '',
    twoFactor: true, sessionTimeout: '30',
  };

  readonly loginActivity = [
    { device: 'Chrome · Windows 11',  location: 'Quezon City, PH', time: 'Today, 8:30 AM',        status: 'current' },
    { device: 'Safari · iPhone 14',   location: 'Quezon City, PH', time: 'Yesterday, 7:15 PM',    status: 'past'    },
    { device: 'Chrome · Windows 11',  location: 'Quezon City, PH', time: 'Apr 29, 2026, 9:00 AM', status: 'past'    },
  ];

  // Notifications
  notif = {
    appointments:      true,
    followUps:         true,
    treatmentUpdates:  true,
    prescriptions:     true,
    urgentCases:       true,
    labResults:        true,
    systemAnnouncements: false,
    emailNotif:        true,
    smsNotif:          false,
    inAppNotif:        true,
  };

  // Schedule
  schedule = {
    clinicDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTime: '08:00', endTime: '17:00',
    lunchStart: '12:00', lunchEnd: '13:00',
    slotDuration: '30',
    maxPerDay: 12,
    acceptWalkIns: false,
    autoConfirm: true,
  };

  readonly allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Preferences
  prefs = {
    theme: 'light',
    language: 'English',
    dashboardLayout: 'default',
    calendarView: 'week',
    defaultTab: 'dashboard',
    treatmentCategories: ['Orthodontics', 'General Dentistry', 'Cosmetic Dentistry'],
    compactMode: false,
    showPatientPhotos: true,
  };

  readonly treatmentCategoryOptions = [
    'General Dentistry', 'Orthodontics', 'Cosmetic Dentistry',
    'Endodontics', 'Oral Surgery', 'Pediatric Dentistry',
    'Periodontics', 'Prosthodontics',
  ];

  // Privacy
  privacy = {
    showContactToPatients: false,
    showContactToStaff: true,
    showDocumentsToPatients: false,
    showDocumentsToAdmin: true,
    profileVisibility: 'clinic',
    dataSharing: false,
    activityTracking: true,
  };

  setTab(tab: string) { this.activeTab = tab; }

  isDayActive(day: string): boolean { return this.schedule.clinicDays.includes(day); }

  toggleDay(day: string) {
    const idx = this.schedule.clinicDays.indexOf(day);
    if (idx > -1) this.schedule.clinicDays.splice(idx, 1);
    else this.schedule.clinicDays.push(day);
  }

  isCategoryActive(cat: string): boolean { return this.prefs.treatmentCategories.includes(cat); }

  toggleCategory(cat: string) {
    const idx = this.prefs.treatmentCategories.indexOf(cat);
    if (idx > -1) this.prefs.treatmentCategories.splice(idx, 1);
    else this.prefs.treatmentCategories.push(cat);
  }

  save() { /* save logic */ }
}
