import { Injectable } from '@angular/core';
import { PatientProfile, NotificationKey } from './patient-profile.models';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class PatientProfileStore {
  private profile: PatientProfile;

  constructor(private auth: AuthService) {
    const user = this.auth.getUser();
    this.profile = {
      fullName:               user ? `${user.first_name} ${user.last_name}` : 'Patient',
      patientId:              user ? `CS-${user.id.toString().padStart(5, '0')}` : 'CS-00000',
      memberSince:            'Member',
      status:                 'Active Patient',
      dateOfBirth:            '—',
      gender:                 '—',
      bloodType:              '—',
      preferredLanguage:      'English',
      phoneNumber:            '—',
      email:                  user?.email ?? '—',
      homeAddress:            '—',
      preferredContactMethod: 'Email',
      primaryDentist:         '—',
      emergencyContact: {
        name:        '—',
        relationship:'—',
        phoneNumber: '—',
      },
      notifications: {
        email:         true,
        sms:           false,
        announcements: true,
      },
    };
  }

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
      notifications:    { ...profile.notifications },
    };
  }
}
