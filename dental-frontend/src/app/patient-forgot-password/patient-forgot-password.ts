import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PatientSidebarComponent } from '../patient-sidebar/patient-sidebar';

@Component({
  selector: 'app-patient-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PatientSidebarComponent],
  templateUrl: './patient-forgot-password.html',
  styleUrl: './patient-forgot-password.css',
})
export class PatientForgotPasswordComponent {
  protected recovery = {
    method: 'Email' as 'Email' | 'SMS',
    destination: 'laura.martinez@email.com',
  };

  protected submitted = false;
  protected successMessage = '';

  constructor(private readonly router: Router) {}

  protected sendRecovery(): void {
    this.submitted = true;
    this.successMessage =
      this.recovery.method === 'Email'
        ? `Password reset instructions sent to ${this.recovery.destination}.`
        : `Password reset code sent to ${this.recovery.destination}.`;
  }

  protected backToChangePassword(): void {
    this.router.navigate(['/patient-profile/change-password']);
  }
}
