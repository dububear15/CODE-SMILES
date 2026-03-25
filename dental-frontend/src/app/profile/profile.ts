import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  isEditing = false;

  user = {
    fullName: 'Mark Anthony Calayca',
    email: 'mark@email.com',
    phone: '09123456789',
    birthDate: '2005-05-10',
    gender: 'Male',
    address: 'Zone 3, Gracia, Tagoloan, Misamis Oriental',
    emergencyName: 'Wilma Calayca',
    emergencyRelation: 'Mother',
    emergencyPhone: '09121234567',
    memberSince: '2026',
    patientId: 'CS-2026-014',
    preferredClinic: 'Code Smiles Villanueva',
  };

  settings = {
    emailNotifications: true,
    appointmentReminders: true,
    smsAlerts: false,
  };

  tempUser = { ...this.user };
  tempSettings = { ...this.settings };

  editProfile() {
    this.isEditing = true;
    this.tempUser = { ...this.user };
    this.tempSettings = { ...this.settings };
  }

  cancelEdit() {
    this.isEditing = false;
    this.tempUser = { ...this.user };
    this.tempSettings = { ...this.settings };
  }

  saveProfile() {
    this.user = { ...this.tempUser };
    this.settings = { ...this.tempSettings };
    this.isEditing = false;
  }

  changePhoto() {
    alert('Profile photo upload will be connected later.');
  }

  changePassword() {
    alert('Change password feature will be connected later.');
  }

  managePrivacy() {
    alert('Privacy settings will be connected later.');
  }

  get initials(): string {
    const names = this.user.fullName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  }
}