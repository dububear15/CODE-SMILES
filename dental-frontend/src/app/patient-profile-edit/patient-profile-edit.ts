import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PatientSidebarComponent } from '../patient-sidebar/patient-sidebar';
import { PatientProfile } from '../patient-profile/patient-profile.models';
import { PatientProfileStore } from '../patient-profile/patient-profile.store';

@Component({
  selector: 'app-patient-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PatientSidebarComponent],
  templateUrl: './patient-profile-edit.html',
  styleUrl: './patient-profile-edit.css',
})
export class PatientProfileEditComponent {
  protected form: PatientProfile;
  protected toastMessage = '';
  protected avatarPreview = '';

  constructor(
    private readonly router: Router,
    private readonly profileStore: PatientProfileStore,
  ) {
    this.form = this.profileStore.getProfile();
  }

  protected saveProfile(): void {
    this.profileStore.updateProfile(this.form);
    this.toastMessage = 'Profile updated successfully.';

    window.setTimeout(() => {
      this.router.navigate(['/patient-profile']);
    }, 600);
  }

  protected cancel(): void {
    this.router.navigate(['/patient-profile']);
  }

  protected onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];

    if (!file) {
      return;
    }

    this.avatarPreview = URL.createObjectURL(file);
    this.toastMessage = 'Profile photo updated for preview.';

    window.setTimeout(() => {
      this.toastMessage = '';
    }, 2200);
  }

  protected get initials(): string {
    const names = this.form.fullName.trim().split(' ');
    return `${names[0]?.charAt(0) ?? ''}${names[names.length - 1]?.charAt(0) ?? ''}`.toUpperCase();
  }
}
