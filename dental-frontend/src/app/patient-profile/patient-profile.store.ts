import { Injectable } from '@angular/core';
import { PatientProfile, NotificationKey } from './patient-profile.models';

@Injectable({ providedIn: 'root' })
export class PatientProfileStore {
  private profile: PatientProfile = {
    fullName: 'Laura Martinez',
    patientId: 'CS-48291',
    memberSince: 'June 15, 2024',
    status: 'Active Patient',
    dateOfBirth: 'Mar 22, 1990',
    gender: 'Female',
    bloodType: 'O+',
    preferredLanguage: 'English',
    phoneNumber: '(555) 123-4567',
    email: 'laura.martinez@email.com',
    homeAddress: '123 Smile Street, San Francisco, CA 94105',
    preferredContactMethod: 'Email & SMS',
    primaryDentist: 'Dr. Patel',
    emergencyContact: {
      name: 'Robert Martinez',
      relationship: 'Spouse',
      phoneNumber: '(555) 987-6543',
    },
    notifications: {
      email: true,
      sms: false,
      announcements: true,
    },
  };

  getProfile(): PatientProfile {
    return this.cloneProfile(this.profile);
  }

  updateProfile(nextProfile: PatientProfile): void {
    this.profile = this.cloneProfile(nextProfile);
  }

  toggleNotification(key: NotificationKey): PatientProfile {
    this.profile = {
      ...this.profile,
      notifications: {
        ...this.profile.notifications,
        [key]: !this.profile.notifications[key],
      },
    };

    return this.getProfile();
  }

  private cloneProfile(profile: PatientProfile): PatientProfile {
    return {
      ...profile,
      emergencyContact: { ...profile.emergencyContact },
      notifications: { ...profile.notifications },
    };
  }
}
