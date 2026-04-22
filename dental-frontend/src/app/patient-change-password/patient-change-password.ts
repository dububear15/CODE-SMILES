import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PatientSidebarComponent } from '../patient-sidebar/patient-sidebar';

@Component({
  selector: 'app-patient-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PatientSidebarComponent],
  templateUrl: './patient-change-password.html',
  styleUrl: './patient-change-password.css',
})
export class PatientChangePasswordComponent {
  protected form = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  protected visibility = {
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  };

  protected errorMessage = '';
  protected successMessage = '';

  constructor(private readonly router: Router) {}

  protected submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.form.currentPassword.trim() ||
      !this.form.newPassword.trim() ||
      !this.form.confirmPassword.trim()
    ) {
      this.errorMessage = 'Please complete all password fields.';
      return;
    }

    if (this.form.newPassword !== this.form.confirmPassword) {
      this.errorMessage = 'New password and confirmation do not match.';
      return;
    }

    this.successMessage = 'Password updated successfully.';

    window.setTimeout(() => {
      this.router.navigate(['/patient-profile']);
    }, 700);
  }

  protected cancel(): void {
    this.router.navigate(['/patient-profile']);
  }

  protected goToForgotPassword(): void {
    this.router.navigate(['/patient-profile/forgot-password']);
  }

  protected toggleVisibility(field: 'currentPassword' | 'newPassword' | 'confirmPassword'): void {
    this.visibility[field] = !this.visibility[field];
  }
}
